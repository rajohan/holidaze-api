import { Arg, Args, Query, Mutation, Resolver, Ctx } from "type-graphql";
import jwt from "jsonwebtoken";

import { generateAuthTokens } from "../../utils/generateAuthToken";
import { User } from "../models/User";
import { NewUserInput, UserIdArg, UserLoginArgs, UserChangePasswordArgs, RefreshTokenArgs } from "../inputs/UserInput";
import { TokensType, UserType, UserTypeWithToken } from "../typeDefs/UserType";
import { GraphQLContext, LoginResponse } from "../../types";
import { config } from "../../config";
import { Token } from "../models/Token";

@Resolver(User)
class UserResolver {
    @Query(() => UserType, { description: "Returns a user by ID" })
    async getUser(@Args() { id }: UserIdArg): Promise<User> {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    @Query(() => [UserType], { description: "Returns all users" })
    async getAllUsers(): Promise<User[]> {
        const users = await User.findAll({});

        if (!users) {
            throw new Error("No users could be found");
        }

        return users;
    }

    @Mutation(() => UserType, { description: "Adds a new user" })
    async addUser(@Arg("data") data: NewUserInput): Promise<User> {
        const { username, password, email } = data;
        return User.create({ username, password, email });
    }

    @Mutation(() => UserTypeWithToken, { description: "Login a user" })
    async login(@Args() { username, password }: UserLoginArgs, @Ctx() ctx: GraphQLContext): Promise<LoginResponse> {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const passwordValid = await user.verifyPassword(password);

        if (!passwordValid) {
            throw new Error("Invalid credentials");
        }

        const { authToken, refreshToken } = await generateAuthTokens(user);

        ctx.res.cookie("authRefreshToken", refreshToken, {
            maxAge: config.jwtRefreshCookieMaxAge,
            httpOnly: true,
            secure: !config.isDevMode,
            sameSite: "strict"
        });

        return { user, authToken };
    }

    @Mutation(() => UserType, { description: "Changes a users password" })
    async changePassword(@Args() { id, password }: UserChangePasswordArgs): Promise<User> {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw new Error("User does not exist");
        }

        return user.update({ password: password });
    }

    @Mutation(() => TokensType, { description: "Refreshes auth token" })
    async refreshAuthTokens(
        @Args() { id, refreshToken }: RefreshTokenArgs,
        @Ctx() ctx: GraphQLContext
    ): Promise<{ authToken: string }> {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw new Error("User does not exist");
        }

        try {
            jwt.verify(refreshToken, config.jwtRefreshSecret, {
                audience: config.jwtAudience,
                issuer: config.jwtIssuer
            });
        } catch (error) {
            throw new Error("Invalid refresh token");
        }

        const validToken = await Token.findOne({ where: { user: id, token: refreshToken } });

        if (!validToken) {
            throw new Error("Invalid refresh token");
        }

        const newTokens = await generateAuthTokens(user);

        ctx.res.cookie("authRefreshToken", refreshToken, {
            maxAge: config.jwtRefreshCookieMaxAge,
            httpOnly: true,
            secure: !config.isDevMode,
            sameSite: "strict"
        });

        return { authToken: newTokens.authToken };
    }
}

export { UserResolver };

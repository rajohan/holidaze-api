import { Arg, Args, Query, Mutation, Resolver, Ctx } from "type-graphql";
import jwt from "jsonwebtoken";

import { generateAuthTokens } from "../../utils/generateAuthToken";
import { User } from "../models/User";
import { NewUserInput, UserIdArg, UserLoginArgs, UserChangePasswordArgs } from "../inputs/UserInput";
import { TokenType, UserType, UserTypeWithToken } from "../typeDefs/UserType";
import { GraphQLContext, LoginResponse, TokenPayload } from "../../types";
import { config } from "../../config";
import { Token } from "../models/Token";
import { errorNames } from "../../utils/errors";

@Resolver(User)
class UserResolver {
    @Query(() => UserType, { description: "Returns a user by ID" })
    async getUser(@Args() { id }: UserIdArg): Promise<User> {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return user;
    }

    @Query(() => UserType, { description: "Returns current signed in user" })
    async getCurrentUser(@Ctx() ctx: GraphQLContext): Promise<User> {
        if (!ctx.user) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return ctx.user;
    }

    @Query(() => [UserType], { description: "Returns all users" })
    async getAllUsers(): Promise<User[]> {
        const users = await User.findAll({});

        if (!users) {
            throw new Error(errorNames.NOT_FOUND);
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
            throw new Error(errorNames.UNPROCESSABLE_ENTITY);
        }

        const passwordValid = await user.verifyPassword(password);

        if (!passwordValid) {
            throw new Error(errorNames.UNPROCESSABLE_ENTITY);
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
            throw new Error(errorNames.NOT_FOUND);
        }

        return user.update({ password: password });
    }

    @Mutation(() => TokenType, { description: "Refreshes auth token" })
    async refreshAuthTokens(@Ctx() ctx: GraphQLContext): Promise<TokenType> {
        if (!ctx.req.cookies || !ctx.req.cookies.authRefreshToken) {
            throw new Error(errorNames.UNPROCESSABLE_ENTITY);
        }

        const refreshToken = ctx.req.cookies.authRefreshToken;
        let decodedJwt: {} | string;

        try {
            decodedJwt = jwt.verify(refreshToken, config.jwtRefreshSecret, {
                audience: config.jwtAudience,
                issuer: config.jwtIssuer
            });
        } catch (error) {
            ctx.res.clearCookie("authRefreshToken", { httpOnly: true, secure: !config.isDevMode, sameSite: "strict" });
            throw new Error(errorNames.UNPROCESSABLE_ENTITY);
        }

        const { id } = decodedJwt as TokenPayload;

        const user = await User.findOne({ where: { id } });

        if (!user) {
            ctx.res.clearCookie("authRefreshToken", { httpOnly: true, secure: !config.isDevMode, sameSite: "strict" });
            throw new Error(errorNames.UNPROCESSABLE_ENTITY);
        }

        const validToken = await Token.findOne({ where: { user: id, token: refreshToken } });

        if (!validToken) {
            ctx.res.clearCookie("authRefreshToken", { httpOnly: true, secure: !config.isDevMode, sameSite: "strict" });
            throw new Error(errorNames.UNPROCESSABLE_ENTITY);
        }

        const newTokens = await generateAuthTokens(user);

        ctx.res.cookie("authRefreshToken", newTokens.refreshToken, {
            maxAge: config.jwtRefreshCookieMaxAge,
            httpOnly: true,
            secure: !config.isDevMode,
            sameSite: "strict"
        });

        return { authToken: newTokens.authToken };
    }
}

export { UserResolver };

import { Arg, Args, Query, Mutation, Resolver, Ctx } from "type-graphql";
import jwt from "jsonwebtoken";

import { config } from "../../config";
import { errorNames } from "../../utils/errors";
import { generateAuthTokens } from "../../utils/generateAuthToken";
import { setRefreshTokenCookie } from "../../utils/setRefreshTokenCookie";
import { clearRefreshTokenCookie } from "../../utils/clearRefreshTokenCookie";
import { User } from "../models/User";
import {
    NewUserInput,
    UserIdArg,
    UserLoginArgs,
    UserChangePasswordArgs,
    UserForgotPasswordArgs,
    UserForgotPasswordVerifyArgs
} from "../inputs/UserInput";
import { LogoutType, UserType, UserWithTokenType } from "../typeDefs/UserType";
import { GraphQLContext, TokenPayload } from "../../types";
import { Token } from "../models/Token";
import { Newsletter } from "../models/Newsletter";
import { ForgotPassword } from "../models/ForgotPassword";
import { generateRandomPassword } from "../../utils/generateRandomPassword";
import { sendMail } from "../../utils/sendMail";
import { generateForgotPasswordToken } from "../../utils/generateForgotPasswordToken";

@Resolver(User)
class UserResolver {
    @Query(() => UserType, { description: "Returns a user by ID" })
    async getUser(@Args() { id }: UserIdArg): Promise<UserType> {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return user;
    }

    @Query(() => [UserType], { description: "Returns all users" })
    async getAllUsers(): Promise<UserType[]> {
        const users = await User.findAll({});

        if (!users) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return users;
    }

    @Mutation(() => UserType, { description: "Adds a new user" })
    async addUser(@Arg("data") data: NewUserInput): Promise<UserType> {
        const { username, password, email, name, newsletters } = data;
        const usernameTaken = await User.findOne({ where: { username } });
        const emailTaken = await User.findOne({ where: { email } });
        const isOnNewsletterList = await Newsletter.findOne({ where: { email } });

        if (usernameTaken) {
            throw Error(errorNames.USERNAME_TAKEN);
        }

        if (emailTaken) {
            throw Error(errorNames.EMAIL_TAKEN);
        }

        if (newsletters && !isOnNewsletterList) {
            await Newsletter.create({ email });
        } else if (!newsletters && isOnNewsletterList) {
            await Newsletter.destroy({ where: { email } });
        }

        if (!password) {
            const newPassword = generateRandomPassword();
            await sendMail({
                to: email,
                subject: "Welcome To Holidaze",
                text: `Welcome to holidaze\n\nYour password is: ${newPassword}\n\nBest regards Holidaze Support`,
                html: `<h1>Welcome to holidaze</h1><p>Your password is ${newPassword}</p><p>Best regards Holidaze Support</p>`
            });
            return User.create({ username, password: newPassword, email, name });
        }

        await sendMail({
            to: email,
            subject: "Welcome To Holidaze",
            text: `Welcome to holidaze\n\nYour password is: ${password}\n\nBest regards Holidaze Support`,
            html: `<h1>Welcome to holidaze</h1><p>Your password is ${password}</p><p>Best regards Holidaze Support</p>`
        });
        return User.create({ username, password, email, name });
    }

    @Mutation(() => UserWithTokenType, { description: "Login a user" })
    async login(@Args() { username, password }: UserLoginArgs, @Ctx() ctx: GraphQLContext): Promise<UserWithTokenType> {
        let user = await User.findOne({ where: { username } });

        if (!user) {
            user = await User.findOne({ where: { email: username } });

            if (!user) {
                throw new Error(errorNames.UNPROCESSABLE_ENTITY);
            }
        }

        const passwordValid = await user.verifyPassword(password);

        if (!passwordValid) {
            throw new Error(errorNames.UNPROCESSABLE_ENTITY);
        }

        const { authToken, refreshToken } = await generateAuthTokens(user);

        setRefreshTokenCookie(ctx.res, refreshToken);

        return { authToken, user };
    }

    @Mutation(() => LogoutType, { description: "Logout a user" })
    async logout(@Ctx() ctx: GraphQLContext): Promise<LogoutType> {
        if (ctx.user && ctx.user.id) {
            await Token.destroy({ where: { user: ctx.user.id } });
        }

        clearRefreshTokenCookie(ctx.res);

        return { loggedOut: true };
    }

    @Mutation(() => UserType, { description: "Creates a token to reset a users password" })
    async forgotPassword(@Args() { email }: UserForgotPasswordArgs, @Ctx() ctx: GraphQLContext): Promise<UserType> {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error(errorNames.NOT_FOUND);
        }

        const token = generateForgotPasswordToken(user);

        await ForgotPassword.destroy({ where: { user: user.id } });
        await ForgotPassword.create({ user: user.id, token: token });

        await sendMail({
            to: email,
            subject: "Reset password on Holidaze",
            text: `We got a request to reset your password on Holidaze\n\n
                   To complete this request please follow the link below and set a new password\n\n
                   ${ctx.req.headers.origin}/forgotPassword/${token}\n\n
                   The reset password token will expire in 15 minutes.\n\n
                   If you did not request this password reset you can ignore this email.\n\n
                   Best regards Holidaze Support
                   `,
            html: `<p>We got a request to reset your password on Holidaze</p>
                   <p>To complete this request please follow the link below and set a new password</p>
                   <p>${ctx.req.headers.origin}/forgotPassword/${token}</p>
                   <p>The reset password token will expire in 15 minutes.</p>
                   <p>If you did not request this password reset you can ignore this email.</p>
                   <p>Best regards Holidaze Support</p>
                  `
        });

        return user;
    }

    @Mutation(() => UserType, { description: "Completes a forgot password request" })
    async forgotPasswordVerify(@Args() { newPassword, token }: UserForgotPasswordVerifyArgs): Promise<UserType> {
        try {
            jwt.verify(token, config.jwtSecret, {
                audience: config.jwtAudience,
                issuer: config.jwtIssuer
            });
        } catch (error) {
            throw new Error(errorNames.UNPROCESSABLE_ENTITY);
        }

        const userId = await ForgotPassword.findOne({ where: { token } });

        if (!userId) {
            throw new Error(errorNames.NOT_FOUND);
        }

        const user = await User.findOne({ where: { id: userId.user } });

        if (!user) {
            throw new Error(errorNames.NOT_FOUND);
        }

        await user.update({ password: newPassword });
        await userId.destroy();

        return user;
    }

    @Mutation(() => UserType, { description: "Changes a users password" })
    async changePassword(@Args() { id, password }: UserChangePasswordArgs): Promise<UserType> {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return user.update({ password: password });
    }

    @Mutation(() => UserWithTokenType, { description: "Refreshes auth token" })
    async refreshAuthTokens(@Ctx() ctx: GraphQLContext): Promise<UserWithTokenType> {
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
            clearRefreshTokenCookie(ctx.res);
            throw new Error(errorNames.UNPROCESSABLE_ENTITY);
        }

        const { id } = decodedJwt as TokenPayload;

        const user = await User.findOne({ where: { id } });

        if (!user) {
            clearRefreshTokenCookie(ctx.res);
            throw new Error(errorNames.UNPROCESSABLE_ENTITY);
        }

        const validToken = await Token.findOne({ where: { user: id, token: refreshToken } });

        if (!validToken) {
            clearRefreshTokenCookie(ctx.res);
            throw new Error(errorNames.UNPROCESSABLE_ENTITY);
        }

        const newTokens = await generateAuthTokens(user);

        setRefreshTokenCookie(ctx.res, newTokens.refreshToken);

        return { authToken: newTokens.authToken, user };
    }
}

export { UserResolver };

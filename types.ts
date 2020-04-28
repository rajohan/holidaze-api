import { Request } from "express";
import { User } from "./api/models/User";

export type TokenPayload = {
    id: number;
    aud: string;
    iss: string;
    iat: number;
    nbf: number;
    exp: number;
};

export type Tokens = {
    authToken: string;
    refreshToken: string;
};

export type LoginResponse = {
    user: User;
    authToken: string;
    refreshToken: string;
};

export type AccessLevels = "MODERATOR" | "ADMIN";
export type GraphQLContext = { req: Request; user: User | null };

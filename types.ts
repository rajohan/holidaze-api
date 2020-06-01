import { Request, Response } from "express";
import { User } from "./api/models/User";

export type TokenPayload = {
    id: string;
    aud: string;
    iss: string;
    iat: number;
    exp: number;
};

export type Tokens = {
    authToken: string;
    refreshToken: string;
};

export type AccessLevels = "MODERATOR" | "ADMIN";
export type GraphQLContext = { req: Request; res: Response; user: User | null };

export type Mail = {
    to: string;
    subject: string;
    text: string;
    html: string;
};

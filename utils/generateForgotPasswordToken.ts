import { TokenPayload } from "../types";
import { config } from "../config";
import { User } from "../api/models/User";
import jwt from "jsonwebtoken";

const generateForgotPasswordToken = (user: User): string => {
    const payloadAuthToken: TokenPayload = {
        id: user.id,
        aud: config.jwtAudience,
        iss: config.jwtIssuer,
        iat: Date.now() / 1000,
        exp: config.jwtExpiresIn()
    };

    const authToken = jwt.sign(payloadAuthToken, config.jwtSecret);

    return authToken;
};

export { generateForgotPasswordToken };

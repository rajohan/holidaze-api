import jwt from "jsonwebtoken";

import { config } from "../config";
import { User } from "../api/models/User";
import { Token } from "../api/models/Token";
import { TokenPayload, Tokens } from "../types";

const generateAuthTokens = async (user: User): Promise<Tokens> => {
    const payloadAuthToken: TokenPayload = {
        id: user.id,
        aud: config.jwtAudience,
        iss: config.jwtIssuer,
        iat: Date.now() / 1000,
        exp: config.jwtExpiresIn
    };

    const payloadRefreshToken: TokenPayload = {
        ...payloadAuthToken,
        exp: config.jwtRefreshExpiresIn
    };

    const authToken = jwt.sign(payloadAuthToken, config.jwtSecret);
    const refreshToken = jwt.sign(payloadRefreshToken, config.jwtRefreshSecret);

    await Token.destroy({ where: { user: user.id } });
    await Token.create({ user: user.id, token: refreshToken });

    return { authToken, refreshToken };
};

export { generateAuthTokens };

import { Response } from "express";

import { config } from "../config";

const setRefreshTokenCookie = (response: Response, refreshToken: string): void => {
    response.cookie(config.jwtRefreshCookieKey, refreshToken, {
        maxAge: config.jwtRefreshCookieMaxAge,
        httpOnly: true,
        secure: !config.isDevMode,
        sameSite: config.jwtRefreshCookieSameSite
    });
};

export { setRefreshTokenCookie };

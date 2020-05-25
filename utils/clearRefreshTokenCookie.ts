import { Response } from "express";

import { config } from "../config";

const clearRefreshTokenCookie = (response: Response): void => {
    response.clearCookie(config.jwtRefreshCookieKey, {
        httpOnly: true,
        secure: !config.isDevMode,
        sameSite: config.jwtRefreshCookieSameSite
    });
};

export { clearRefreshTokenCookie };

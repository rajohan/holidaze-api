import { MethodAndPropDecorator } from "type-graphql/dist/decorators/types";
import { TokenPayload, AccessLevels } from "./types";

declare module "express-serve-static-core" {
    interface Request {
        user: TokenPayload;
    }
}

declare module "type-graphql" {
    function Authorized(): MethodAndPropDecorator;
    function Authorized(roles: AccessLevels[]): MethodAndPropDecorator;
    function Authorized(...roles: AccessLevels[]): MethodAndPropDecorator;
}

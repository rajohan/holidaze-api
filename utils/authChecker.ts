import { AuthChecker } from "type-graphql";

import { GraphQLContext, AccessLevels } from "../types";
import { errorNames } from "./errors";

const authChecker: AuthChecker<GraphQLContext, AccessLevels> = ({ context }, roles): boolean => {
    const { user } = context;

    if (!user) {
        throw new Error(errorNames.UNAUTHORIZED);
    }

    if (roles.length === 0) {
        return true;
    }

    if (user.accessLevel > 0 && roles.includes("MODERATOR")) {
        return true;
    }

    if (user.accessLevel > 1 && roles.includes("ADMIN")) {
        return true;
    }

    throw new Error(errorNames.FORBIDDEN);
};

export { authChecker };

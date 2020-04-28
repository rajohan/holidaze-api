import { AuthChecker } from "type-graphql";

import { GraphQLContext, AccessLevels } from "../types";

const authChecker: AuthChecker<GraphQLContext, AccessLevels> = ({ context }, roles): boolean => {
    const { user } = context;

    if (!user) {
        return false;
    }

    if (roles.length === 0) {
        return true;
    }

    if (user.accessLevel > 0 && roles.includes("MODERATOR")) {
        return true;
    }

    return user.accessLevel > 1 && roles.includes("ADMIN");
};

export { authChecker };

const errorNames = {
    BAD_REQUEST: "BAD_REQUEST",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR"
};

const errorTypes = {
    BAD_REQUEST: {
        message: "Bad Request",
        statusCode: 400
    },
    UNAUTHORIZED: {
        message: "Unauthorized",
        statusCode: 401
    },
    FORBIDDEN: {
        message: "Forbidden",
        statusCode: 403
    },
    NOT_FOUND: {
        message: "Not Found",
        statusCode: 404
    },
    UNPROCESSABLE_ENTITY: {
        message: "Unprocessable Entity",
        statusCode: 422
    },
    INTERNAL_SERVER_ERROR: {
        message: "Internal Server Error",
        statusCode: 500
    }
};

const getError = (error: keyof typeof errorNames): { message: string; statusCode: number } => errorTypes[error];

export { errorNames, getError };

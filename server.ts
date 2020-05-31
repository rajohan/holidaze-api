import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import jwt from "express-jwt";
import { Sequelize } from "sequelize-typescript";
import { buildSchema } from "type-graphql";

import { config } from "./config";
import { authChecker } from "./utils/authChecker";
import { ContactResolver } from "./api/resolvers/ContactResolver";
import { EnquiryResolver } from "./api/resolvers/EnquiryResolver";
import { UserResolver } from "./api/resolvers/UserResolver";
import { EstablishmentResolver } from "./api/resolvers/EstablishmentResolver";
import { User } from "./api/models/User";
import { insertInitialData } from "./data/initialData";
import { errorNames, getError } from "./utils/errors";
import { Establishment } from "./api/models/Establishment";

// const corsOptions = (origin: string | undefined, cb: (err: null, allow?: boolean) => void): void => {
//     if (origin && config.allowedOrigins.includes(origin)) {
//         return cb(null, true);
//     }
//     return cb(null, false);
// };

const startServer = async (): Promise<void> => {
    const app = express();

    app.use(compression());
    app.use(cookieParser());
    app.use(cors({ origin: true /* corsOptions */, credentials: true }));

    app.use(
        "/graphql",
        jwt({
            secret: config.jwtSecret,
            credentialsRequired: false,
            audience: config.jwtAudience,
            issuer: config.jwtIssuer
        })
    );

    // Remove auth token if it is invalid
    app.use((error: Error, req: Request, _: Response, next: NextFunction) => {
        if (error.name === "UnauthorizedError") {
            delete req.headers["authorization"];
        }

        next();
    });

    const schema = await buildSchema({
        resolvers: [UserResolver, ContactResolver, EnquiryResolver, EstablishmentResolver],
        authChecker: authChecker,
        validate: false
    });

    // Setup and initialize the database connection
    const sequelize = new Sequelize({
        database: config.postgresDatabase,
        username: config.postgresUsername,
        password: config.postgresPassword,
        host: config.postgresHost,
        port: config.postgresPort,
        dialect: "postgres",
        logging: false,
        models: [__dirname + "/api/models"]
    });

    // Setup and initialize the graphQL server
    const graphQlServer = new ApolloServer({
        schema,
        context: async ({ req, res }): Promise<{ req: Request; res: Response; user: User | null }> => {
            if (req.user && req.user.id) {
                const user = await User.findOne({ where: { id: req.user.id } });
                return { req, res, user: user };
            }
            return { req, res, user: null };
        },
        formatError: (error): { message: string; statusCode: number } => {
            const errorType = getError(error.message as keyof typeof errorNames);

            if (errorType) {
                return { message: errorType.message, statusCode: errorType.statusCode };
            }

            return { message: error.message, statusCode: 400 };
        },
        playground: true, //config.isDevMode
        introspection: true //config.isDevMode
    });

    graphQlServer.applyMiddleware({
        app,
        path: "/graphql",
        cors: {
            origin: true, // corsOptions
            credentials: true
        }
    });

    // Check database connection
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }

    // Synchronize models
    try {
        await sequelize.sync({ force: true });
        await insertInitialData();
        await Establishment.addSearchTSVector(sequelize);
        const search = await Establishment.search(sequelize, "hotel relax");
        console.log(search);
    } catch (error) {
        console.error("Unable to synchronize models.", error);
    }

    // Send status code 500 without any stack trace if any errors and NODE_ENV = production
    app.use((error: Error, _: Request, res: Response, next: NextFunction) => {
        if (error && !config.isDevMode) {
            res.status(500).json({ message: "Internal Server Error" });
            next();
        } else {
            res.status(500).json({ message: "Internal Server Error" });
            next(error);
        }
    });

    // Start the server
    app.listen({ port: config.port }, (): void => {
        console.log(`Server ready at http://localhost:${config.port}`);
        console.log(`GraphQL ready at http://localhost:${config.port}${graphQlServer.graphqlPath}`);
    });
};

startServer().catch((error) => console.error("Unable to start the server", error));

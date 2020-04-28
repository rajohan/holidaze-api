const config = {
    isDevMode: process.env.NODE_ENV !== "production",
    postgresUsername: process.env.postgresUsername || "postgres",
    postgresPassword: process.env.postgresPassword || "test",
    postgresDatabase: process.env.postgresDatabase || "rajohan",
    postgresHost: process.env.postgresHost || "localhost",
    postgresPort: (process.env.postgresPort as number | undefined) || 5432,
    jwtSecret: process.env.jwtSecret || "testSecret",
    jwtRefreshSecret: process.env.jwtRefreshSecret || "testSecret2",
    jwtAudience: process.env.jwtAudience || "holidaze",
    jwtIssuer: process.env.jwtIssuer || "api.holidaze",
    jwtExpiresIn: Math.floor(Date.now() / 1000) + 60 * 15, // 15 min
    jwtRefreshExpiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
    port: process.env.PORT || 8080,
    allowedOrigins: [
        `http://localhost:${process.env.PORT || 8080}`,
        "http://localhost:3000",
        "api-holidaze.herokuapp.com",
        "62.16.156.154"
    ]
};

export { config };

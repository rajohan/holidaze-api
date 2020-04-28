let dbCredentials: string[] = [];

if (process.env.DATABASE_URL) {
    dbCredentials = process.env.DATABASE_URL.split(/^postgres:\/\/(.*?):(.*?)@(.*?):([1-9]+)\/(.*)$/).filter(
        (elm) => elm.length > 0
    );
}

const config = {
    isDevMode: process.env.NODE_ENV !== "production",
    postgresUsername: dbCredentials[0] || "postgres",
    postgresPassword: dbCredentials[1] || "test",
    postgresDatabase: dbCredentials[4] || "rajohan",
    postgresHost: dbCredentials[2] || "localhost",
    postgresPort: parseInt(dbCredentials[3]) || 5432,
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
        "api-holidaze.herokuapp.com"
    ]
};

export { config };

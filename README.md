# Holidaze GraphQL API Server

To get the mail service working you will need to create a .env file with your [SendGrid](https://sendgrid.com)
API key.

Ex: sendGridApiKey=mySendGridApiKey

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the server in the development mode.<br />
Open [http://localhost:8080/graphql](http://localhost:8080/graphql) for the GraphQL playground.

API endpoint to query/mutate data: [http://localhost:8080/graphql](http://localhost:8080/graphql)

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn start`

Runs the server in production mode (The GraphQL playground will be disabled)<br />

API endpoint to query/mutate data: [http://localhost:8080/graphql](http://localhost:8080/graphql)

**NB: You will need to add the host of the app that performs querys/mutates to the allowedOrigins array in the [config](https://github.com/rajohan/holidaze-api/blob/master/config/index.ts) for it to have access to the API (http://localhost:3000 is added by default)**

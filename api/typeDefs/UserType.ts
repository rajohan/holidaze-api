import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "Object representing a user" })
class UserType {
    @Field(() => ID)
    id!: string;

    @Field()
    username!: string;

    @Field()
    email!: string;

    @Field()
    name!: string;

    @Field(() => Int)
    accessLevel?: number;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}

@ObjectType({ description: "Object representing a user with auth token" })
class UserWithTokenType {
    @Field()
    authToken!: string;

    @Field()
    user!: UserType;
}

@ObjectType({ description: "Object representing a logout response" })
class LogoutType {
    @Field()
    loggedOut!: boolean;
}

export { UserType, UserWithTokenType, LogoutType };

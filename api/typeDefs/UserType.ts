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
    verified?: boolean;

    @Field(() => Int)
    accessLevel?: number;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}

@ObjectType({ description: "Object representing a user with auth token" })
class AuthTokenType {
    @Field()
    authToken!: string;
}

export { UserType, AuthTokenType };

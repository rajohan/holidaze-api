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
class UserTypeWithToken {
    @Field()
    user!: UserType;

    @Field()
    authToken!: string;
}

@ObjectType({ description: "Object representing auth token" })
class TokenType {
    @Field()
    authToken!: string;
}

export { UserType, UserTypeWithToken, TokenType };

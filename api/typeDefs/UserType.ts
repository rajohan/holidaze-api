import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "Object representing a user" })
class UserType {
    @Field(() => ID)
    id!: number;

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
class UserTypeWithTokens {
    @Field()
    user!: UserType;

    @Field()
    authToken!: string;

    @Field()
    refreshToken!: string;
}

@ObjectType({ description: "Object representing auth token and refresh token" })
class TokensType {
    @Field()
    authToken!: string;

    @Field()
    refreshToken!: string;
}

export { UserType, UserTypeWithTokens, TokensType };

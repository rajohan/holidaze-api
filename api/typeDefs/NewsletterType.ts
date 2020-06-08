import { Field, ID, ObjectType } from "type-graphql";

@ObjectType({ description: "Object representing a email signed up for newsletters" })
class NewsletterType {
    @Field(() => ID)
    id!: string;

    @Field()
    email!: string;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}

@ObjectType({ description: "Object representing if a user is on the newsletter list" })
class IsOnNewsletterListType {
    @Field()
    isOnNewsletterList!: boolean;
}

export { NewsletterType, IsOnNewsletterListType };

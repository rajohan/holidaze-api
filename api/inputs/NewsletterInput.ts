import { ArgsType, Field, InputType } from "type-graphql";

import { NewsletterType } from "../typeDefs/NewsletterType";

@InputType({ description: "Add email to the newsletter list input" })
class AddToNewsletterInput implements Partial<NewsletterType> {
    @Field()
    email!: string;
}

@InputType({ description: "Remove email from the newsletter list input" })
class RemoveFromNewsletterInput implements Partial<NewsletterType> {
    @Field()
    email!: string;
}

@ArgsType()
class IsOnNewsletterListArgs {
    @Field()
    email!: string;
}

export { AddToNewsletterInput, RemoveFromNewsletterInput, IsOnNewsletterListArgs };

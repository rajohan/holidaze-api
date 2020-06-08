import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";

import { IsOnNewsletterListType, NewsletterType } from "../typeDefs/NewsletterType";
import { Newsletter } from "../models/Newsletter";
import { AddToNewsletterInput, IsOnNewsletterListArgs, RemoveFromNewsletterInput } from "../inputs/NewsletterInput";

@Resolver(Newsletter)
class NewsletterResolver {
    @Query(() => IsOnNewsletterListType, { description: "Checks if a email is on the newsletter list" })
    async isOnNewsletterList(@Args() { email }: IsOnNewsletterListArgs): Promise<IsOnNewsletterListType> {
        const isOnList = await Newsletter.findOne({ where: { email } });

        return { isOnNewsletterList: !!isOnList };
    }

    @Mutation(() => NewsletterType, { description: "Adds a email to the newsletter list" })
    async AddToNewsletter(@Arg("data") data: AddToNewsletterInput): Promise<Newsletter> {
        const { email } = data;
        const isOnList = await Newsletter.findOne({ where: { email } });

        if (isOnList) {
            await Newsletter.destroy({ where: { email } });
        }

        return Newsletter.create({ email });
    }

    @Mutation(() => NewsletterType, { description: "Removes a email from the newsletter list" })
    async RemoveFromNewsletter(@Arg("data") data: RemoveFromNewsletterInput): Promise<Newsletter | null> {
        const { email } = data;
        const isOnList = await Newsletter.findOne({ where: { email } });

        if (isOnList) {
            await Newsletter.destroy({ where: { email } });
        }

        return isOnList;
    }
}

export { NewsletterResolver };

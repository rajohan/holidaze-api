import { Arg, Mutation, Resolver } from "type-graphql";

import { NewsletterType } from "../typeDefs/NewsletterType";
import { Newsletter } from "../models/Newsletter";
import { AddToNewsletterInput, RemoveFromNewsletterInput } from "../inputs/NewsletterInput";

@Resolver(NewsletterType)
class NewsletterResolver {
    @Mutation(() => NewsletterType, { description: "Adds a email to the newsletter list" })
    async AddToNewsletter(@Arg("data") data: AddToNewsletterInput): Promise<Newsletter> {
        const { email } = data;
        const isOnList = await Newsletter.findOne({ where: { email } });

        if (isOnList) {
            await Newsletter.destroy({ where: { email } });
            return isOnList;
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

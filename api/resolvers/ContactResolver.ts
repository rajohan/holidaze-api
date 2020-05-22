import { Arg, Args, Authorized, Mutation, Query, Resolver } from "type-graphql";

import { errorNames } from "../../utils/errors";
import { Contact } from "../models/Contact";
import { NewContactInput, ContactIdArg } from "../inputs/ContactInput";
import { ContactType } from "../typeDefs/ContactType";

@Resolver(ContactType)
class ContactResolver {
    @Authorized(["MODERATOR", "ADMIN"])
    @Query(() => ContactType, { description: "Returns a message by ID" })
    async getMessage(@Args() { id }: ContactIdArg): Promise<Contact> {
        const message = await Contact.findOne({ where: { id } });

        if (!message) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return message;
    }

    @Authorized(["MODERATOR", "ADMIN"])
    @Query(() => [ContactType], { description: "Returns all messages" })
    async getAllMessages(): Promise<Contact[]> {
        const messages = await Contact.findAll({});

        if (!messages) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return messages;
    }

    @Mutation(() => ContactType, { description: "Adds a new message" })
    async addMessage(@Arg("data") data: NewContactInput): Promise<Contact> {
        const { clientName, email, message } = data;

        return Contact.create({ clientName, email, message });
    }
}

export { ContactResolver };

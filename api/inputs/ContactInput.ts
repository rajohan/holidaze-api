import { InputType, Field, ArgsType, ID } from "type-graphql";
import { ContactType } from "../typeDefs/ContactType";

@InputType({ description: "New contact data" })
class NewContactInput implements Partial<ContactType> {
    @Field()
    clientName!: string;

    @Field()
    email!: string;

    @Field()
    message!: string;
}

@ArgsType()
class ContactIdArg {
    @Field(() => ID)
    id!: string;
}

export { NewContactInput, ContactIdArg };

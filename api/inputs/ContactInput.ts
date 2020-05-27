import { InputType, Field, ArgsType, ID, Int } from "type-graphql";
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

@InputType({ description: "Change message status data" })
class ChangeContactStatusInput implements Partial<ContactType> {
    @Field(() => ID)
    id!: string;

    @Field(() => Int)
    status!: number;
}

@ArgsType()
class ContactIdArg {
    @Field(() => ID)
    id!: string;
}

export { NewContactInput, ContactIdArg, ChangeContactStatusInput };

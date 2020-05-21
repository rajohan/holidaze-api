import { InputType, Field, ArgsType, ID } from "type-graphql";
import { EnquiryType } from "../typeDefs/EnquiryType";

@InputType({ description: "New enquiry data" })
class NewEnquiryInput implements Partial<EnquiryType> {
    @Field(() => ID)
    establishmentId!: string;

    @Field()
    clientName!: string;

    @Field()
    email!: string;

    @Field()
    checkin!: Date;

    @Field()
    checkout!: Date;
}

@InputType({ description: "Update enquiry data" })
class UpdateEnquiryInput implements Partial<EnquiryType> {
    @Field(() => ID)
    id!: string;

    @Field({ nullable: true })
    clientName?: string;

    @Field({ nullable: true })
    checkin?: Date;

    @Field({ nullable: true })
    checkout?: Date;
}

@ArgsType()
class EnquiryIdArg {
    @Field(() => ID)
    id!: string;
}

@ArgsType()
class EnquiryWithEstablishmentArg {
    @Field({ defaultValue: false })
    withEstablishment!: boolean;
}

export { NewEnquiryInput, UpdateEnquiryInput, EnquiryIdArg, EnquiryWithEstablishmentArg };

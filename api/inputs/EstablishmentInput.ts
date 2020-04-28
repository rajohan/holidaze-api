import { InputType, Field, ArgsType, ID } from "type-graphql";
import { EstablishmentType } from "../typeDefs/EstablishmentType";

@InputType({ description: "New establishment data" })
class NewEstablishmentInput implements Partial<EstablishmentType> {
    @Field()
    name!: string;

    @Field()
    email!: string;

    @Field()
    imageUrl!: string;

    @Field()
    price!: number;

    @Field()
    maxGuests!: number;

    @Field()
    googleLat!: number;

    @Field()
    googleLong!: number;

    @Field()
    description!: string;

    @Field()
    selfCatering!: boolean;
}

@InputType({ description: "New establishment data" })
class UpdateEstablishmentInput implements Partial<EstablishmentType> {
    @Field(() => ID)
    id!: number;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field({ nullable: true })
    price?: number;

    @Field({ nullable: true })
    maxGuests?: number;

    @Field({ nullable: true })
    googleLat?: number;

    @Field({ nullable: true })
    googleLong?: number;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    selfCatering?: boolean;
}

@ArgsType()
class EstablishmentIdArg {
    @Field(() => ID)
    id!: number;
}

@ArgsType()
class EstablishmentWithEnquiryArg {
    @Field({ defaultValue: false })
    withEnquiries!: boolean;
}

export { NewEstablishmentInput, UpdateEstablishmentInput, EstablishmentIdArg, EstablishmentWithEnquiryArg };

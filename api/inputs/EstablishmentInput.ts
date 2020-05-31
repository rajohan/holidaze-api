import { InputType, Field, ArgsType, ID, Int, Float } from "type-graphql";
import { EstablishmentType } from "../typeDefs/EstablishmentType";

@InputType({ description: "New establishment data" })
class NewEstablishmentInput implements Partial<EstablishmentType> {
    @Field()
    name!: string;

    @Field()
    email!: string;

    @Field()
    imageUrl!: string;

    @Field(() => Float)
    price!: number;

    @Field(() => Int)
    maxGuests!: number;

    @Field(() => Float)
    googleLat!: number;

    @Field(() => Float)
    googleLong!: number;

    @Field()
    description!: string;

    @Field()
    selfCatering!: boolean;
}

@InputType({ description: "New establishment data" })
class UpdateEstablishmentInput implements Partial<EstablishmentType> {
    @Field(() => ID)
    id!: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field(() => Float, { nullable: true })
    price?: number;

    @Field(() => Int, { nullable: true })
    maxGuests?: number;

    @Field(() => Float, { nullable: true })
    googleLat?: number;

    @Field(() => Float, { nullable: true })
    googleLong?: number;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    selfCatering?: boolean;
}

@ArgsType()
class EstablishmentIdArg {
    @Field(() => ID)
    id!: string;
}

@ArgsType()
class EstablishmentWithEnquiryArg {
    @Field({ defaultValue: false })
    withEnquiries!: boolean;
}

@ArgsType()
class EstablishmentSearchArg {
    @Field()
    searchQuery!: string;
}

export {
    NewEstablishmentInput,
    UpdateEstablishmentInput,
    EstablishmentIdArg,
    EstablishmentWithEnquiryArg,
    EstablishmentSearchArg
};

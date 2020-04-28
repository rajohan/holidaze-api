import { Field, ID, ObjectType, Float, Int } from "type-graphql";

import { EnquiryType } from "./EnquiryType";

@ObjectType({ description: "Object representing a establishment" })
class EstablishmentType {
    @Field(() => ID)
    id!: number;

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

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;

    @Field(() => EnquiryType, { nullable: true })
    enquiries?: [EnquiryType];
}

export { EstablishmentType };

import { Field, ID, Int, ObjectType } from "type-graphql";

import { EstablishmentType } from "./EstablishmentType";

@ObjectType({ description: "Object representing a enquiry" })
class EnquiryType {
    @Field(() => ID)
    id!: string;

    @Field()
    clientName!: string;

    @Field()
    email!: string;

    @Field(() => Int)
    guests!: number;

    @Field()
    checkin!: Date;

    @Field()
    checkout!: Date;

    @Field(() => Int)
    status!: number;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;

    @Field(() => EstablishmentType)
    establishment!: EstablishmentType;
}

export { EnquiryType };

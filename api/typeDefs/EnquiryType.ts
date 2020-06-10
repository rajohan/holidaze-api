import { Field, ID, Int, ObjectType } from "type-graphql";

import { EstablishmentType } from "./EstablishmentType";
import { UserType } from "./UserType";

@ObjectType({ description: "Object representing a enquiry" })
class EnquiryType {
    @Field(() => ID)
    id!: string;

    @Field(() => ID)
    establishmentId!: string;

    @Field(() => ID)
    userId!: string;

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

    @Field(() => UserType)
    user!: UserType;
}

export { EnquiryType };

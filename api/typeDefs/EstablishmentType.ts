import { Field, ID, ObjectType, Float, Int } from "type-graphql";

import { EnquiryType } from "./EnquiryType";
import { WishlistType } from "./WishlistType";
import { RateType } from "./RateType";

@ObjectType({ description: "Object representing a establishment" })
class EstablishmentType {
    @Field(() => ID)
    id!: string;

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

    @Field(() => RateType, { nullable: true })
    rating?: [RateType];

    @Field(() => EnquiryType, { nullable: true })
    enquiries?: [EnquiryType];

    @Field(() => WishlistType, { nullable: true })
    wishlist?: [WishlistType];
}

export { EstablishmentType };

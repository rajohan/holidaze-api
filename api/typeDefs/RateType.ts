import { Field, Float, ID, ObjectType } from "type-graphql";

@ObjectType({ description: "Object representing a wishlist item" })
class RateType {
    @Field(() => ID)
    id!: string;

    @Field(() => Float)
    rating!: number;

    @Field(() => ID)
    userId!: string;

    @Field(() => ID)
    establishmentId!: string;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}

export { RateType };

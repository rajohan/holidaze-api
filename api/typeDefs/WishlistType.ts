import { Field, ID, ObjectType } from "type-graphql";

@ObjectType({ description: "Object representing a wishlist item" })
class WishlistType {
    @Field(() => ID)
    id!: string;

    @Field(() => ID)
    userId!: string;

    @Field(() => ID)
    establishmentId!: string;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}

export { WishlistType };

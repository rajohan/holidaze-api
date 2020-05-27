import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "Object representing a contact message" })
class ContactType {
    @Field(() => ID)
    id!: string;

    @Field()
    clientName!: string;

    @Field()
    email!: string;

    @Field()
    message!: string;

    @Field(() => Int)
    status!: number;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}

export { ContactType };

import { InputType, Field, ArgsType, ID } from "type-graphql";
import { UserType } from "../typeDefs/UserType";

@InputType({ description: "New user data" })
class NewUserInput implements Partial<UserType> {
    @Field()
    username!: string;

    @Field()
    password!: string;

    @Field()
    email!: string;
}

@ArgsType()
class UserIdArg {
    @Field(() => ID)
    id!: string;
}

@ArgsType()
class UserLoginArgs {
    @Field()
    username!: string;

    @Field()
    password!: string;
}

@ArgsType()
class UserChangePasswordArgs {
    @Field(() => ID)
    id!: string;

    @Field()
    password!: string;
}

export { NewUserInput, UserIdArg, UserLoginArgs, UserChangePasswordArgs };

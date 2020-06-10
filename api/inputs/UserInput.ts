import { InputType, Field, ArgsType } from "type-graphql";
import { UserType } from "../typeDefs/UserType";

@InputType({ description: "New user data" })
class NewUserInput implements Partial<UserType> {
    @Field()
    username!: string;

    @Field()
    password?: string;

    @Field()
    email!: string;

    @Field()
    name!: string;

    @Field()
    newsletters?: boolean;
}

@InputType({ description: "Edit user data" })
class EditUserInput implements Partial<UserType> {
    @Field()
    username!: string;

    @Field()
    email!: string;

    @Field()
    name!: string;

    @Field()
    newsletters!: boolean;
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
    @Field()
    password!: string;
}

@ArgsType()
class UserForgotPasswordArgs {
    @Field()
    email!: string;
}

@ArgsType()
class UserForgotPasswordVerifyArgs {
    @Field()
    newPassword!: string;

    @Field()
    token!: string;
}

export {
    NewUserInput,
    UserLoginArgs,
    UserChangePasswordArgs,
    UserForgotPasswordArgs,
    UserForgotPasswordVerifyArgs,
    EditUserInput
};

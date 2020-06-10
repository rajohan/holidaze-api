import { Arg, Args, Query, Mutation, Resolver, Authorized, Ctx } from "type-graphql";

import { errorNames } from "../../utils/errors";
import { Enquiry } from "../models/Enquiry";
import {
    NewEnquiryInput,
    UpdateEnquiryInput,
    EnquiryIdArg,
    EnquiryWithEstablishmentArg,
    ChangeEnquiryStatusInput
} from "../inputs/EnquiryInput";
import { EnquiryType } from "../typeDefs/EnquiryType";
import { GraphQLContext } from "../../types";
import { Establishment } from "../models/Establishment";
import { User } from "../models/User";
import { generateRandomUsername } from "../../utils/generateRandomUsername";
import { generateRandomPassword } from "../../utils/generateRandomPassword";
import { sendMail } from "../../utils/sendMail";

@Resolver(Enquiry)
class EnquiryResolver {
    @Query(() => EnquiryType, { description: "Returns a enquiry by ID" })
    async getEnquiry(
        @Args() { id }: EnquiryIdArg,
        @Args() { withEstablishment }: EnquiryWithEstablishmentArg
    ): Promise<Enquiry> {
        const scope = withEstablishment ? "withEstablishment" : "defaultScope";
        const enquiry = await Enquiry.scope([scope]).findOne({ where: { id: id }, include: [User] });

        if (!enquiry) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return enquiry;
    }

    @Query(() => [EnquiryType], { description: "Returns all enquiries" })
    async getAllEnquiries(@Args() { withEstablishment }: EnquiryWithEstablishmentArg): Promise<Enquiry[]> {
        const scope = withEstablishment ? "withEstablishment" : "defaultScope";
        const enquiries = await Enquiry.scope([scope]).findAll({
            order: [
                ["status", "ASC"],
                ["createdAt", "DESC"]
            ],
            include: [User]
        });

        if (!enquiries) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return enquiries;
    }

    @Authorized()
    @Query(() => [EnquiryType], { description: "Return all enquiries by a user" })
    async getAllEnquiriesByUser(@Ctx() ctx: GraphQLContext): Promise<Enquiry[]> {
        if (!ctx.user || !ctx.user.id) {
            throw new Error(errorNames.UNAUTHORIZED);
        }

        return Enquiry.findAll({ where: { userId: ctx.user.id }, include: [Establishment] });
    }

    @Mutation(() => EnquiryType, { description: "Adds a new enquiry" })
    async addEnquiry(@Arg("data") data: NewEnquiryInput, @Ctx() ctx: GraphQLContext): Promise<Enquiry> {
        const { establishmentId, clientName, email, guests, checkin, checkout } = data;

        if (!ctx.user || !ctx.user.id) {
            let username = email.split("@")[0];

            const usernameTaken = await User.findOne({ where: { username } });
            const emailTaken = await User.findOne({ where: { email } });

            if (emailTaken) {
                throw Error(errorNames.EMAIL_TAKEN);
            }

            if (usernameTaken) {
                username = username.substr(0, 3) + generateRandomUsername();
            }

            const password = generateRandomPassword();

            await sendMail({
                to: email,
                subject: "Welcome To Holidaze",
                text: `Welcome to holidaze\n\nYour username is: ${username}\n\nYour password is: ${password}\n\nBest regards Holidaze Support`,
                html: `<h1>Welcome to holidaze</h1><p>Your username is: ${username}</p><p>Your password is: ${password}</p><p>Best regards Holidaze Support</p>`
            });

            const user = await User.create({ username, password, email, name: clientName });

            return Enquiry.create({ establishmentId, userId: user.id, guests, checkin, checkout });
        }

        return Enquiry.create({ establishmentId, userId: ctx.user.id, guests, checkin, checkout });
    }

    @Authorized(["MODERATOR", "ADMIN"])
    @Mutation(() => EnquiryType, { description: "Updates a enquiry by ID" })
    async updateEnquiry(@Arg("data") data: UpdateEnquiryInput): Promise<Enquiry> {
        const { id, clientName, guests, checkin, checkout } = data;
        const enquiry = await Enquiry.findOne({ where: { id } });

        if (!enquiry) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return enquiry.update({ clientName, guests, checkin, checkout });
    }

    @Authorized(["MODERATOR", "ADMIN"])
    @Mutation(() => EnquiryType, { description: "Changes the status on a enquiry" })
    async changeEnquiryStatus(@Arg("data") { id, status }: ChangeEnquiryStatusInput): Promise<Enquiry> {
        const enquiry = await Enquiry.findOne({ where: { id } });

        if (!enquiry) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return enquiry.update({ status: status });
    }

    @Authorized(["MODERATOR", "ADMIN"])
    @Mutation(() => EnquiryType, { description: "Deletes a enquiry by ID" })
    async deleteEnquiry(@Args() { id }: EnquiryIdArg): Promise<Enquiry> {
        const enquiry = await Enquiry.findOne({ where: { id } });

        if (!enquiry) {
            throw new Error(errorNames.NOT_FOUND);
        }

        await enquiry.destroy();

        return enquiry;
    }
}

export { EnquiryResolver };

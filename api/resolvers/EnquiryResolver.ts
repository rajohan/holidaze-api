import { Arg, Args, Query, Mutation, Resolver, Authorized } from "type-graphql";

import { errorNames } from "../../utils/errors";
import { Enquiry } from "../models/Enquiry";
import { NewEnquiryInput, UpdateEnquiryInput, EnquiryIdArg, EnquiryWithEstablishmentArg } from "../inputs/EnquiryInput";
import { EnquiryType } from "../typeDefs/EnquiryType";

@Resolver(Enquiry)
class EnquiryResolver {
    @Query(() => EnquiryType, { description: "Returns a enquiry by ID" })
    async getEnquiry(
        @Args() { id }: EnquiryIdArg,
        @Args() { withEstablishment }: EnquiryWithEstablishmentArg
    ): Promise<Enquiry> {
        const scope = withEstablishment ? "withEstablishment" : "defaultScope";
        const enquiry = await Enquiry.scope([scope]).findOne({ where: { id: id } });

        if (!enquiry) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return enquiry;
    }

    @Query(() => [EnquiryType], { description: "Returns all enquiries" })
    async getAllEnquiries(@Args() { withEstablishment }: EnquiryWithEstablishmentArg): Promise<Enquiry[]> {
        const scope = withEstablishment ? "withEstablishment" : "defaultScope";
        const enquiries = await Enquiry.scope([scope]).findAll({});

        if (!enquiries) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return enquiries;
    }

    @Authorized()
    @Mutation(() => EnquiryType, { description: "Adds a new enquiry" })
    async addEnquiry(@Arg("data") data: NewEnquiryInput): Promise<Enquiry> {
        const { establishmentId, clientName, email, checkin, checkout } = data;

        return Enquiry.create({ establishmentId, clientName, email, checkin, checkout });
    }

    @Authorized(["MODERATOR", "ADMIN"])
    @Mutation(() => EnquiryType, { description: "Updates a enquiry by ID" })
    async updateEnquiry(@Arg("data") data: UpdateEnquiryInput): Promise<Enquiry> {
        const { id, clientName, checkin, checkout } = data;
        const enquiry = await Enquiry.findOne({ where: { id } });

        if (!enquiry) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return enquiry.update({ clientName, checkin, checkout });
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

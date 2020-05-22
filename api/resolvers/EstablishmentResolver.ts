import { Arg, Args, Query, Mutation, Resolver, Authorized } from "type-graphql";

import { errorNames } from "../../utils/errors";
import { Establishment } from "../models/Establishment";
import { EstablishmentType } from "../typeDefs/EstablishmentType";
import {
    NewEstablishmentInput,
    UpdateEstablishmentInput,
    EstablishmentIdArg,
    EstablishmentWithEnquiryArg
} from "../inputs/EstablishmentInput";

@Resolver(Establishment)
class EstablishmentResolver {
    @Query(() => EstablishmentType, { description: "Returns a establishment by ID" })
    async getEstablishment(
        @Args() { id }: EstablishmentIdArg,
        @Args() { withEnquiries }: EstablishmentWithEnquiryArg
    ): Promise<Establishment> {
        const scope = withEnquiries ? "withEnquiries" : "defaultScope";
        const establishment = await Establishment.scope([scope]).findOne({ where: { id } });

        if (!establishment) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return establishment;
    }

    @Query(() => [EstablishmentType], { description: "Returns all establishments" })
    async getAllEstablishments(@Args() { withEnquiries }: EstablishmentWithEnquiryArg): Promise<Establishment[]> {
        const scope = withEnquiries ? "withEnquiries" : "defaultScope";
        const establishments = await Establishment.scope([scope]).findAll({});

        if (!establishments) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return establishments;
    }

    @Authorized(["MODERATOR", "ADMIN"])
    @Mutation(() => EstablishmentType, { description: "Adds a new establishment" })
    async addEstablishment(@Arg("data") data: NewEstablishmentInput): Promise<Establishment> {
        const { name, email, imageUrl, price, maxGuests, googleLat, googleLong, description, selfCatering } = data;

        return Establishment.create({
            name,
            email,
            imageUrl,
            price,
            maxGuests,
            googleLat,
            googleLong,
            description,
            selfCatering
        });
    }

    @Authorized(["MODERATOR", "ADMIN"])
    @Mutation(() => EstablishmentType, { description: "Updates a establishment by ID" })
    async updateEstablishment(@Arg("data") data: UpdateEstablishmentInput): Promise<Establishment> {
        const { id, name, email, imageUrl, price, maxGuests, googleLat, googleLong, description, selfCatering } = data;
        const establishment = await Establishment.findOne({ where: { id } });

        if (!establishment) {
            throw new Error(errorNames.NOT_FOUND);
        }

        return establishment.update({
            name,
            email,
            imageUrl,
            price,
            maxGuests,
            googleLat,
            googleLong,
            description,
            selfCatering
        });
    }

    @Authorized(["MODERATOR", "ADMIN"])
    @Mutation(() => EstablishmentType, { description: "Deletes a establishment by ID" })
    async deleteEstablishment(@Args() { id }: EstablishmentIdArg): Promise<Establishment> {
        const establishment = await Establishment.findOne({ where: { id } });

        if (!establishment) {
            throw new Error(errorNames.NOT_FOUND);
        }

        await establishment.destroy();

        return establishment;
    }
}

export { EstablishmentResolver };

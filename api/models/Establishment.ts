import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    DataType,
    Length,
    IsUrl,
    IsEmail,
    IsNumeric,
    IsInt,
    IsFloat,
    HasMany,
    Scopes,
    DefaultScope
} from "sequelize-typescript";

import { Enquiry } from "./Enquiry";

@DefaultScope(() => ({}))
@Scopes(() => ({
    withEnquiries: {
        include: [Enquiry]
    }
}))
@Table
class Establishment extends Model<Establishment> {
    @Length({ min: 2 })
    @Column
    name!: string;

    @IsEmail
    @Length({ min: 5 })
    @Column
    email!: string;

    @Length({ min: 5 })
    @IsUrl
    @Column(DataType.TEXT)
    imageUrl!: string;

    @IsNumeric
    @Column(DataType.FLOAT)
    price!: number;

    @IsInt
    @Column(DataType.INTEGER)
    maxGuests!: number;

    @IsFloat
    @Column(DataType.DOUBLE)
    googleLat!: number;

    @IsFloat
    @Column(DataType.DOUBLE)
    googleLong!: number;

    @Length({ min: 10 })
    @Column(DataType.TEXT)
    description!: string;

    @Column
    selfCatering!: boolean;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    @HasMany(() => Enquiry)
    enquiries?: Enquiry[];
}

export { Establishment };

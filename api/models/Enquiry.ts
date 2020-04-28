import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    IsEmail,
    Length,
    IsDate,
    IsInt,
    ForeignKey,
    BelongsTo,
    Scopes,
    DefaultScope
} from "sequelize-typescript";

import { Establishment } from "./Establishment";

@DefaultScope(() => ({}))
@Scopes(() => ({
    withEstablishment: {
        include: [Establishment]
    }
}))
@Table
class Enquiry extends Model<Enquiry> {
    @IsInt
    @ForeignKey(() => Establishment)
    @Column
    establishmentId!: number;

    @Length({ min: 2 })
    @Column
    clientName!: string;

    @IsEmail
    @Length({ min: 5 })
    @Column
    email!: string;

    @IsDate
    @Column
    checkin!: Date;

    @IsDate
    @Column
    checkout!: Date;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    @BelongsTo(() => Establishment)
    establishment!: Establishment;
}

export { Enquiry };

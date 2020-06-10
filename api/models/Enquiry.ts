import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    IsDate,
    ForeignKey,
    BelongsTo,
    Scopes,
    DefaultScope,
    DataType,
    Default,
    Unique,
    IsInt
} from "sequelize-typescript";

import { Establishment } from "./Establishment";
import { User } from "./User";

@DefaultScope(() => ({}))
@Scopes(() => ({
    withEstablishment: {
        include: [Establishment]
    }
}))
@Table
class Enquiry extends Model<Enquiry> {
    @Unique
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    @ForeignKey(() => Establishment)
    @Column(DataType.UUID)
    establishmentId!: string;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;

    @IsInt
    @Column(DataType.INTEGER)
    guests!: number;

    @IsDate
    @Column
    checkin!: Date;

    @IsDate
    @Column
    checkout!: Date;

    @IsInt
    @Default(0)
    @Column(DataType.INTEGER)
    status!: number;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    @BelongsTo(() => Establishment)
    establishment!: Establishment;

    @BelongsTo(() => User)
    user!: User;
}

export { Enquiry };

import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    DataType,
    Default,
    Unique,
    ForeignKey,
    BelongsTo,
    IsNumeric
} from "sequelize-typescript";
import { User } from "./User";
import { Establishment } from "./Establishment";

@Table
class Rate extends Model<Rate> {
    @Unique
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    @IsNumeric
    @Column({ type: DataType.FLOAT })
    rating!: number;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;

    @ForeignKey(() => Establishment)
    @Column(DataType.UUID)
    establishmentId!: string;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    @BelongsTo(() => Establishment)
    establishment!: Establishment;

    @BelongsTo(() => User)
    user!: User;
}

export { Rate };

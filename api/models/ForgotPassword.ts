import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    DataType,
    Default,
    Unique,
    ForeignKey
} from "sequelize-typescript";
import { User } from "./User";

@Table
class ForgotPassword extends Model<ForgotPassword> {
    @Unique
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    user!: string;

    @Column(DataType.TEXT)
    token!: string;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;
}

export { ForgotPassword };

import {
    Table,
    Column,
    CreatedAt,
    Model,
    IsInt,
    ForeignKey,
    UpdatedAt,
    DataType,
    Default,
    Unique
} from "sequelize-typescript";
import { User } from "./User";

@Table
class Token extends Model<Token> {
    @Unique
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    @IsInt
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

export { Token };

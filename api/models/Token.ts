import { Table, Column, CreatedAt, Model, IsInt, ForeignKey, UpdatedAt, DataType } from "sequelize-typescript";
import { User } from "./User";

@Table
class Token extends Model<Token> {
    @IsInt
    @ForeignKey(() => User)
    @Column
    user!: number;

    @Column(DataType.TEXT)
    token!: string;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;
}

export { Token };

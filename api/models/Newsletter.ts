import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    DataType,
    Default,
    Unique,
    IsEmail,
    Length
} from "sequelize-typescript";

@Table
class Newsletter extends Model<Newsletter> {
    @Unique
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    @IsEmail
    @Length({ min: 5 })
    @Column
    email!: string;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;
}

export { Newsletter };

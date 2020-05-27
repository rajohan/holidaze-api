import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    DataType,
    IsEmail,
    Length,
    Default,
    Unique,
    IsInt
} from "sequelize-typescript";

@Table
class Contact extends Model<Contact> {
    @Unique
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    @Length({ min: 2 })
    @Column
    clientName!: string;

    @IsEmail
    @Length({ min: 5 })
    @Column
    email!: string;

    @Length({ min: 10 })
    @Column(DataType.TEXT)
    message!: string;

    @IsInt
    @Default(0)
    @Column(DataType.INTEGER)
    status!: number;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;
}

export { Contact };

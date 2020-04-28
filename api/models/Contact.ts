import { Table, Column, CreatedAt, UpdatedAt, Model, DataType, IsEmail, Length } from "sequelize-typescript";

@Table
class Contact extends Model<Contact> {
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

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;
}

export { Contact };

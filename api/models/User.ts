import bcrypt from "bcrypt";
import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    IsEmail,
    Unique,
    Length,
    IsAlphanumeric,
    Default,
    BeforeCreate,
    BeforeUpdate,
    DataType
} from "sequelize-typescript";

@Table
class User extends Model<User> {
    @Unique
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    @Unique
    @IsAlphanumeric
    @Length({ min: 3, max: 9 })
    @Column
    username!: string;

    @Length({ min: 6 })
    @Column
    password!: string;

    @IsEmail
    @Unique
    @Length({ min: 5 })
    @Column
    email!: string;

    @Default(false)
    @Column
    verified!: boolean;

    @Default(0)
    @Column
    accessLevel!: number;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    async verifyPassword(password: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, this.getDataValue("password"));
        } catch (error) {
            throw new Error(error);
        }
    }

    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(instance: User): Promise<void> {
        if (instance.changed("password") || instance.isNewRecord) {
            try {
                const salt = await bcrypt.genSalt(10);
                instance.password = await bcrypt.hash(instance.password, salt);
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}

export { User };

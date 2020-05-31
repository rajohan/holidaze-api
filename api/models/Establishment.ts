import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    DataType,
    Length,
    IsUrl,
    IsEmail,
    IsNumeric,
    IsInt,
    IsFloat,
    HasMany,
    Scopes,
    DefaultScope,
    Default,
    Unique,
    Sequelize
} from "sequelize-typescript";

import { Enquiry } from "./Enquiry";

@DefaultScope(() => ({}))
@Scopes(() => ({
    withEnquiries: {
        include: [Enquiry]
    }
}))
@Table
class Establishment extends Model<Establishment> {
    @Unique
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    id!: string;

    @Length({ min: 2 })
    @Column
    name!: string;

    @IsEmail
    @Length({ min: 5 })
    @Column
    email!: string;

    @Length({ min: 5 })
    @IsUrl
    @Column(DataType.TEXT)
    imageUrl!: string;

    @IsNumeric
    @Column(DataType.FLOAT)
    price!: number;

    @IsInt
    @Column(DataType.INTEGER)
    maxGuests!: number;

    @IsFloat
    @Column(DataType.DOUBLE)
    googleLat!: number;

    @IsFloat
    @Column(DataType.DOUBLE)
    googleLong!: number;

    @Length({ min: 10 })
    @Column(DataType.TEXT)
    description!: string;

    @Column
    selfCatering!: boolean;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    @HasMany(() => Enquiry)
    enquiries?: Enquiry[];

    static async addSearchTSVector(sequelize: Sequelize): Promise<void> {
        // Add a new tsvector column called search for search keywords
        await sequelize.query(`ALTER TABLE "${this.tableName}" ADD COLUMN "search" TSVECTOR`);

        // Update the search column tsvector to contain keywords from current table rows
        await sequelize.query(
            `UPDATE "${this.tableName}" SET "search" = setweight(to_tsvector('english', coalesce(name, '')), 'A') || 
             setweight(to_tsvector('english', coalesce(description, '')), 'B')`
        );

        // Create a gin index for the search column
        await sequelize.query(`CREATE INDEX establishment_search_idx ON "${this.tableName}" USING gin("search")`);

        // A trigger function to run on each update or insert off a table row
        await sequelize.query(`
            CREATE OR REPLACE FUNCTION establishments_update_trigger() RETURNS trigger AS $$  
            begin  
              new.search :=
                 setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
                 setweight(to_tsvector('english', coalesce(new.description, '')), 'B');
              return new;
            end  
            $$ LANGUAGE plpgsql;
        `);

        // Trigger to run the trigger function created above
        await sequelize.query(
            `CREATE TRIGGER establishments_vector_update BEFORE INSERT OR UPDATE ON "${this.tableName}" 
             FOR EACH ROW EXECUTE PROCEDURE establishments_update_trigger();`
        );
    }

    // static async search(sequelize: Sequelize, query: string): Promise<Establishment[]> {
    //     query = sequelize.getQueryInterface().escape(query.replace(/ /g, ":* | ") + ":*");
    //
    //     return sequelize.query(
    //         `SELECT * FROM "${this.tableName}" WHERE "search" @@ to_tsquery('english', ${query})
    //          ORDER BY ts_rank("search", to_tsquery('english', ${query})) DESC LIMIT 5`
    //     ) as Promise<Establishment[]>;
    // }
}

export { Establishment };

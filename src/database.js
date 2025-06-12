import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
    user: process.env.DATABASE_USER || 'postgres',
    database: process.env.DATABASE_NAME || 'persomal_book_library',
    password: process.env.DATABASE_PASSWORD || 'admin',
    port: process.env.DATABASE_PORT || 5432,
    host: process.env.DATABASE_HOST || 'localhost',
});

db.connect();

export default db;
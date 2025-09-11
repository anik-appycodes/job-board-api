import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then(() => console.log("🚀 Database connection successful"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

export default pool;

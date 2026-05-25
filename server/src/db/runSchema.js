import fs from "fs";
import path from "path";
import pool from "../db/index.js";
import dotenv from "dotenv";

dotenv.config();

async function runSchema() {
  try {
    console.log("Running schema.sql...");

    // 1. Read schema file
    const filePath = path.join(process.cwd(), "server/db/schema.sql");
    const sql = fs.readFileSync(filePath, "utf-8");

    // 2. Execute SQL
    await pool.query(sql);

    console.log("Schema executed successfully!");

    await pool.end();
  } catch (err) {
    console.error("Error running schema:", err.message);
    await pool.end();
  }
}

runSchema();
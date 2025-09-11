import type { QueryResult } from "pg";
import pool from "../configs/db.js";
import type { User } from "../types/models/user.model.js";

async function getAll(
  query: Record<string, any> = {},
  orderBy?: string
): Promise<QueryResult<User>> {
  const keys = Object.keys(query);

  const whereClauses = keys.map((key, i) => `${key} = $${i + 1}`);

  const sql = `
    SELECT *
    FROM users
    ${whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""}
    ${orderBy ? `ORDER BY ${orderBy}` : ""}
  `;

  const values = Object.values(query);

  const result = await pool.query<User>(sql, values);
  return result;
}

async function getById(id: number): Promise<QueryResult<User>> {
  const result = await pool.query<User>(
    "SELECT * FROM users WHERE id = $1 LIMIT 1",
    [id]
  );
  return result;
}

async function create(user: User): Promise<QueryResult<User>> {
  const { name, email, role, company_id } = user;
  const result = await pool.query<User>(
    `INSERT INTO users (name, email, role, company_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, role, company_id ?? null]
  );
  return result;
}

async function update(
  id: number,
  user: Partial<User>
): Promise<QueryResult<User>> {
  const keys = Object.keys(user);
  const values = Object.values(user);

  if (!keys.length) {
    throw new Error("No fields provided for update");
  }

  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`);

  const result = await pool.query<User>(
    `UPDATE users 
     SET ${setClauses.join(", ")}, updated_at = NOW()
     WHERE id = $${keys.length + 1}
     RETURNING *`,
    [...values, id]
  );

  return result;
}

async function remove(id: number): Promise<QueryResult<User>> {
  const result = await pool.query<User>(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id]
  );
  return result;
}

export const userRepo = { getById, getAll, create, update, remove };

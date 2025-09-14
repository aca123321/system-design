import { Client } from 'pg';

const DB_NAME = 'vyson';

const pg_client = new Client({
  user: 'postgres',
  host: 'localhost', // e.g., 'localhost'
  database: DB_NAME,
  password: 'aca123321',
  port: 5432, // Default PostgreSQL port
})

export const connectAndQuery = async(query) => {
  try {
    await pg_client.connect();
    console.log('Connected to PostgreSQL database');

    const res = await pg_client.query(query);
    console.log('Query executed successfully');

  } catch (err) {
    console.error('Error connecting or querying:', err);
  } finally {
    await pg_client.end();
    console.log('Connection to PostgreSQL closed');
  }
}

const main = async() => {
  const sql = `CREATE TABLE url_shortener (
    id BIGSERIAL PRIMARY KEY,
    original_url TEXT,
    short_code VARCHAR(32) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
  await connectAndQuery(sql);
}

// main();
console.time("add_1000_rows");
import { Client } from 'pg';
import fs from 'fs';

import { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from './config.js';

const pg_client = new Client({
  user: DB_USER,
  host: DB_HOST, // e.g., 'localhost'
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT, // Default PostgreSQL port
})

const BASE_URL = 'https://www.google.com';

const collision_file = fs.createWriteStream('collision.txt', { flags: 'a' });

export const query = async (pg_client, sql, original_url) => {
  try {
    console.log('Connected to PostgreSQL database');
    const res = await pg_client.query(sql);
    console.log('Query executed successfully');

  } catch (err) {
    if(err.code === '23505') { // unique constraint violation
      console.log("Collision detected for sql:", sql, "original_url:", original_url);
      collision_file.write(original_url + "\n");
    } else {
      console.log("error: ", err);
      console.log("error code: ", err.code);
    }
  }
}

const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
function bigint2base( x ) {
  let base = BigInt( charset.length );
  let result = '';
  
  while ( 0 < x ) {
    result = charset.charAt( Number( x % base ) ) + result;
    x = x / base;
  }
  return result || '0';
}

const insert_urls = async () => {
  await pg_client.connect();
  for (let i = 0; i < 1000; i++) {
    const url = `${BASE_URL}/search?q=${i.toString()}`;

    const hexString = Array(16)
                      .fill()
                      .map(() => Math.round(Math.random() * 0xF).toString(16))
                      .join('');
    
    const randomBigInt = BigInt(`0x${hexString}`);
    let short_code = bigint2base(randomBigInt);

    const sql = `INSERT INTO url_shortener (original_url, short_code) VALUES ('${url}', '${short_code}')`;
    // await query(pg_client, sql, url);
  }
  await pg_client.end();
  console.timeEnd("add_1000_rows");
}

const main = async () => {
  await insert_urls();
}

main();
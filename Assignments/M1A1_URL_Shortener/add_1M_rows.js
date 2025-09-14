console.time("add_1M_rows");
import { Client } from 'pg';
import fs from 'fs';

import { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from './config.js';

const get_pg_client = () => { 
  return new Client({
  user: DB_USER,
  host: DB_HOST, // e.g., 'localhost'
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT, // Default PostgreSQL port
  });
}

const BASE_URL = 'https://www.google.com';

const collision_file = fs.createWriteStream('collision.txt', { flags: 'a' });

export const query = async (pg_client, sql, original_url) => {
  try {
    await pg_client.query(sql);
  } catch (err) {
    if(err.code === '23505') { // unique constraint violation
      console.log("Collision detected for sql:", sql, "original_url:", original_url);
      collision_file.write(original_url + "\n");
    } else {
      console.log("error: ", err);
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

const n_cores = 8; // no hyperthreading on mac M1, so using 1:1 ratio for threads:cores

const insert_urls = async (start, end) => {
  const pg_client = get_pg_client();
  await pg_client.connect();
  for (let i = start; i < end; i++) {
    const url = `${BASE_URL}/search?q=${i.toString()}`;

    const hexString = Array(16)
                      .fill()
                      .map(() => Math.round(Math.random() * 0xF).toString(16))
                      .join('');
    
    const randomBigInt = BigInt(`0x${hexString}`);
    let short_code = bigint2base(randomBigInt);

    const sql = `INSERT INTO url_shortener (original_url, short_code) VALUES ('${url}', '${short_code}')`;
    await query(pg_client, sql, url);
  }
  await pg_client.end();
}

const insert_urls_parallel = async () => {
  const promises = [];
  for (let i = 0; i < n_cores; i++) {
    const start = i * 1000000 / n_cores;
    const end = (i + 1) * 1000000 / n_cores;
    promises.push(insert_urls(start, end));
  }
  await Promise.all(promises);
}

const main = async () => {
  await insert_urls_parallel();
  console.timeEnd("add_1M_rows");
}

main();
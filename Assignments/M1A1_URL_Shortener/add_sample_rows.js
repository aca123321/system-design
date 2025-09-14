import { connectAndQuery } from './create_table.js';

const sql = `INSERT INTO url_shortener (original_url, short_code) VALUES ('https://www.google.com', 'google'), ('https://www.facebook.com', 'facebook'), ('https://x.com/home', 'x')`;

await connectAndQuery(sql);
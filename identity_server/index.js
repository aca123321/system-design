import express from 'express';

const PORT = process.argv[2] || 3000;

const app = express();

app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log("IP: ", ip);
  const host = req.headers['host'];
  res.json({ ip, host, port: PORT });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
});
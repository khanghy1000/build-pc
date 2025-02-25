import pg from 'pg';

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
client
  .connect()
  .then(() => {
    console.error('ye');
  })
  .catch((err) => {
    console.error('Error connecting: %s', err);
  });

export { client };

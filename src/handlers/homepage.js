import { client } from '../db.js';

async function getHomepage(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1 and password = $2`,
      [req.cookies['username'], req.cookies['password']]
    )
  ).rows[0].count;

  res.render('views/homepage', {
    idcheck: idcheck,
    username: req.cookies['username'],
  });
}

export { getHomepage };

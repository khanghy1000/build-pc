import { client } from '../../db.js';
import { sha256 } from 'js-sha256';

async function getLogin(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1 and password = $2`,
      [req.cookies['username'], req.cookies['password']]
    )
  ).rows[0].count;

  if (idcheck == 0) {
    res.render('views/login');
  } else {
    res.redirect('/');
  }
}
async function postLogin(req, res) {
  const idcheck = (
    await client.query(
      `select username from "USERS" where username = $1 and password = $2`,
      [req.body.username, sha256(req.body.password)]
    )
  ).rows;

  if (idcheck.length == 0) {
    res.sendStatus(500);
  } else {
    try {
      res.cookie('password', sha256(req.body.password));
      res.cookie('username', idcheck[0].username);
      res.sendStatus(200);
    } catch (e) {}
  }
}
export { getLogin, postLogin };

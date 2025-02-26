import { client } from '../../db.js';
import { sha256 } from 'js-sha256';

async function getRegister(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1 and password = $2`,
      [req.cookies['username'], req.cookies['password']]
    )
  ).rows[0].count;
  if (idcheck == 0) {
    res.render('views/register');
  } else {
    res.redirect('/');
  }
}

async function postRegister(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1`,
      [req.body.username]
    )
  ).rows[0].count;
  if (idcheck == 0) {
    if (req.body.password.length < 8 || req.body.username.length < 8) {
      res.sendStatus(500);
    } else {
      try {
        await client.query(`insert into "USERS" values($1, $2, $3)`, [
          req.body.username,
          sha256(req.body.password),
          req.body.email,
        ]);

        res.cookie('password', sha256(req.body.password));
        res.cookie('username', req.body.username);
        res.sendStatus(200);
      } catch (e) {}
    }
  } else {
    res.sendStatus(501);
  }
}

export { getRegister, postRegister };

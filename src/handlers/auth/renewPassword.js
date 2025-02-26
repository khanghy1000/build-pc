import { client } from '../../db.js';
import { sha256 } from 'js-sha256';

async function getRenewPassword(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1 and password = $2`,
      [req.cookies['username'], req.cookies['password']]
    )
  ).rows[0].count;

  const tokenncheck = (
    await client.query(
      `select count(username) from "USERS" where token_forgot = $1 `,
      [req.query.token]
    )
  ).rows[0].count;

  if (idcheck == 0 && tokenncheck == 1) {
    res.render('views/renewPassword', {
      token: req.query.token,
    });
  } else {
    res.redirect('/');
  }
}

async function postRenewPassword(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where token_forgot = $1`,
      [req.body.token]
    )
  ).rows[0].count;
  if (idcheck == 1) {
    try {
      const user = (
        await client.query(
          `select username, password from "USERS" where token_forgot = $1`,
          [req.body.token]
        )
      ).rows[0];

      if (req.body.new_password != req.body.new_password_repeat) {
        res.sendStatus(500);
      } else if (sha256(req.body.new_password) == user.password) {
        res.sendStatus(501);
      } else if (req.body.new_password.length < 8) {
        res.sendStatus(502);
      } else {
        await client.query(
          `update "USERS" set password = $2 where username = $1`,
          [user.username, sha256(req.body.new_password)]
        );
        await client.query(
          `update "USERS" set token_forgot = null where username = $1`,
          [user.username]
        );
        res.sendStatus(200);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(503);
    }
  } else {
    res.sendStatus(503);
  }
}

export { getRenewPassword, postRenewPassword };

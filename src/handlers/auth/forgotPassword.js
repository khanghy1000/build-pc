import { client } from '../../db.js';
import { v4 as uuidv4 } from 'uuid';
import { transporter } from '../../email.js';

async function getForgotPassword(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1 and password = $2`,
      [req.cookies['username'], req.cookies['password']]
    )
  ).rows[0].count;

  if (idcheck == 0) {
    res.render('views/forgotPassword');
  } else {
    res.redirect('/');
  }
}

async function postForgotPassword(req, res) {
  console.log(req.body.username);
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1`,
      [req.body.username]
    )
  ).rows[0].count;

  if (idcheck == 1) {
    try {
      const token = uuidv4() + req.body.username;

      await client.query(
        `update "USERS" set token_forgot = $2 where username = $1`,
        [req.body.username, token]
      );
      const user = (
        await client.query(`select email from "USERS" where username = $1`, [
          req.body.username,
        ])
      ).rows[0];
      console.log(user);
      const url = process.env.URL;
      await transporter.sendMail({
        from: '"Yurixahri BOT" <no-reply@yurixahri.net>', // sender address
        to: user.email, // list of receivers
        subject: 'Quên mật khẩu Pcbuilder', // Subject line
        text: '', // plain text body
        html: `
                <p>Nhấn vào đường dẫn để thay đổi mật khẩu</p>
                <a href="${url}/renew_password?token=${token}">Link</a>
                <img src="https://server.yurixahri.net/Photos/kaboom.jpg" alt="Kaboom" width="100" height="100">
                `, // html body
      });
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(501);
  }
}

export { getForgotPassword, postForgotPassword };

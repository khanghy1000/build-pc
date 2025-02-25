import { client } from "../db.js";

async function updateStorage(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1 and password = $2`,
      [req.cookies['username'], req.cookies['password']]
    )
  ).rows[0].count;
  const build = (
    await client.query(`select username from "BUILDs" where id = $1`, [
      req.query['build'],
    ])
  ).rows;

  if (
    idcheck == 0 ||
    build.length == 0 ||
    build[0].username != req.cookies['username']
  ) {
    res.redirect('/login');
  } else {
    try {
      await client.query(
        `update "STORAGE_DETAILS" set amount = $3 where build_id = $2 and storage_id = $1`,
        [req.query['storage_id'], req.query['build'], req.query['amount']]
      );
    } catch (e) {}
    res.redirect(`/build?id=${req.query['build']}`);
  }
}

export { updateStorage };
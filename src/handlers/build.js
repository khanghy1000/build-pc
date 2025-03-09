import { client } from '../db.js';
import { money } from '../utils.js';

async function getBuildList(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1 and password = $2`,
      [req.cookies['username'], req.cookies['password']]
    )
  ).rows[0].count;

  if (idcheck == 0) {
    res.redirect('/login');
  } else {
    try {
      const data = (
        await client.query(`select * from "BUILDs" where username = $1`, [
          req.cookies['username'],
        ])
      ).rows;
      let build_list = '';

      data.forEach((e) => {
        build_list += `<a href="/build?id=${e.id}" class="select-build">
                                <div style="display: flex; align-items: center;">
                                    <span>${
                                      e.name === null || e.name == ''
                                        ? `Build của ${
                                            e.username + ' #' + e.id
                                          }`
                                        : e.name
                                    }</span>
                                </div>
                            </a>`;
      });

      res.render('views/getBuildList', {
        idcheck: idcheck,
        username: req.cookies['username'],
        length: data.length,
        build_list: build_list,
      });
    } catch (e) {
      res.sendStatus(500);
    }
  }
}
async function createBuild(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1 and password = $2`,
      [req.cookies['username'], req.cookies['password']]
    )
  ).rows[0].count;

  if (idcheck == 0) {
    res.redirect('/login');
  } else {
    let build_id = req.query.id == undefined ? '' : req.query.id;
    try {
      const id = (
        await client.query(
          `insert into "BUILDs" (username) values ($1) returning id`,
          [req.cookies['username']]
        )
      ).rows[0].id;
      if (build_id != '') {
        const data = (
          await client.query(`select * from "BUILDs" where id = $1`, [build_id])
        ).rows[0];
        await client.query(
          `UPDATE "BUILDs" set username = $2, name = $3, cpu_id = $4, board_id = $5, vga_id = $6, psu_id = $7, case_id = $8, cooler_id = $9  where id = $1`,
          [
            id,
            req.cookies['username'],
            data.name,
            data.cpu_id,
            data.board_id,
            data.vga_id,
            data.psu_id,
            data.case_id,
            data.cooler_id,
          ]
        );

        await client.query(
          `UPDATE "BUILDs" set username = $2, name = $3, cpu_id = $4, board_id = $5, vga_id = $6, psu_id = $7, case_id = $8, cooler_id = $9  where id = $1`,
          [
            id,
            req.cookies['username'],
            data.name,
            data.cpu_id,
            data.board_id,
            data.vga_id,
            data.psu_id,
            data.case_id,
            data.cooler_id,
          ]
        );

        const ram = (
          await client.query(
            `select * from "RAM_DETAILS" where build_id = $1`,
            [build_id]
          )
        ).rows;

        const storage = (
          await client.query(
            `select * from "STORAGE_DETAILS" where build_id = $1`,
            [build_id]
          )
        ).rows;

        ram.forEach(async (e) => {
          await client.query(`insert into "RAM_DETAILS" values($1, $2, $3)`, [
            id,
            e.ram_id,
            e.amount,
          ]);
        });

        storage.forEach(async (e) => {
          await client.query(
            `insert into "STORAGE_DETAILS" values($1, $2, $3)`,
            [id, e.storage_id, e.amount]
          );
        });
      }
      res.redirect(`/build?id=${id}`);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

async function updateBuildStatus(req, res) {
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
      await client.query(`update "BUILDs" set status = $1 where id = $2`, [
        req.query['status'],
        req.query['build'],
      ]);
    } catch (e) {}
    res.redirect(`/build?id=${req.query['build']}`);
  }
}

async function updateBuildName(req, res) {
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
      await client.query(`update "BUILDs" set name = $1 where id = $2`, [
        req.query['name'],
        req.query['build'],
      ]);
    } catch (e) {}
    res.redirect(`/build?id=${req.query['build']}`);
  }
}

async function updateBuildDesc(req, res) {
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
      await client.query(`delete from "BUILD_DESC" where build_id = $1`, [
        req.query['build'],
      ]);
      JSON.parse(req.query['desc']).forEach(async (e) => {
        try {
          await client.query(`insert into "BUILD_DESC" values($1, $2)`, [
            req.query['build'],
            e.value,
          ]);
        } catch (e) {}
      });
    } catch {}
    res.redirect(`/build?id=${req.query['build']}`);
  }
}

async function getBuild(req, res) {
  try {
    const idcheck = (
      await client.query(
        `select count(username) from "USERS" where username = $1 and password = $2`,
        [req.cookies['username'], req.cookies['password']]
      )
    ).rows[0].count;

    const build = (
      await client.query(
        `
        select build.id, build.username, build.name, created, cpu_id, board_id, vga_id, psu_id, case_id, cooler_id, status, "MOTHERBOARDs".name as mb_name, "MOTHERBOARDs".socket_id as mb_socket, "MOTHERBOARDs".image as mb_image, "MOTHERBOARDs".price as mb_price, "MOTHERBOARDs".mem_slots, "MOTHERBOARDs".max_mem as mb_max_mem, "MOTHERBOARDs".socket_id as mb_socket, "MOTHERBOARDs".sata_slots, "MOTHERBOARDs".form_factor_id as mb_form, "CPUs".name as cpu_name, "CPUs".price as cpu_price, "CPUs"."tdp" as cpu_tdp, "CPUs".socket_id as cpu_socket, "CPUs".image as cpu_image, "CPUs".max_mem as cpu_max_mem, "CPUs".socket_id as cpu_socket, "VGAs".name as vga_name, "VGAs".price as vga_price, "VGAs"."TDP" as vga_tdp, "VGAs".image as vga_image, "VGAs".length as vga_len, "PSUs".name as psu_name, "PSUs".price as psu_price, "PSUs".image as psu_image, "PSUs".wattage as psu_wattage, "PSUs".form_factor_id as psu_form, "CASEs".name as case_name, "CASEs".price as case_price, "CASEs".image as case_image, "CASEs".form_factor_id as case_form, "CASEs".sata_slots_3, "CASEs".sata_slots_2, "CASEs".max_vga_len, "COOLERs".name as cooler_name, "COOLERs".price as cooler_price, "COOLERs".image as cooler_image from (SELECT * FROM public."BUILDs" where "BUILDs".id = $1) as build

        left join "MOTHERBOARDs" on build.board_id = "MOTHERBOARDs".id
        left join "CPUs" on build.cpu_id = "CPUs".id
        left join "VGAs" on build.vga_id = "VGAs".id
        left join "PSUs" on build.psu_id = "PSUs".id
        left join "CASEs" on build.case_id = "CASEs".id
        left join "COOLERs" on build.cooler_id = "COOLERs".id
        `,
        [req.query['id']]
      )
    ).rows[0];

    const ram = (
      await client.query(
        `
        select "RAMs".id, "RAMs".price, "RAMs".name, "RAMs".image, "RAMs".capacity, "RAMs".mem_type_id, "RAM_DETAILS".ram_id, "RAM_DETAILS".amount from (select id from "BUILDs" where id = $1)
        join "RAM_DETAILS" on id = "RAM_DETAILS".build_id
        join "RAMs" on "RAM_DETAILS".ram_id = "RAMs".id
        `,
        [req.query['id']]
      )
    ).rows;

    const storage = (
      await client.query(
        `
        select "STORAGEs".id, "STORAGEs".price, "STORAGEs".name, "STORAGEs".image, "STORAGEs".capacity, "STORAGEs".form_fact, "STORAGE_DETAILS".storage_id, "STORAGE_DETAILS".amount from (select id from "BUILDs" where id = $1)
        join "STORAGE_DETAILS" on id = "STORAGE_DETAILS".build_id
        join "STORAGEs" ON "STORAGEs".id = "STORAGE_DETAILS".storage_id
        `,
        [req.query['id']]
      )
    ).rows;

    const descs = (
      await client.query(
        `
        select "BUILD_DESC".desc as value from (select id from "BUILDs" where id = $1)
        join "BUILD_DESC" on id = "BUILD_DESC".build_id
        `,
        [req.query['id']]
      )
    ).rows;

    const desc_whitelist_sql = (
      await client.query(
        `SELECT "BUILD_DESC".desc as value  FROM public."BUILD_DESC" group by "BUILD_DESC".desc`
      )
    ).rows;
    let desc_whitelist = [];
    desc_whitelist_sql.forEach((e) => {
      desc_whitelist.push(e.value);
    });

    let problems = '';

    let ram_decs = '';
    let ram_money = 0;
    let ram_total_capacity = 0;
    let ram_quantity = 0;
    for (const e of ram) {
      if (build.board_id != null) {
        const ramcheck = (
          await client.query(
            `
            select count("MB_id") from "MB_RAM_TYPE" where "MB_id" = $1 and "RAM_DDR_id" = $2
            `,
            [build.board_id, e.mem_type_id]
          )
        ).rows[0].count;
        if (ramcheck == 0)
          problems += `
          <p onclick="this.style.height = 0; this.style.margin = 0; this.style.padding = 0; this.style.opacity = 0; this.style.borderWidth = 0" style="width: 200px; cursor: pointer; transition: 0.2s; overflow: hidden; background: #ffd5d5;border: #ff7c7c 2px solid;border-radius: 5px;padding: 10px;color: brown;">Ram ${e.name} không phù hợp với main</p>
        `;
      }
      ram_total_capacity += e.capacity * e.amount;
      ram_quantity += e.amount;

      ram_money += (e.price ?? 0) * (e.amount ?? 0);

      ram_decs += `
        <div style="display: flex; align-items:center; justify-content: space-between">
            <a href="/component-select/ram?build=${build.id}&id=${e.id}" style="display: flex; align-items:center">
                <img width=100 height=100 src="${e.image}">
                <h3>${e.name}</h3>
                <h3>${e.mem_type_id}</h3>
                <h3>${money.format(e.price * e.amount)} (${money.format(
                  e.price
                )} per)</h3>
            </a>
                ${
                  idcheck == 1 && req.cookies['username'] == build.username
                    ? `
                <select onchange="location = this.value;">
                    <option selected disable hidden>${e.amount}</option>
                    <option value="/ram-update?build=${req.query['id']}&ram_id=${e.id}&amount=1">1</option>
                    <option value="/ram-update?build=${req.query['id']}&ram_id=${e.id}&amount=2">2</option>
                    <option value="/ram-update?build=${req.query['id']}&ram_id=${e.id}&amount=3">3</option>
                    <option value="/ram-update?build=${req.query['id']}&ram_id=${e.id}&amount=4">4</option>
                    <option value="/ram-update?build=${req.query['id']}&ram_id=${e.id}&amount=5">5</option>
                    <option value="/ram-update?build=${req.query['id']}&ram_id=${e.id}&amount=6">6</option>
                    <option value="/ram-update?build=${req.query['id']}&ram_id=${e.id}&amount=7">7</option>
                    <option value="/ram-update?build=${req.query['id']}&ram_id=${e.id}&amount=8">8</option>
                </select>
            <a href="/delete-component/ram?build=${req.query['id']}&ram_id=${e.id}"><span style="color: red">X</span></a>`
                    : `<h3>x${e.amount}</h3>`
                }
                
        </div>
        `;
    }

    let storage_decs = '';
    let storage_money = 0;
    let storage_tdp = 0;

    let storage_3_quantity = 0;
    let storage_2_quantity = 0;
    for (const e of storage) {
      if (e.form_fact == '2.5') {
        storage_2_quantity += e.amount;
      } else if (e.form_fact == '3.5') {
        storage_3_quantity += e.amount;
      }

      storage_money += (e.price ?? 0) * (e.amount ?? 0);
      storage_tdp += 10 * (e.amount ?? 0);
      storage_decs += `
        <div style="display: flex; align-items:center; justify-content: space-between">
            <a href="/component-select/storage?build=${build.id}&id=${e.id}" style="display: flex; align-items:center">
                <img width=100 height=100 src="${e.image}">
                <h3>${e.name}</h3>
                <h3>${e.capacity} GB</h3>
                <h3>${money.format(e.price * e.amount)} (${money.format(
                  e.price
                )} per)</h3>
            </a>
                ${
                  idcheck == 1 && req.cookies['username'] == build.username
                    ? `<select onchange="location = this.value;">
                    <option selected disable hidden>${e.amount}</option>
                    <option value="/storage-update?build=${req.query['id']}&storage_id=${e.id}&amount=1">1</option>
                    <option value="/storage-update?build=${req.query['id']}&storage_id=${e.id}&amount=2">2</option>
                    <option value="/storage-update?build=${req.query['id']}&storage_id=${e.id}&amount=3">3</option>
                    <option value="/storage-update?build=${req.query['id']}&storage_id=${e.id}&amount=4">4</option>
                    <option value="/storage-update?build=${req.query['id']}&storage_id=${e.id}&amount=5">5</option>
                    <option value="/storage-update?build=${req.query['id']}&storage_id=${e.id}&amount=6">6</option>
                    <option value="/storage-update?build=${req.query['id']}&storage_id=${e.id}&amount=7">7</option>
                    <option value="/storage-update?build=${req.query['id']}&storage_id=${e.id}&amount=8">8</option>
                </select>
            <a href="/delete-component/storage?build=${req.query['id']}&storage_id=${e.id}"><span style="color: red">X</span></a>`
                    : `<h3>x${e.amount}</h3>`
                }
                
        </div>`;
    }

    if (build.cpu_socket != build.mb_socket)
      problems += `
    <p onclick="this.style.height = 0; this.style.margin = 0; this.style.padding = 0; this.style.opacity = 0; this.style.borderWidth = 0" style="width: 200px; cursor: pointer; transition: 0.2s; overflow: hidden; background: #ffd5d5;border: #ff7c7c 2px solid;border-radius: 5px;padding: 10px;color: brown;">CPU và Mainboard không phù hợp</p>
    `;

    if (build.mb_max_mem != null && ram_total_capacity > build.mb_max_mem)
      problems += `
    <p onclick="this.style.height = 0; this.style.margin = 0; this.style.padding = 0; this.style.opacity = 0; this.style.borderWidth = 0" style="width: 200px; cursor: pointer; transition: 0.2s; overflow: hidden; background: #ffd5d5;border: #ff7c7c 2px solid;border-radius: 5px;padding: 10px;color: brown;">Dung lượng ram vượt quá dung lượng cho phép của Mainboard (${build.mb_max_mem})</p>
    `;

    if (build.cpu_max_mem != null && ram_total_capacity > build.cpu_max_mem)
      problems += `
    <p onclick="this.style.height = 0; this.style.margin = 0; this.style.padding = 0; this.style.opacity = 0; this.style.borderWidth = 0" style="width: 200px; cursor: pointer; transition: 0.2s; overflow: hidden; background: #ffd5d5;border: #ff7c7c 2px solid;border-radius: 5px;padding: 10px;color: brown;">Dung lượng ram vượt quá dung lượng cho phép của CPU (${build.cpu_max_mem})</p>
    `;

    if (build.mem_slots != null && ram_quantity > build.mem_slots)
      problems += `
    <p onclick="this.style.height = 0; this.style.margin = 0; this.style.padding = 0; this.style.opacity = 0; this.style.borderWidth = 0" style="width: 200px; cursor: pointer; transition: 0.2s; overflow: hidden; background: #ffd5d5;border: #ff7c7c 2px solid;border-radius: 5px;padding: 10px;color: brown;">Số lượng ram vượt quá số lượng cho phép của Mainboard (${build.mem_slots} khe cắm)</p>
    `;

    if (storage_3_quantity + storage_2_quantity > build.sata_slots)
      problems += `
    <p onclick="this.style.height = 0; this.style.margin = 0; this.style.padding = 0; this.style.opacity = 0; this.style.borderWidth = 0" style="width: 200px; cursor: pointer; transition: 0.2s; overflow: hidden; background: #ffd5d5;border: #ff7c7c 2px solid;border-radius: 5px;padding: 10px;color: brown;">Số lượng ổ cứng vượt quá số lượng cho phép của Mainboard (${build.sata_slots} khe cắm)</p>
    `;

    if (storage_3_quantity > build.sata_slots_3)
      problems += `
    <p onclick="this.style.height = 0; this.style.margin = 0; this.style.padding = 0; this.style.opacity = 0; this.style.borderWidth = 0" style="width: 200px; cursor: pointer; transition: 0.2s; overflow: hidden; background: #fff4c9;border: #ffcb67 2px solid;border-radius: 5px;padding: 10px;color: #9f7a32;">Số lượng ổ cứng 3.5" nhiều hơn so với số chỗ lắp trên thùng máy</p>
    `;
    if (storage_2_quantity > build.sata_slots_2 + build.sata_slots_3)
      problems += `
    <p onclick="this.style.height = 0; this.style.margin = 0; this.style.padding = 0; this.style.opacity = 0; this.style.borderWidth = 0" style="width: 200px; cursor: pointer; transition: 0.2s; overflow: hidden; background: #fff4c9;border: #ffcb67 2px solid;border-radius: 5px;padding: 10px;color: #9f7a32;">Số lượng ổ cứng 2.5" nhiều hơn so với số chỗ lắp trên thùng máy</p>
    `;

    if (
      build.mb_form != null &&
      build.case_form != null &&
      build.mb_form != build.case_form
    )
      problems += `
    <p onclick="this.style.height = 0; this.style.margin = 0; this.style.padding = 0; this.style.opacity = 0; this.style.borderWidth = 0" style="width: 200px; cursor: pointer; transition: 0.2s; overflow: hidden; background: #fff4c9;border: #ffcb67 2px solid;border-radius: 5px;padding: 10px;color: #9f7a32;">Mainboard có thể lớn hơn hoặc quá nhỏ so với thùng máy</p>
    `;

    if (
      build.psu_form != null &&
      build.case_form != null &&
      build.case_form != build.psu_form
    )
      problems += `
    <p onclick="this.style.height = 0; this.style.margin = 0; this.style.padding = 0; this.style.opacity = 0; this.style.borderWidth = 0" style="width: 200px; cursor: pointer; transition: 0.2s; overflow: hidden; background: #fff4c9;border: #ffcb67 2px solid;border-radius: 5px;padding: 10px;color: #9f7a32;">Nguồn có thế lớn hơn so với kích thước thùng máy</p>
    `;

    if (build.max_vga_len != null && build.vga_len > build.max_vga_len)
      problems += `
    <p onclick="this.style.height = 0; this.style.margin = 0; this.style.padding = 0; this.style.opacity = 0; this.style.borderWidth = 0" style="width: 200px; cursor: pointer; transition: 0.2s; overflow: hidden; background: #fff4c9;border: #ffcb67 2px solid;border-radius: 5px;padding: 10px;color: #9f7a32;">VGA có chiều dài hơn chiều dài thùng máy</p>
    `;

    if (build.status == 0 && req.cookies['username'] != build.username) {
      res.redirect('/login');
    } else {
      res.render('views/getBuild', {
        idcheck: idcheck,
        username: req.cookies['username'],
        build_name: build.name,
        build_id: build.id,
        build_username: build.username,
        problems: problems,
        board_id: build.board_id,
        mb_image: build.mb_image,
        mb_name: build.mb_name,
        mb_socket: build.mb_socket,
        mb_price: money.format(build.mb_price),
        cpu_id: build.cpu_id,
        cpu_image: build.cpu_image,
        cpu_name: build.cpu_name,
        cpu_socket: build.cpu_socket,
        cpu_price: money.format(build.cpu_price),
        vga_id: build.vga_id,
        vga_image: build.vga_image,
        vga_name: build.vga_name,
        vga_price: money.format(build.vga_price),
        ram_decs: ram_decs,
        storage_decs: storage_decs,
        psu_id: build.psu_id,
        psu_image: build.psu_image,
        psu_name: build.psu_name,
        psu_wattage: build.psu_wattage,
        psu_price: money.format(build.psu_price),
        cooler_id: build.cooler_id,
        cooler_image: build.cooler_image,
        cooler_name: build.cooler_name,
        cooler_price: money.format(build.cooler_price),
        case_id: build.case_id,
        case_image: build.case_image,
        case_name: build.case_name,
        case_form: build.case_form,
        case_price: money.format(build.case_price),
        status: build.status,
        minP:
          (Math.round(
            ((build.cpu_tdp ?? 0) + (build.vga_tdp ?? 0) + storage_tdp) / 50
          ) +
            3) *
          50,
        totalPrice: money.format(
          parseInt(build.mb_price ?? 0) +
            parseInt(build.cpu_price ?? 0) +
            parseInt(build.vga_price ?? 0) +
            parseInt(build.case_price ?? 0) +
            parseInt(build.cooler_price ?? 0) +
            parseInt(build.psu_price ?? 0) +
            ram_money +
            storage_money
        ),
        descs: JSON.stringify(descs),
        desc_whitelist: JSON.stringify(desc_whitelist),
      });
    }
  } catch (e) {
    res.redirect('/build_list');
  }
}

async function getBuildListPublic(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1 and password = $2`,
      [req.cookies['username'], req.cookies['password']]
    )
  ).rows[0].count;

  try {
    const data = (
      await client.query(`
                select id, name, username, desc_ from (select "BUILD_DESC".build_id, string_agg("desc", 'ÆĶ') as desc_ from (select * from "BUILDs" where status = true)
                right join "BUILD_DESC" ON "BUILD_DESC".build_id = id
                group by "BUILD_DESC".build_id)
                left join "BUILDs" ON "BUILDs".id = build_id
            `)
    ).rows;
    let build_list = '';

    data.forEach((e) => {
      let desc = ``;
      e.desc_.split('ÆĶ').forEach((e) => {
        desc += `<span class="w3-tag w3-blue" style="border-radius: 5px; font-size: 12px; margin: 10px 10px 10px 0; white-space: pre-wrap">${e}</span>`;
      });
      build_list += `<div style="display: flex; align-items: center">
                            <a href="/build?id=${e.id}" class="select-build">
                                <div style="display: flex; flex-direction: column">
                                    <span>${
                                      e.name === null || e.name == ''
                                        ? `Build của ${
                                            e.username + ' #' + e.id
                                          }`
                                        : e.name
                                    }</span>
                                     <div style="display: flex; align-items: center; flex-wrap: wrap">
                                        ${desc}
                                     </div>
                                </div>
                            </a>
                            <a class="select-button" href="/create_build?id=${e.id}">Add to your build</a>
                            </div>`;
    });

    res.render('views/getBuildListPublic', {
      idcheck: idcheck,
      username: req.cookies['username'],
      user_description: req.query.user_description,
      length: data.length,
      build_list: build_list,
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function searchBuild(req, res) {
  try {
    const userDescription = req.query.user_description;
    const idcheck = (
      await client.query(
        `select count(username) from "USERS" where username = $1 and password = $2`,
        [req.cookies['username'], req.cookies['password']]
      )
    ).rows[0].count;

    const data = (
      await client.query(
        `SELECT id, name, username, desc_ FROM (
          SELECT "BUILD_DESC".build_id, string_agg("desc", 'ÆĶ') as desc_ 
          FROM "BUILD_DESC"
          JOIN "BUILDs" ON "BUILD_DESC".build_id = "BUILDs".id
          WHERE "BUILDs".status = true AND (
            "BUILDs".name ILIKE '%' || $1 || '%' OR
            "BUILD_DESC".desc ILIKE '%' || $1 || '%'
          )
          GROUP BY "BUILD_DESC".build_id
        ) AS build_data
        LEFT JOIN "BUILDs" ON "BUILDs".id = build_data.build_id`,
        [userDescription]
      )
    ).rows;

    let build_list = '';
    data.forEach((e) => {
      let desc = '';
      e.desc_.split('ÆĶ').forEach((descItem) => {
        desc += `<span class="w3-tag w3-blue" style="border-radius: 5px; font-size: 12px; margin: 10px 10px 10px 0; white-space: pre-wrap">${descItem}</span>`;
      });
      build_list += `<div style="display: flex; align-items: center" class="build-div">
                      <a href="/build?id=${e.id}" class="select-build">
                        <div style="display: flex; flex-direction: column">
                          <span>${e.name === null || e.name == '' ? `Build của ${e.username + ' #' + e.id}` : e.name}</span>
                          <div style="display: flex; align-items: center; flex-wrap: wrap">
                            ${desc}
                          </div>
                        </div>
                      </a>
                      <a class="select-button" href="/create_build?id=${e.id}">Add to your build</a>
                    </div>`;
    });

    res.render('views/searchBuild', {
      idcheck: idcheck,
      username: req.cookies['username'],
      user_description: userDescription,
      length: data.length,
      build_list: build_list,
    });
  } catch (e) {
    res.redirect('/');
  }
}

export {
  getBuildList,
  createBuild,
  updateBuildStatus,
  updateBuildName,
  updateBuildDesc,
  getBuild,
  getBuildListPublic,
  searchBuild,
};

import { client } from "../db.js";
import { money } from "../utils.js";

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

      res.send(`
        <!DOCTYPE html>
        <html>
        
        <head>
            <meta charset='utf-8'>
        
            <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
            <meta property="og:title" content="Trang build PC số 1 Việt Nam"/>
            <meta property="og:image" content="https://server.yurixahri.net/Photos/koishi.png"/>
            
            <meta property="og:url" content="/build_list"/>
            <meta property="og:site_name" content="Koishi Build PC"/>
            <meta property="og:description" content="Trang build PC số 1 Việt Nam">
            <meta property="og:type" content="website"/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content="Trang build PC số 1 Việt Nam"/>
            <meta name="twitter:description" content="Trang build PC số 1 Việt Nam">
            <meta name="twitter:image" content="https://server.yurixahri.net/Photos/koishi.png"/>

            <title>Danh sách build</title>

            
            <link rel="shortcut icon" href="https://server.yurixahri.net/Photos/koishi.png">

            <style>
                body{
                    height: 100vh;
                    margin: 0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(to bottom, rgb(15 27 38), rgb(15 27 38));
                }
            
                ul li {
                    list-style: none;
                    margin: 0 auto;
                    border-left: 5px solid #3ca0e7;
                    
                    padding: 10px 30px 10px;
                    
                    text-decoration: none;
                    text-align: center;
                
                }
            
                li a {
                    color: aliceblue;
                }
            
                li a:hover {
                    color: #3ca0e7;
                }
            
                li:hover {
                    cursor: pointer;
                }
            
                .dropdown ul {
                    visibility: hidden;
                    opacity: 0;
                    position: absolute;
                    padding-left: 0;
                    margin: 0;
                    display: none;
                    background: rgb(26, 53, 66);
                }
            
                .dropdown a, .left_cell a {
                    height: 100%;
                    display: flex;
                    align-items: center;
                }
            
                .dropdown:hover> ul {
                    visibility: visible;
                    opacity: 1;
                    display: block;
                    
                    text-align: left;
                    
                }
            
                .select-button{
                    padding: 5px;
                    border-radius: 5px;
                    margin-left: 20px;
                    background-color: #1c86d1;
                }
            
                .select-build{
                    padding: 10px;
                    border-radius: 5px;
                    margin: 10px 0 10px 0;
                    background-color: #113b5a84;
                    transition: 0.1s;
                }
            
                .select-build:hover{
                    background-color: #34566e84;
                }
            
                
            
            
                
            
            
                a {
                    text-decoration: none;
                    color: aliceblue;
                    cursor: pointer;
                }   
            
                #nav a:hover {
                    color: rgb(0, 136, 255);
                }
            
                .left_cell{
                    margin: 0 10px 0 10px;
                    height: 100px;
                }
            
                .center{
                    position: absolute;
                    margin: auto;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
            
                }
            
                
            .snow-container {
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    pointer-events: none;
}

.snowflake {
    position: absolute;
    background-color: white;
    border-radius: 50%;
    opacity: 0.8;
    pointer-events: none;
}

@keyframes fall {
    0% {
        opacity: 0;
        transform: translateY(0);
    }
    10% {
        opacity: 1;
    }
    100% {
        opacity: 0.5;
        transform: translateY(100vh);
    }
}

@keyframes diagonal-fall {
    0% {
        opacity: 0;
        transform: translate(0, 0);
    }
    10% {
        opacity: 1;
    }
    100% {
        opacity: 0.25;
        transform: translate(10vw, 100vh);
    }
}

</style>
        
        </head>
        
        <body>
            <div class="snow-container"></div>
<div id="nav" style="height: 100px; display: flex; background-color: rgb(26, 53, 66); justify-content: space-between; position: relative; z-index: 2">
                <div style="display: flex; align-items: center;">
                    <a href="/"><img src="https://server.yurixahri.net/Photos/koishi.png" width="100" class="left_cell"></a>
        
                    <div class="dropdown left_cell">
                        <a href="#">PRODUCTS</a>
                        <ul>
                            <li><a href="/component-select/cpu">CPU</a></li>
                            <li><a href="/component-select/mb">MOTHERBOARD</a></li>
                            <li><a href="/component-select/ram">RAM</a></li>
                            <li><a href="/component-select/vga">VGA</a></li>
                            <li><a href="/component-select/psu">PSU</a></li>
                            <li><a href="/component-select/cooler">CPU COOLER</a></li>
                            <li><a href="/component-select/storage">STORAGE</a></li>
                            <li><a href="/component-select/case">CASE</a></li>
                        </ul>
                    </div>
                    
                    <div class="left_cell"><a href="/guide">GUIDE</a></div>
                    <div class="left_cell"><a href="/build_list_public">BUILDS</a></div>
                </div>
        
                <div style="display: flex; align-items: center;">       
                    <div class="dropdown left_cell">
                        <a>${req.cookies['username']}</a>
                        <ul style="right: 0">
                            <li><a href="/logout">Logout</a></li>
                            <li><a href="/build_list">My Builds</a></li>
                        </ul>
                    </div>
                </div>
        
                
            </div>
            
            <div style="margin: 50px auto 50px auto; width: 70%;height: fit-content;top: 0;bottom: 0; display: flex; flex-direction: column; color: aliceblue; padding-bottom: 200px;">
                <div style="display: flex; align-items: center;">
                    <h3>You have ${data.length} builds</h3>
                    <a href="/create_build?username=${req.cookies['username']}" class="select-button">Create Build</a>
                </div>
                <div style="display: flex; flex-direction: column;">
                    ${build_list}
                </div>
            </div>
        </body>
        <script type="text/javascript" src="https://yurixahri.net:83/assets/noel.js"></script>
        </html>
                `);
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
      res.send(`
            <!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8'>

    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <meta property="og:title" content="Trang build PC số 1 Việt Nam"/>
    <meta property="og:image" content="https://server.yurixahri.net/Photos/koishi.png"/>
    
    <meta property="og:url" content="/build?id=${build.id}"/>
    <meta property="og:site_name" content="Koishi Build PC"/>
    <meta property="og:description" content="${
      build.name === null || build.name == ''
        ? `Build của ${build.username + ' #' + build.id}`
        : build.name
    }">
    <meta property="og:type" content="website"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content="Trang build PC số 1 Việt Nam"/>
    <meta name="twitter:description" content="Trang build PC số 1 Việt Nam">
    <meta name="twitter:image" content="https://server.yurixahri.net/Photos/koishi.png"/>

    <title>${
      build.name === null || build.name == ''
        ? `Build của ${build.username + ' #' + build.id}`
        : build.name
    }</title>
    <link rel="shortcut icon" href="https://server.yurixahri.net/Photos/koishi.png">

    <script src="https://cdn.jsdelivr.net/npm/@yaireo/tagify"></script>
    <link href="https://cdn.jsdelivr.net/npm/@yaireo/tagify/dist/tagify.css" rel="stylesheet" type="text/css" />

    

    <style>
    body{
        height: 100vh;
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(to bottom, rgb(15 27 38), rgb(15 27 38));
    }

    ul li {
        list-style: none;
        margin: 0 auto;
        border-left: 5px solid #3ca0e7;
        
        padding: 10px 30px 10px;
        
        text-decoration: none;
        text-align: center;
       
    }
    
    h3{
        margin:  20px
    }

    li a {
        color: aliceblue;
    }

    li a:hover {
        color: #3ca0e7;
    }

    li:hover {
        cursor: pointer;
    }

    .dropdown ul {
        visibility: hidden;
        opacity: 0;
        position: absolute;
        padding-left: 0;
        margin: 0;
        display: none;
        background: rgb(26, 53, 66);
    }

    .dropdown a, .left_cell a {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .dropdown:hover> ul {
        visibility: visible;
        opacity: 1;
        display: block;
        
        text-align: left;
        
    }

    .select-button{
        padding: 5px;
        border-radius: 5px;
        margin-left: 20px;
        background-color: #1c86d1;
    }

    td, th{
        border-bottom: aliceblue 1px dashed;
        height: 140px;
        text-align: left;
    }

    select {
        width: fit-content;
        /* Reset Select */
        appearance: none;
        outline: 10px red;
        border: 0;
        border-radius: 5px;
        box-shadow: none;
        /* Personalize */
        flex: 1;
        padding: 10px;
        color: #fff;
        background-color: #2c3e50;
        background-image: none;
        cursor: pointer;
    }
    /* Remove IE arrow */
    select::-ms-expand {
        display: none;
    }

   

    


    a {
        text-decoration: none;
        color: aliceblue;
        cursor: pointer;
    }   

    #nav a:hover {
        color: rgb(0, 136, 255);
    }

    .left_cell{
        margin: 0 10px 0 10px;
        height: 100px;
    }

    .center{
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;

    }

    input{
        outline: none;
        width: 100%;
        color: aliceblue;
    }
    .effect-14:focus{color: black;}
    .effect-14{border: 0; padding: 7px 15px; position: relative; background: transparent; font-size:xxx-large; height: 100px }
    .effect-14 ~ .focus-bg:before,
    .effect-14 ~ .focus-bg:after{content: ""; position: absolute; left: 0; top: 0; width: 0; height: 0; background-color: #ededed; transition: 0.3s; z-index: -1;}
    .effect-14:focus ~ .focus-bg:before{transition: 0.3s; width: 50%; height: 100%;}
    .effect-14 ~ .focus-bg:after{left: auto; right: 0; top: auto; bottom: 0;}
    .effect-14:focus ~ .focus-bg:after{transition: 0.3s; width: 50%; height: 100%;}


    .tagify{
        width: 100%;
        border-radius: 5px;
        ${
          idcheck == 1 && req.cookies['username'] == build.username
            ? ``
            : 'border: none'
        }
    }
    .tagify[readonly]:not(.tagify--mix):not(.tagify--select) .tagify__tag>div::before{
        animation: none
    }
    .tagify__input:focus:empty::before, .tagify__input::before{
        color: aliceblue
    }

    .button-8 {
    background-color: #e1ecf4;
    border-radius: 3px;
    border: 1px solid #7aa7c7;
    box-shadow: rgba(255, 255, 255, .7) 0 1px 0 0 inset;
    box-sizing: border-box;
    color: #39739d;
    cursor: pointer;
    display: inline-block;
    font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.15385;
    margin: 0;
    outline: none;
    padding: 8px .8em;
    position: relative;
    text-align: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
    white-space: nowrap;
    }

    .button-8:hover,
    .button-8:focus {
    background-color: #b3d3ea;
    color: #2c5777;
    }

    .button-8:focus {
    box-shadow: 0 0 0 4px rgba(0, 149, 255, .15);
    }

    .button-8:active {
    background-color: #a0c7e4;
    box-shadow: none;
    color: #2c5777;
    }
    
.snow-container {
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    pointer-events: none;
}

.snowflake {
    position: absolute;
    background-color: white;
    border-radius: 50%;
    opacity: 0.8;
    pointer-events: none;
}

@keyframes fall {
    0% {
        opacity: 0;
        transform: translateY(0);
    }
    10% {
        opacity: 1;
    }
    100% {
        opacity: 0.5;
        transform: translateY(100vh);
    }
}

@keyframes diagonal-fall {
    0% {
        opacity: 0;
        transform: translate(0, 0);
    }
    10% {
        opacity: 1;
    }
    100% {
        opacity: 0.25;
        transform: translate(10vw, 100vh);
    }
}

</style>

</head>

<body>
    <div class="snow-container"></div>
<div id="nav" style="height: 100px; display: flex; background-color: rgb(26, 53, 66); justify-content: space-between; position: relative; z-index: 2">
        <div style="display: flex; align-items: center;">
            <a href="/"><img src="https://server.yurixahri.net/Photos/koishi.png" width="100" class="left_cell"></a>

            <div class="dropdown left_cell">
                <a href="#">PRODUCTS</a>
                <ul>
                    <li><a href="/component-select/cpu">CPU</a></li>
                    <li><a href="/component-select/mb">MOTHERBOARD</a></li>
                    <li><a href="/component-select/ram">RAM</a></li>
                    <li><a href="/component-select/vga">VGA</a></li>
                    <li><a href="/component-select/psu">PSU</a></li>
                    <li><a href="/component-select/cooler">CPU COOLER</a></li>
                    <li><a href="/component-select/storage">STORAGE</a></li>
                    <li><a href="/component-select/case">CASE</a></li>
                </ul>
            </div>
            
            <div class="left_cell"><a href="/guide">GUIDE</a></div>
            <div class="left_cell"><a href="/build_list_public">BUILDS</a></div>
        </div>

        <div style="display: flex; align-items: center;">
            
            
            ${
              idcheck == 0
                ? `
            <div class="left_cell"><a href="/login">LOGIN</a></div>
            <div class="left_cell"><a href="/register">REGISTER</a></div>`
                : `<div class="dropdown left_cell">
                <a>${req.cookies['username']}</a>
                <ul style="right: 0">
                    <li><a href="/logout">Logout</a></li>
                    <li><a href="/build_list">My Builds</a></li>
                </ul>
            </div>`
            }
        </div>

        
    </div>

    <div style="position: absolute;right: 0;margin: 20px;z-index: 2;">
            ${problems}
    </div>

    <div style="margin: 50px auto 100px auto; width: 70%; height: fit-content;top: 0;bottom: 0; display: flex; flex-direction: column; color: aliceblue; padding-bottom: 200px;">
        ${
          idcheck == 1 && req.cookies['username'] == build.username
            ? `
        <form action="/update-build-name" method="get" style="position: relative; width: 100%;">
            <input class="effect-14" type="text" name="name" placeholder="Nhập tên build" value="${
              build.name === null || build.name == '' ? `` : build.name
            }" ></input>
            <span class="focus-bg"></span>
            <input name="build" value="${
              req.query['id']
            }" style="display: none"></input>
            <button style="display: none"></button>
        </form>
        `
            : `<h1 style="text-align: center;">${
                build.name === null || build.name == ''
                  ? `Build của ${build.username + ' #' + build.id}`
                  : build.name
              }</h1>`
        }
        

        
        <form action="/update-build-desc" method="get" style="position: relative; width: 100%;">
            <input name="build" value="${
              req.query['id']
            }" style="display: none"></input>
            <input id="desc" name="desc" placeholder="type description" ${
              idcheck == 1 && req.cookies['username'] == build.username
                ? ``
                : 'readonly'
            }>
            
            ${
              idcheck == 1 && req.cookies['username'] == build.username
                ? `<button class="button-8">Submit</button>`
                : ''
            }
        </form>
        
        
        <table>

            <tr>
                <th><h3>Mainboard</h3></th>
                
                <td>
                    ${
                      build.board_id != null
                        ? `<a href="/component-select/mb?build=${build.id}&id=${build.board_id}" style="display: flex; align-items:center">
                        
                        <img width=100 height=100 src="${build.mb_image}">
                        <h3>${build.mb_name}</h3>
                        <h3>${build.mb_socket}</h3>
                        <h3>${money.format(build.mb_price)}</h3>
                    </a>`
                        : ''
                    }
                </td>
                ${
                  idcheck == 1 && req.cookies['username'] == build.username
                    ? `<td><a href="/component-select/mb?build=${build.id}" class="select-button">Select</a></td>`
                    : ''
                }
            </tr>
            <tr>
                <th><h3>CPU</h3></th>
                <td>
                    ${
                      build.cpu_id != null
                        ? `<a href="/component-select/cpu?build=${build.id}&id=${build.cpu_id}" style="display: flex; align-items:center">
                        <img width=100 height=100 src="${build.cpu_image}">
                        <h3>${build.cpu_name}</h3>
                        <h3>${build.cpu_socket}</h3>
                        <h3>${money.format(build.cpu_price)}</h3>
                    </a>`
                        : ''
                    }
                </td>
                ${
                  idcheck == 1 && req.cookies['username'] == build.username
                    ? `<td><a href="/component-select/cpu?build=${build.id}" class="select-button">Select</a></td>`
                    : ''
                }
            </tr>
            <tr>
                <th><h3>VGA</h3></th>
                <td style="display: flex; align-items:center; justify-content: space-between">
                    ${
                      build.vga_id != null
                        ? `<a href="/component-select/vga?build=${build.id}&id=${build.vga_id}" style="display: flex; align-items:center">
                            <img width=100 height=100 src="${build.vga_image}">
                            <h3>${build.vga_name}</h3>
                            <h3>${money.format(build.vga_price)}</h3>
                        </a>
                        ${idcheck == 1 && req.cookies['username'] == build.username ? `<a href="/delete-component/vga?build=${req.query['id']}"><span style="color: red">X</span></a>` : ''}
                        `
                        : ''
                    }
                    
                </td>
                ${
                  idcheck == 1 && req.cookies['username'] == build.username
                    ? `<td><a href="/component-select/vga?build=${build.id}" class="select-button">Select</a></td>`
                    : ''
                }
            </tr>
            <tr>
                <th><h3>Memory</h3></th>
                <td>
                    
                        ${ram_decs}
                    
                </td>
                ${
                  idcheck == 1 && req.cookies['username'] == build.username
                    ? `<td><a href="/component-select/ram?build=${build.id}" class="select-button">Select</a></td>`
                    : ''
                }
                
                
            </tr>
            <tr>
                <th><h3>Storage</h3></th>
                <td>
                    
                        ${storage_decs}
                    
                </td>
                ${
                  idcheck == 1 && req.cookies['username'] == build.username
                    ? `<td><a href="/component-select/storage?build=${build.id}" class="select-button">Select</a></td>`
                    : ''
                }
            </tr>
            <tr>
                <th><h3>PSU</h3></th>
                <td>
                    ${
                      build.psu_id != null
                        ? `<a href="/component-select/psu?build=${build.id}&id=${build.psu_id}" style="display: flex; align-items:center">
                            <img width=100 height=100 src="${build.psu_image}">
                            <h3>${build.psu_name}</h3>
                            <h3>${build.psu_wattage} W</h3>
                            <h3>${money.format(build.psu_price)}</h3>
                        </a>`
                        : ''
                    }
                </td>
                ${
                  idcheck == 1 && req.cookies['username'] == build.username
                    ? `<td><a href="/component-select/psu?build=${build.id}" class="select-button">Select</a></td>`
                    : ''
                }
            </tr>
            <tr>
            
                <th><h3>Cooler</h3></th>
                <td>
                    ${
                      build.cooler_id != null
                        ? `<a href="/component-select/cooler?build=${build.id}&id=${build.cooler_id}" style="display: flex; align-items:center">
                            <img width=100 height=100 src="${
                              build.cooler_image
                            }">
                            <h3>${build.cooler_name}</h3>
                            <h3>${money.format(build.cooler_price)}</h3>
                        </a>`
                        : ''
                    }
                </td>
                ${
                  idcheck == 1 && req.cookies['username'] == build.username
                    ? `<td><a href="/component-select/cooler?build=${build.id}" class="select-button">Select</a></td>`
                    : ''
                }
            
            </tr>
            <tr>
                <th><h3>Case</h3></th>
                <td>
                    ${
                      build.case_id != null
                        ? `<a href="/component-select/case?build=${build.id}&id=${build.case_id}" style="display: flex; align-items:center">
                            <img width=100 height=100 src="${build.case_image}">
                            <h3>${build.case_name}</h3>
                            <h3>${build.case_form}</h3>
                            <h3>${money.format(build.case_price)}</h3>
                        </a>`
                        : ''
                    }
                </td>
                ${
                  idcheck == 1 && req.cookies['username'] == build.username
                    ? `<td><a href="/component-select/case?build=${build.id}" class="select-button">Select</a></td>`
                    : ''
                }
            
            </tr>
            
        </table>
        <br>
        ${
          idcheck == 1 && req.cookies['username'] == build.username
            ? `
            <select onchange="location = this.value;">
            <option selected disable hidden>${!build.status ? `Private` : `Public`}</option>
            <option value="/update-status?build=${req.query['id']}&status=1">Public</option>
            <option value="/update-status?build=${req.query['id']}&status=0">Private</option>
            </select>
            <a href="/delete-component/build?build=${req.query['id']}" onclick="return confirm('Bạn có muốn xóa build?');" style="color: red">Xóa build</a>
            `
            : ''
        }
        
        <h3 style="text-align: right">Gợi ý nguồn tối thiểu: ${
          (Math.round(
            ((build.cpu_tdp ?? 0) + (build.vga_tdp ?? 0) + storage_tdp) / 50
          ) +
            3) *
          50
        } W</h3>
        <h3 style="text-align: right">Tổng giá: ${money.format(
          parseInt(build.mb_price ?? 0) +
            parseInt(build.cpu_price ?? 0) +
            parseInt(build.vga_price ?? 0) +
            parseInt(build.case_price ?? 0) +
            parseInt(build.cooler_price ?? 0) +
            parseInt(build.psu_price ?? 0) +
            ram_money +
            storage_money
        )}</h3>
    </div>
</body>

<script>
    const input = document.querySelector('#desc')
    var tagify = new Tagify(input, {
        texts: {duplicate: "Duplicates are not allowed"},
        delimiters          : "ÆĶ",
        dropdown: {
            enabled: 0
        },
        whitelist: ${JSON.stringify(desc_whitelist)}
    })

    tagify.on('change', console.log)

    tagify.addTags(${JSON.stringify(descs)})
</script>
<script type="text/javascript" src="https://yurixahri.net:83/assets/noel.js"></script>
</html>
            `);
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

    res.send(`
        <!DOCTYPE html>
        <html>
        
        <head>
            <meta charset='utf-8'>
        
            <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
            <meta property="og:title" content="Trang build PC số 1 Việt Nam"/>
            <meta property="og:image" content="https://server.yurixahri.net/Photos/koishi.png"/>
            
            <meta property="og:url" content="/build_list_public"/>
            <meta property="og:site_name" content="Koishi Build PC"/>
            <meta property="og:description" content="Trang build PC số 1 Việt Nam">
            <meta property="og:type" content="website"/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content="Trang build PC số 1 Việt Nam"/>
            <meta name="twitter:description" content="Trang build PC số 1 Việt Nam">
            <meta name="twitter:image" content="https://server.yurixahri.net/Photos/koishi.png"/>

            <title>Danh sách build public</title>

            
            <link rel="shortcut icon" href="https://server.yurixahri.net/Photos/koishi.png">

            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">

            <style>
            body{
                height: 100vh;
                font-size: initial;
                margin: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(to bottom, rgb(15 27 38), rgb(15 27 38));
            }
        
            ul li {
                list-style: none;
                margin: 0 auto;
                border-left: 5px solid #3ca0e7;
                
                padding: 10px 30px 10px;
                
                text-decoration: none;
                text-align: center;
               
            }
        
            li a {
                color: aliceblue;
            }
        
            li a:hover {
                color: #3ca0e7;
            }
        
            li:hover {
                cursor: pointer;
            }
        
            .dropdown ul {
                visibility: hidden;
                opacity: 0;
                position: absolute;
                padding-left: 0;
                margin: 0;
                display: none;
                background: rgb(26, 53, 66);
            }
        
            .dropdown a, .left_cell a {
                height: 100%;
                display: flex;
                align-items: center;
            }
        
            .dropdown:hover> ul {
                visibility: visible;
                opacity: 1;
                display: block;
                
                text-align: left;
                
            }
        
            .select-button{
                padding: 5px;
                border-radius: 5px;
                margin-left: 20px;
                background-color: #1c86d1;
                white-space: pre;
            }
        
            .select-build{
                padding: 10px;
                border-radius: 5px;
                margin: 20px 0 20px 0;
                background-color: #113b5a84;
                transition: 0.1s;
            }

            .select-build > div > div{
                opacity: 0;
                height: 0;
                transition: 0.1s

            }

            .select-build:hover> div > div{
                opacity: 1;
                height: fit-content;
            }
        
            .select-build:hover{
                background-color: #34566e84;
            }
        
            
           
        
            
        
        
            a {
                text-decoration: none;
                color: aliceblue;
                cursor: pointer;
            }   
        
            #nav a:hover {
                color: rgb(0, 136, 255);
            }
        
            .left_cell{
                margin: 0 10px 0 10px;
                height: 100px;
            }
        
            .center{
                position: absolute;
                margin: auto;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
        
            }
        
            
        .snow-container {
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    pointer-events: none;
}

.snowflake {
    position: absolute;
    background-color: white;
    border-radius: 50%;
    opacity: 0.8;
    pointer-events: none;
}

@keyframes fall {
    0% {
        opacity: 0;
        transform: translateY(0);
    }
    10% {
        opacity: 1;
    }
    100% {
        opacity: 0.5;
        transform: translateY(100vh);
    }
}

@keyframes diagonal-fall {
    0% {
        opacity: 0;
        transform: translate(0, 0);
    }
    10% {
        opacity: 1;
    }
    100% {
        opacity: 0.25;
        transform: translate(10vw, 100vh);
    }
}

</style>
        
        </head>
        
        <body>
            <div class="snow-container"></div>
<div id="nav" style="height: 100px; display: flex; background-color: rgb(26, 53, 66); justify-content: space-between; position: relative; z-index: 2">
                <div style="display: flex; align-items: center;">
                    <a href="/"><a href="/"><img src="https://server.yurixahri.net/Photos/koishi.png" width="100" class="left_cell"></a></a>
        
                    <div class="dropdown left_cell">
                        <a href="#">PRODUCTS</a>
                        <ul>
                            <li><a href="/component-select/cpu">CPU</a></li>
                            <li><a href="/component-select/mb">MOTHERBOARD</a></li>
                            <li><a href="/component-select/ram">RAM</a></li>
                            <li><a href="/component-select/vga">VGA</a></li>
                            <li><a href="/component-select/psu">PSU</a></li>
                            <li><a href="/component-select/cooler">CPU COOLER</a></li>
                            <li><a href="/component-select/storage">STORAGE</a></li>
                            <li><a href="/component-select/case">CASE</a></li>
                        </ul>
                    </div>
                    
                    <div class="left_cell"><a href="/guide">GUIDE</a></div>
                    <div class="left_cell"><a href="/build_list_public">BUILDS</a></div>
                </div>
        
                <div style="display: flex; align-items: center;">       
                    ${
                      idcheck == 0
                        ? `
                        <div class="left_cell"><a href="/login">LOGIN</a></div>
                        <div class="left_cell"><a href="/register">REGISTER</a></div>`
                        : `<div class="dropdown left_cell">
                            <a>${req.cookies['username']}</a>
                            <ul style="right: 0">
                                <li><a href="/logout">Logout</a></li>
                                <li><a href="/build_list">My Builds</a></li>
                            </ul>
                    </div>`
                    }
                </div>
        
                
            </div>
            
            <div style="margin: 50px auto 50px auto; width: 70%;height: fit-content;top: 0;bottom: 0; display: flex; flex-direction: column; color: aliceblue; padding-bottom: 200px;">
                <form action="/search-build" method="get" style="position: relative; width: 100%;">
                    <input name="user_description" value="${
                      req.query['user_description'] ?? ''
                    }"></input>
                    <button class="button-8">Submit</button>
                </form>
                <div style="display: flex; align-items: center;">
                    <h3>We have ${data.length} builds in public</h3>
                </div>
                <div style="display: flex; flex-direction: column;">
                    ${build_list}
                </div>
            </div>
        </body>
        
        <script type="text/javascript" src="https://yurixahri.net:83/assets/noel.js"></script>
        </html>
                `);
  } catch (e) {
    res.sendStatus(500);
  }
}

async function searchBuild(req, res) {
  try {
    await fetch('http://192.168.5.47:21000/getBuild', {
      method: 'POST',
      body: JSON.stringify({
        user_description: req.query.user_description,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => data.json())
      .then(async (data2) => {
        let arg = '';
        if (JSON.parse(data2).length > 0) {
          arg = 'and (';
          JSON.parse(data2).forEach((e) => {
            arg += ` id = ${e.id} or`;
          });
          arg = arg.substr(0, arg.length - 2);
          arg += ')';
        }

        const idcheck = (
          await client.query(
            `select count(username) from "USERS" where username = $1 and password = $2`,
            [req.cookies['username'], req.cookies['password']]
          )
        ).rows[0].count;

        try {
          const data = (
            await client.query(`
                select id, name, username, desc_ from (select "BUILD_DESC".build_id, string_agg("desc", 'ÆĶ') as desc_ from (select * from "BUILDs" where status = true ${arg})
                join "BUILD_DESC" ON "BUILD_DESC".build_id = id
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

          res.send(`
        <!DOCTYPE html>
        <html>
        
        <head>
            <meta charset='utf-8'>
        
            <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
            <meta property="og:title" content="Trang build PC số 1 Việt Nam"/>
            <meta property="og:image" content="https://server.yurixahri.net/Photos/koishi.png"/>
            
            <meta property="og:url" content="/search_build?user_description=${req.query.user_description}"/>
            <meta property="og:site_name" content="Koishi Build PC"/>
            <meta property="og:description" content="Trang build PC số 1 Việt Nam">
            <meta property="og:type" content="website"/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content="Trang build PC số 1 Việt Nam"/>
            <meta name="twitter:description" content="Trang build PC số 1 Việt Nam">
            <meta name="twitter:image" content="https://server.yurixahri.net/Photos/koishi.png"/>

            <title>Tìm kiếm build</title>

            
            <link rel="shortcut icon" href="https://server.yurixahri.net/Photos/koishi.png">

            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <style>
            body{
                height: 100vh;
                margin: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(to bottom, rgb(15 27 38), rgb(15 27 38));
            }
        
            ul li {
                list-style: none;
                margin: 0 auto;
                border-left: 5px solid #3ca0e7;
                
                padding: 10px 30px 10px;
                
                text-decoration: none;
                text-align: center;
               
            }
        
            li a {
                color: aliceblue;
            }
        
            li a:hover {
                color: #3ca0e7;
            }
        
            li:hover {
                cursor: pointer;
            }
        
            .dropdown ul {
                visibility: hidden;
                opacity: 0;
                position: absolute;
                padding-left: 0;
                margin: 0;
                display: none;
                background: rgb(26, 53, 66);
            }
        
            .dropdown a, .left_cell a {
                height: 100%;
                display: flex;
                align-items: center;
            }
        
            .dropdown:hover> ul {
                visibility: visible;
                opacity: 1;
                display: block;
                
                text-align: left;
                
            }
        
            .select-button{
                padding: 5px;
                border-radius: 5px;
                margin-left: 20px;
                background-color: #1c86d1;
                white-space: pre;
            }
        
            .select-build{
                padding: 10px;
                border-radius: 5px;
                margin: 20px 0 20px 0;
                background-color: #113b5a84;
                transition: 0.1s;
            }

            .select-build > div > div{
                opacity: 0;
                height: 0;
                transition: 0.1s

            }

            .select-build:hover> div > div{
                opacity: 1;
                height: fit-content;
            }
        
            .select-build:hover{
                background-color: #34566e84;
            }
        
            
           
        
            
        
        
            a {
                text-decoration: none;
                color: aliceblue;
                cursor: pointer;
            }   
        
            #nav a:hover {
                color: rgb(0, 136, 255);
            }
        
            .left_cell{
                margin: 0 10px 0 10px;
                height: 100px;
            }
        
            .center{
                position: absolute;
                margin: auto;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
        
            }
        
            
        .snow-container {
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    pointer-events: none;
}

.snowflake {
    position: absolute;
    background-color: white;
    border-radius: 50%;
    opacity: 0.8;
    pointer-events: none;
}

@keyframes fall {
    0% {
        opacity: 0;
        transform: translateY(0);
    }
    10% {
        opacity: 1;
    }
    100% {
        opacity: 0.5;
        transform: translateY(100vh);
    }
}

@keyframes diagonal-fall {
    0% {
        opacity: 0;
        transform: translate(0, 0);
    }
    10% {
        opacity: 1;
    }
    100% {
        opacity: 0.25;
        transform: translate(10vw, 100vh);
    }
}

</style>
        
        </head>
        
        <body>
            <div class="snow-container"></div>
<div id="nav" style="height: 100px; display: flex; background-color: rgb(26, 53, 66); justify-content: space-between; position: relative; z-index: 2">
                <div style="display: flex; align-items: center;">
                    <a href="/"><img src="https://server.yurixahri.net/Photos/koishi.png" width="100" class="left_cell"></a>
        
                    <div class="dropdown left_cell">
                        <a href="#">PRODUCTS</a>
                        <ul>
                            <li><a href="/component-select/cpu">CPU</a></li>
                            <li><a href="/component-select/mb">MOTHERBOARD</a></li>
                            <li><a href="/component-select/ram">RAM</a></li>
                            <li><a href="/component-select/vga">VGA</a></li>
                            <li><a href="/component-select/psu">PSU</a></li>
                            <li><a href="/component-select/cooler">CPU COOLER</a></li>
                            <li><a href="/component-select/storage">STORAGE</a></li>
                            <li><a href="/component-select/case">CASE</a></li>
                        </ul>
                    </div>
                    
                    <div class="left_cell"><a href="/guide">GUIDE</a></div>
                    <div class="left_cell"><a href="/build_list_public">BUILDS</a></div>
                </div>
        
                <div style="display: flex; align-items: center;">       
                    ${
                      idcheck == 0
                        ? `
                        <div class="left_cell"><a href="/login">LOGIN</a></div>
                        <div class="left_cell"><a href="/register">REGISTER</a></div>`
                        : `<div class="dropdown left_cell">
                            <a>${req.cookies['username']}</a>
                            <ul style="right: 0">
                                <li><a href="/logout">Logout</a></li>
                                <li><a href="/build_list">My Builds</a></li>
                            </ul>
                    </div>`
                    }
                </div>
        
                
            </div>
            
            <div style="margin: 50px auto 50px auto; width: 70%;height: fit-content;top: 0;bottom: 0; display: flex; flex-direction: column; color: aliceblue; padding-bottom: 200px;">
                <form action="/search-build" method="get" style="position: relative; width: 100%;">
                    <input name="user_description" value="${
                      req.query['user_description']
                    }"></input>
                    <button class="button-8">Submit</button>
                </form>
                <div style="display: flex; align-items: center;">
                    <h3>We have ${data.length} builds in public</h3>
                </div>
                <div style="display: flex; flex-direction: column;">
                    ${build_list}
                </div>
            </div>
        </body>
        <script type="text/javascript" src="https://yurixahri.net:83/assets/noel.js"></script>
        </html>
                `);
        } catch (e) {
          res.sendStatus(500);
        }
      });
  } catch (e) {
    res.redirect('/');
  }
};

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

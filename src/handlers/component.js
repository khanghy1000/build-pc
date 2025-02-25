import { client } from "../db.js";
import { money } from "../utils.js";

async function deleteComponent(req, res) {
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
    if (req.path == '/delete-component/ram') {
      try {
        await client.query(
          `delete from "RAM_DETAILS" where build_id = $2 and ram_id = $1`,
          [req.query['ram_id'], req.query['build']]
        );
      } catch (e) {}
    } else if (req.path == '/delete-component/storage') {
      try {
        await client.query(
          `delete from "STORAGE_DETAILS" where build_id = $2 and storage_id = $1`,
          [req.query['storage_id'], req.query['build']]
        );
      } catch (e) {}
    } else if (req.path == '/delete-component/vga') {
      try {
        await client.query(`update "BUILDs" set vga_id = null where id = $1`, [
          req.query['build'],
        ]);
      } catch (e) {}
    } else if (req.path == '/delete-component/build') {
      try {
        await client.query(`delete from "RAM_DETAILS" where build_id = $1`, [
          req.query['build'],
        ]);
        await client.query(
          `delete from "STORAGE_DETAILS" where build_id = $1`,
          [req.query['build']]
        );
        await client.query(`delete from "BUILDs" where id = $1`, [
          req.query['build'],
        ]);
      } catch (e) {
        console.log(e);
      }
    }
    res.redirect(`/build?id=${req.query['build']}`);
  }
}

 async function insertComponent(req, res) {
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
    if (req.path == '/component-insert/mb') {
      try {
        await client.query(`update "BUILDs" set board_id = $1 where id = $2`, [
          req.query['id'],
          req.query['build'],
        ]);
      } catch {}
    } else if (req.path == '/component-insert/cpu') {
      try {
        await client.query(`update "BUILDs" set cpu_id = $1 where id = $2`, [
          req.query['id'],
          req.query['build'],
        ]);
      } catch {}
    } else if (req.path == '/component-insert/vga') {
      try {
        await client.query(`update "BUILDs" set vga_id = $1 where id = $2`, [
          req.query['id'],
          req.query['build'],
        ]);
      } catch {}
    } else if (req.path == '/component-insert/ram') {
      try {
        await client.query(
          `insert into "RAM_DETAILS" (ram_id, build_id, amount) values ($1, $2, 1) `,
          [req.query['id'], req.query['build']]
        );
      } catch {}
    } else if (req.path == '/component-insert/storage') {
      try {
        await client.query(
          `insert into "STORAGE_DETAILS" (storage_id, build_id, amount) values ($1, $2, 1) `,
          [req.query['id'], req.query['build']]
        );
      } catch {}
    } else if (req.path == '/component-insert/cooler') {
      try {
        await client.query(`update "BUILDs" set cooler_id = $1 where id = $2`, [
          req.query['id'],
          req.query['build'],
        ]);
      } catch {}
    } else if (req.path == '/component-insert/case') {
      try {
        await client.query(`update "BUILDs" set case_id = $1 where id = $2`, [
          req.query['id'],
          req.query['build'],
        ]);
      } catch {}
    } else if (req.path == '/component-insert/psu') {
      try {
        await client.query(`update "BUILDs" set psu_id = $1 where id = $2`, [
          req.query['id'],
          req.query['build'],
        ]);
      } catch {}
    }
    res.redirect(`/build?id=${req.query['build']}`);
  }
}

 async function selectComponent(req, res) {
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

  let count;
  let data;
  let rowheader = '';
  const page = req.query.page == undefined ? 1 : parseInt(req.query.page);
  let rowsdata = '';
  let paging = '';
  let filter = req.query.filter == undefined ? '' : req.query.filter;
  let id = req.query.id == undefined ? '' : req.query.id;

  if (req.path == '/component-select/mb') {
    try {
      count = (
        await client.query(
          `select count(id) from "MOTHERBOARDs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or socket_id ilike '%${filter}%' or form_factor_id ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''}
            
            
            `
        )
      ).rows[0].count;
      data = (
        await client.query(
          `select * from "MOTHERBOARDs" join (select "MB_id", string_agg("RAM_DDR_id", ', ') as ddr from "MB_RAM_TYPE" group by "MB_id")
    on "MOTHERBOARDs".id = "MB_id" ${
      filter != ''
        ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or socket_id ilike '%${filter}%' or form_factor_id ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
        : ''
    } ${id != '' ? `WHERE id = ${id}` : ''} order by socket_id desc, price asc  limit 20 offset $1`,
          [(page - 1) * 20]
        )
      ).rows;
      rowheader = `<tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th></th>
                                        <th>Price</th>
                                        <th>Socket</th>
                                        <th>Form Factor</th>
                                        <th>Memory Type Support</th>
                                        <th>Max Memory Support</th>
                                        <th>Memory Slots</th>
                                        <th>Sata Slots</th>
                                        <th>Color</th>
                                    `;

      data.forEach((e) => {
        const ddr_list = e.ddr.split(', ');
        let ddr_list_html = '<ul>';
        ddr_list.forEach((e) => {
          ddr_list_html += `<li>${e}</li>`;
        });
        ddr_list_html += '</ul>';
        rowsdata += `<tr>
                        <td><img width=100 height=100 src="${e.image}"></td>
                        <td>${e.name}</td>
                        <td><a href="${e.link}">link</td>
                        <td>${money.format(e.price)}</td>
                        <td>${e.socket_id}</td>
                        <td>${e.form_factor_id}</td>
                        <td>${ddr_list_html}</td>
                        <td>${e.max_mem}</td>
                        <td>${e.mem_slots}</td>
                        <td>${e.sata_slots}</td>
                        <td>${e.color}</td>
                        ${
                          idcheck != 0 &&
                          build.length != 0 &&
                          build[0].username == req.cookies['username']
                            ? `<td><a href="/component-insert/mb?build=${
                                req.query['build']
                              }&id=${e.id}" class="select-button ">Add</a></td>`
                            : ''
                        }
                        </tr>
                    `;
      });
    } catch (e) {}
  } else if (req.path == '/component-select/cpu') {
    try {
      count = (
        await client.query(
          `select count(id) from "CPUs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or socket_id ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''}`
        )
      ).rows[0].count;
      data = (
        await client.query(
          `select * from "CPUs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or socket_id ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''} order by socket_id desc, price asc limit 20 offset $1`,
          [(page - 1) * 20]
        )
      ).rows;
      rowheader = `<tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th></th>
                                        <th>Price</th>
                                        <th>Socket</th>
                                        <th>Base Clock</th>
                                        <th>Turbo Clock</th>
                                        <th>Core Number</th>
                                        <th>TDP</th>
                                        <th>Max Memory Support</th>
                                        <th>ECC Support</th>
                                    `;

      data.forEach((e) => {
        rowsdata += `<tr>
                        <td><img width=100 height=100 src="${e.image}"></td>
                        <td>${e.name}</td>
                        <td><a href="${e.link}">link</td>
                        <td>${money.format(e.price)}</td>
                        <td>${e.socket_id}</td>
                        <td>${e.base_clock}</td>
                        <td>${e.turbo_clock}</td>
                        <td>${e.core_num}</td>
                        <td>${e.tdp}</td>
                        <td>${e.max_mem}</td>
                        <td>${e.ecc_support ? 'Yes' : 'No'}</td>
                        ${
                          idcheck != 0 &&
                          build.length != 0 &&
                          build[0].username == req.cookies['username']
                            ? `<td><a href="/component-insert/cpu?build=${
                                req.query['build']
                              }&id=${e.id}" class="select-button ">Add</a></td>`
                            : ''
                        }
                        </tr>
                    `;
      });
    } catch (e) {}
  } else if (req.path == '/component-select/vga') {
    try {
      count = (
        await client.query(
          `select count(id) from "VGAs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''}`
        )
      ).rows[0].count;
      data = (
        await client.query(
          `select * from "VGAs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''} order by price asc limit 20 offset $1`,
          [(page - 1) * 20]
        )
      ).rows;
      rowheader = `<tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th></th>
                                        <th>Price</th>
                                        <th>VRAM</th>
                                        <th>VRAM Type</th>
                                        <th>Base Clock</th>
                                        <th>Turbo Clock</th>
                                        <th>TDP</th>
                                        <th>Length</th>
                                        <th>Color</th>                  
                                    `;

      data.forEach((e) => {
        rowsdata += `<tr>
                        <td><img width=100 height=100 src="${e.image}"></td>
                        <td>${e.name}</td>
                        <td><a href="${e.link}">link</td>
                        <td>${money.format(e.price)}</td>
                        <td>${e.vram}</td>
                        <td>${e.vram_type}</td>
                        <td>${e.base_clock}</td>
                        <td>${e.boost_clock}</td>
                        <td>${e.TDP}</td>
                        <td>${e.length}mm</td>
                        <td>${e.color}</td>
                        ${
                          idcheck != 0 &&
                          build.length != 0 &&
                          build[0].username == req.cookies['username']
                            ? `<td><a href="/component-insert/vga?build=${
                                req.query['build']
                              }&id=${e.id}" class="select-button ">Add</a></td>`
                            : ''
                        }
                        </tr>
                    `;
      });
    } catch (e) {}
  } else if (req.path == '/component-select/ram') {
    try {
      count = (
        await client.query(
          `select count(id) from "RAMs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or mem_type_id ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''}`
        )
      ).rows[0].count;
      data = (
        await client.query(
          `select * from "RAMs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or mem_type_id ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''} order by price asc limit 20 offset $1`,
          [(page - 1) * 20]
        )
      ).rows;
      rowheader = `<tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th></th>
                                        <th>Price</th>
                                        <th>Capacity</th>
                                        <th>Type</th>
                                        <th>Color</th>                  
                                    `;

      data.forEach((e) => {
        rowsdata += `<tr>
                        <td><img width=100 height=100 src="${e.image}"></td>
                        <td>${e.name}</td>
                        <td><a href="${e.link}">link</td>
                        <td>${money.format(e.price)}</td>
                        <td>${e.capacity} GB</td>
                        <td>${e.mem_type_id}</td>
                        <td>${e.color}</td>
                        ${
                          idcheck != 0 &&
                          build.length != 0 &&
                          build[0].username == req.cookies['username']
                            ? `<td><a href="/component-insert/ram?build=${
                                req.query['build']
                              }&id=${e.id}" class="select-button ">Add</a></td>`
                            : ''
                        }
                        </tr>
                    `;
      });
    } catch (e) {}
  } else if (req.path == '/component-select/storage') {
    try {
      count = (
        await client.query(
          `select count(id) from "STORAGEs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''}`
        )
      ).rows[0].count;
      data = (
        await client.query(
          `select * from "STORAGEs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''} order by price asc limit 20 offset $1`,
          [(page - 1) * 20]
        )
      ).rows;
      rowheader = `<tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th></th>
                                        <th>Price</th>
                                        <th>Capacity</th>
                                        <th>Size</th>
                                        <th>Type</th>                  
                                    `;

      data.forEach((e) => {
        rowsdata += `<tr>
                        <td><img width=100 height=100 src="${e.image}"></td>
                        <td>${e.name}</td>
                        <td><a href="${e.link}">link</td>
                        <td>${money.format(e.price)}</td>
                        <td>${e.capacity} GB</td>
                        <td>${e.form_fact}</td>
                        <td>${e.type}</td>
                        ${
                          idcheck != 0 &&
                          build.length != 0 &&
                          build[0].username == req.cookies['username']
                            ? `<td><a href="/component-insert/storage?build=${
                                req.query['build']
                              }&id=${e.id}" class="select-button ">Add</a></td>`
                            : ''
                        }
                        </tr>
                    `;
      });
    } catch (e) {}
  } else if (req.path == '/component-select/psu') {
    try {
      count = (
        await client.query(
          `select count(id) from "PSUs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(wattage::varchar(10),' ')) or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''}`
        )
      ).rows[0].count;
      data = (
        await client.query(
          `select * from "PSUs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(wattage::varchar(10),' ')) or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''} order by price asc limit 20 offset $1`,
          [(page - 1) * 20]
        )
      ).rows;
      rowheader = `<tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th></th>
                                        <th>Price</th>
                                        <th>Wattage</th>
                                        <th>Efficiency</th>
                                        <th>Form Factor</th>
                                        <th>Modular</th>
                                        <th>Length</th>
                                        <th>Color</th>               
                                    `;

      data.forEach((e) => {
        rowsdata += `<tr>
                        <td><img width=100 height=100 src="${e.image}"></td>
                        <td>${e.name}</td>
                        <td><a href="${e.link}">link</td>
                        <td>${money.format(e.price)}</td>
                        <td>${e.wattage} W</td>
                        <td>${e.efficiency}</td>
                        <td>${e.form_factor_id}</td>
                        <td>${e.modular ? 'Yes' : 'No'}</td>
                        <td>${e.length}</td>
                        <td>${e.color}</td>
                        ${
                          idcheck != 0 &&
                          build.length != 0 &&
                          build[0].username == req.cookies['username']
                            ? `<td><a href="/component-insert/psu?build=${
                                req.query['build']
                              }&id=${e.id}" class="select-button ">Add</a></td>`
                            : ''
                        }
                        </tr>
                    `;
      });
    } catch (e) {}
  } else if (req.path == '/component-select/cooler') {
    try {
      count = (
        await client.query(
          `select count(id) from "COOLERs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''}`
        )
      ).rows[0].count;
      data = (
        await client.query(
          `select * from "COOLERs" join (select cooler_id, string_agg("socket_id", ', ') as socket from "COOLER_SOCKETS" group by "cooler_id") on "COOLERs".id = "cooler_id" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          } ${id != '' ? `WHERE id = ${id}` : ''} order by price asc limit 20 offset $1`,
          [(page - 1) * 20]
        )
      ).rows;
      rowheader = `<tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th></th>
                                        <th>Price</th>
                                        <th>Fan Speed</th>
                                        <th>Noise Level</th>
                                        <th>Socket Support</th>
                                        <th>Height</th>
                                        <th>Color</th>               
                                    `;

      data.forEach((e) => {
        const socket_list = e.socket.split(', ');
        let socket_list_html = '<ul>';
        socket_list.forEach((e) => {
          socket_list_html += `<li>${e}</li>`;
        });
        socket_list_html += '</ul>';

        rowsdata += `<tr>
                        <td><img width=100 height=100 src="${e.image}"></td>
                        <td>${e.name}</td>
                        <td><a href="${e.link}">link</td>
                        <td>${money.format(e.price)}</td>
                        <td>${e.fan_rpm}</td>
                        <td>${e.noise_level}</td>
                        <td>${socket_list_html}</td>
                        <td>${e.height}</td>
                        <td>${e.color}</td>
                        ${
                          idcheck != 0 &&
                          build.length != 0 &&
                          build[0].username == req.cookies['username']
                            ? `<td><a href="/component-insert/cooler?build=${
                                req.query['build']
                              }&id=${e.id}" class="select-button ">Add</a></td>`
                            : ''
                        }
                        </tr>
                    `;
      });
    } catch (e) {}
  } else if (req.path == '/component-select/case') {
    try {
      count = (
        await client.query(
          `select count(id) from "CASEs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or form_factor_id ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          }
            ${id != '' ? `WHERE id = ${id}` : ''}`
        )
      ).rows[0].count;
      data = (
        await client.query(
          `select * from "CASEs" ${
            filter != ''
              ? `WHERE '${filter}' % ANY(STRING_TO_ARRAY(name,' ')) or name ilike '%${filter}%' or form_factor_id ilike '%${filter}%' or '${filter}' % ANY(STRING_TO_ARRAY(price::varchar(10),' '))`
              : ''
          } ${id != '' ? `WHERE id = ${id}` : ''} order by price asc limit 20 offset $1`,
          [(page - 1) * 20]
        )
      ).rows;
      rowheader = `<tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th></th>
                                        <th>Price</th>
                                        <th>Side Panel</th>
                                        <th>Dimension</th>
                                        <th>Form Factor</th>
                                        <th>Max VGA Length</th>
                                        <th>3.5" Sata Slots</th>
                                        <th>2.5" Sata Slots</th>
                                        <th>Color</th>         
                                    `;

      data.forEach((e) => {
        rowsdata += `<tr>
                        <td><img width=100 height=100 src="${e.image}"></td>
                        <td>${e.name}</td>
                        <td><a href="${e.link}">link</td>
                        <td>${money.format(e.price)}</td>
                        <td>${e.side}</td>
                        <td>${e.dimension}</td>
                        <td>${e.form_factor_id}</td>
                        <td>${e.max_vga_len}</td>
                        <td>${e.sata_slots_3}</td>
                        <td>${e.sata_slots_2}</td>
                        <td>${e.color}</td>
                        ${idcheck != 0 && build.length != 0 && build[0].username == req.cookies['username'] ? `<td><a href="/component-insert/case?build=${req.query['build']}&id=${e.id}"class="select-button ">Add</a></td>` : ''}
                        </tr>
                    `;
      });
    } catch (e) {}
  }

  if (Math.ceil(count / 20) >= 7) {
    if (page <= 4) {
      paging = `<a class="paging" href="${
        req.path + '?page=1'
      }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
        page == 1 ? "style='background: #1c3856'" : ''
      }>1</a>
                        <a class="paging"  href="${
                          req.path + '?page=2'
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
                          page == 2 ? "style='background: #1c3856'" : ''
                        }>2</a>
                        <a class="paging"  href="${
                          req.path + '?page=3'
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
                          page == 3 ? "style='background: #1c3856'" : ''
                        }>3</a>
                        <a class="paging"  href="${
                          req.path + '?page=4'
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
                          page == 4 ? "style='background: #1c3856'" : ''
                        }>4</a>
                        <a class="paging"  href="${
                          req.path + '?page=5'
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
                          page == 5 ? "style='background: #1c3856'" : ''
                        }>5</a>
                        <a class="paging"  href="${
                          req.path + '?page=6'
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
                          page == 6 ? "style='background: #1c3856'" : ''
                        }>6</a>
                        <a class="paging"  href="${
                          req.path + '?page=7'
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
                          page == 7 ? "style='background: #1c3856'" : ''
                        }>7</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + Math.ceil(count / 20)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}">>></a>`;
    } else if (page > 4 && page < Math.ceil(count / 20) - 4) {
      paging = `<a class="paging"  href="${req.path + '?page=1'}"><<</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + (page - 3)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}">${
                          page - 3
                        }</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + (page - 2)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}">${
                          page - 2
                        }</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + (page - 1)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}">${
                          page - 1
                        }</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + page
                        }" style='background: #1c3856'>${page}</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + (page + 1)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}">${
                          page + 1
                        }</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + (page + 2)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}">${
                          page + 2
                        }</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + (page + 3)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}">${
                          page + 3
                        }</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + Math.ceil(count / 20)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}">>></a>`;
    } else {
      paging = `<a class="paging"  href="${
        req.path + '?page=1'
      }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}"><<</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + (Math.ceil(count / 20) - 6)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
                          page == Math.ceil(count / 20) - 6
                            ? "style='background: #1c3856'"
                            : ''
                        }>${Math.ceil(count / 20) - 6}</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + (Math.ceil(count / 20) - 5)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
                          page == Math.ceil(count / 20) - 5
                            ? "style='background: #1c3856'"
                            : ''
                        }>${Math.ceil(count / 20) - 5}</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + (Math.ceil(count / 20) - 4)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
                          page == Math.ceil(count / 20) - 4
                            ? "style='background: #1c3856'"
                            : ''
                        }>${Math.ceil(count / 20) - 4}</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + (Math.ceil(count / 20) - 3)
                        }" ${
                          page == Math.ceil(count / 20) - 3
                            ? "style='background: #1c3856'"
                            : ''
                        }>${Math.ceil(count / 20) - 3}</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + (Math.ceil(count / 20) - 2)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
                          page == Math.ceil(count / 20) - 2
                            ? "style='background: #1c3856'"
                            : ''
                        }>${Math.ceil(count / 20) - 2}</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + (Math.ceil(count / 20) - 1)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
                          page == Math.ceil(count / 20) - 1
                            ? "style='background: #1c3856'"
                            : ''
                        }>${Math.ceil(count / 20) - 1}</a>
                        <a class="paging"  href="${
                          req.path + '?page=' + Math.ceil(count / 20)
                        }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
                          page == Math.ceil(count / 20)
                            ? "style='background: #1c3856'"
                            : ''
                        }>${Math.ceil(count / 20)}</a>`;
    }
  } else {
    for (var i = 1; i <= Math.ceil(count / 20); i++) {
      paging += `<a class="paging" href="${
        req.path + '?page=' + i
      }&filter=${filter}${req.query['build'] == undefined ? `` : `&build=${req.query['build']}`}" ${
        page == i ? "style='background: #1c3856'" : ''
      }>${i}</a>`;
    }
  }

  if (
    idcheck != 0 &&
    build.length != 0 &&
    build[0].username == req.cookies['username']
  )
    rowheader += `<th>select</th></tr>`;

  res.send(`
            <!DOCTYPE html>
            <html>
    
            <head>
                <meta charset='utf-8'>
    
                <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
                <meta property="og:title" content="Trang build PC số 1 Việt Nam"/>
                <meta property="og:image" content="https://server.yurixahri.net/Photos/koishi.png"/>
                
                <meta property="og:url" content="${req.path}"/>
                <meta property="og:site_name" content="Koishi Build PC"/>
                <meta property="og:description" content="Trang build PC số 1 Việt Nam">
                <meta property="og:type" content="website"/>
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:title" content="Trang build PC số 1 Việt Nam"/>
                <meta name="twitter:description" content="Trang build PC số 1 Việt Nam">
                <meta name="twitter:image" content="https://server.yurixahri.net/Photos/koishi.png"/>

                <title>Chọn linh kiện</title>

                
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

                    table ul li {
                        list-style: disc;    
                        padding: 10px;
                        font-size: 12px;
                        border-left: none;
                        white-space: nowrap;
                    }

                    table ul{
                        columns: 2;
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
        
                    .dropdown a,
                    .left_cell a {
                        height: 100%;
                        display: flex;
                        align-items: center;
                    }
        
                    .dropdown:hover>ul {
                        visibility: visible;
                        opacity: 1;
                        display: block;
        
                        text-align: left;
        
                    }
        
                    .select-button {
                        padding: 5px 10px;
                        border-radius: 5px;
                        margin-left: 20px;
                        background-color: #1c86d1;
                        color: aliceblue;
                    }
        
                    .select-container {
                        border-bottom: 1px aliceblue dashed;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
        
                    .paging {
                        padding: 4px 10px;
                        border-radius: 5px;
                        margin-left: 10px;
                        margin-right: 10px;
                        background-color: #1c86d1;
                    }
        
        
                    table {
                        font-family: arial, sans-serif;
                        border-collapse: collapse;
                        width: 100%;
                    }

                    table a{
                        color: #00adff
                    }
        
                    td,
                    th {
                        border-bottom: 1px aliceblue dashed;
                        text-align: center;
                        padding: 8px;
                    }
        
                    tr:nth-child(even) {
                        background-color: #00477345;
                    }
        
        
        
                    a {
                        text-decoration: none;
                        color: aliceblue;
                        cursor: pointer;
                    }
        
                    #nav a:hover {
                        color: rgb(0, 136, 255);
                    }
        
                    .left_cell {
                        margin: 0 10px 0 10px;
                        height: 100px;
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
<div id="nav"
                    style="height: 100px; display: flex; background-color: rgb(26, 53, 66); justify-content: space-between">
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
    
               
    
                <div
                    style="margin: 50px auto 50px auto; width: 80%;height: fit-content;top: 0;bottom: 0; display: flex; flex-direction: column; color: aliceblue; padding-bottom: 200px;">
                    <form action="${req.path}" method="get">
                        <input type="text" name="filter" placeholder="filter" value="${filter}"></input>
                        ${req.query['build'] == undefined ? '' : `<input name="build" value="${req.query['build']}" style="display: none"></input>`}
                        <button>Search</button>
                    </form>
                    <table>
                        ${rowheader}
                        ${rowsdata}
                    </table>
    
                    <div style="margin-top: 20px;">
                        ${paging}
                    </div>
                </div>
            </body>
            <script type="text/javascript" src="https://yurixahri.net:83/assets/noel.js"></script>
            </html>
            `);
}

export { deleteComponent, insertComponent, selectComponent };
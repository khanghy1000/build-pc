import { client } from '../db.js';
import { money } from '../utils.js';

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

  res.render('views/component', {
    idcheck: idcheck,
    username: req.cookies['username'],
    build: req.query.build,
    path: req.path,
    filter: filter,
    rowheader: rowheader,
    rowsdata: rowsdata,
    paging: paging,
  });
}

export { deleteComponent, insertComponent, selectComponent };

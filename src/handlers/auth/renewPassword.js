import { client } from "../../db.js";
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
    res.send(`
    <!DOCTYPE html>
    <html>
    
    <head>
        <meta charset='utf-8'>
    
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
        <meta property="og:title" content="Trang build PC số 1 Việt Nam"/>
        <meta property="og:image" content="https://server.yurixahri.net/Photos/koishi.png"/>
        
        <meta property="og:url" content="h/"/>
        <meta property="og:site_name" content="Koishi Build PC"/>
        <meta property="og:description" content="Trang build PC số 1 Việt Nam">
        <meta property="og:type" content="website"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="Trang build PC số 1 Việt Nam"/>
        <meta name="twitter:description" content="Trang build PC số 1 Việt Nam">
        <meta name="twitter:image" content="https://server.yurixahri.net/Photos/koishi.png"/>

        <title>Nhập lại mật khẩu</title>
        <link rel="shortcut icon" href="https://server.yurixahri.net/Photos/koishi.png">

        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
        <link rel="stylesheet" type="text/css" href="https://yurixahri.net:83/pcbuild-assets/font/fontello.css">
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
        

        <style>
            body{
            height: 100vh;
                margin: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: rgb(15, 27, 38);
            }

            a {
                text-decoration: none;
                color: rgb(116, 171, 220);
                cursor: pointer;
                font-size: small;
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
    <a href="/" style="padding: 10px; background-color: #1f4251; color: aliceblue;">Home</a>
        
    <div
        style="margin: auto;position: absolute;left: 0;right: 0;width: fit-content;height: fit-content;top: 0;bottom: 0; display: flex;  flex-direction: column; ">
        <h1 style="color: aliceblue;">Renew Password</h1>
        <form id="formDangKy" style="background-color: #193541; padding: 50px; border-radius: 5px;">


            <div style="display: flex; align-items: center; position: relative; margin-bottom: 20px;">
                <i class="icon-key" style="position: absolute; left: 0.5rem"></i>
                <input name="new_password" type="password" style="width: 100%; padding-left: 2.5rem; height: 1.5rem; border-radius: 5px;"
                    placeholder="Password" required />
            </div>
            <div style="display: flex; align-items: center; position: relative; margin-bottom: 20px;">
                <i class="icon-key" style="position: absolute; left: 0.5rem"></i>
                <input name="new_password_repeat" type="password" style="width: 100%; padding-left: 2.5rem; height: 1.5rem; border-radius: 5px;"
                    placeholder="Repeat Password" required />
            </div>
            
                <input name="token" style="display: none" value="${req.query.token}"/>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px;">
                <a href="/regiter.html">Chưa có tài khoản? Đăng ký ngay!</a>
            </div>
            <br><br>



            <div style="display: flex; align-items: center; justify-content: space-between;">
                <h6 style="width: 60%; color: aliceblue; font-weight: 400; margin: 0">Bằng cách sử dụng website này, bạn đã
                    đồng
                    ý với Điều kiện & Điều khoản cùng chính sách bảo mật của chúng tôi</h6>
                <button type="submit" style="
    width: 100px;
    height: 30px;
    border-radius: 25px;
    border: none;
            background: rgb(29 121 160);
            color: aliceblue;
    cursor: pointer;
    font-weight: 600;
  ">
                    Submit
                </button>
            </div>
        </form>
    </div>
</body>

<script>
    const popup = (text, color) => {
        Toastify({
            text: text,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", 
            position: "center", 
            stopOnFocus: true, 
            style: {
                background: color,
            },
            onClick: function () { } // Callback after click
        }).showToast();
    }


    const thisForm = document.querySelectorAll('#formDangKy');
    thisForm.forEach((el) => {

        el.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            var formData = new FormData(el).entries()
            formData = Object.fromEntries(formData)

            console.log(JSON.stringify(formData))

            const response = await fetch('/renew_password_submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.status

            if (result == 200) {
                popup("Thành công", "rgb(29 160 90)")
                window.location.href = "/login"
            } else if (result == 501) {
                popup("Giống mật khẩu cũ", "rgb(171 84 84)")
            } else if (result == 500) {
                popup("Mật khẩu không giống nhau", "rgb(171 84 84)")
            }else if (result == 502) {
                popup("Mật khẩu không dưới 8 ký tự", "rgb(171 84 84)")
            }else if (result == 503) {
                popup("Lỗi hệ thống", "rgb(171 84 84)")
            }
            

        });
    })
</script>
<script type="text/javascript" src="https://yurixahri.net:83/assets/noel.js"></script>
</html>
        
            `);
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

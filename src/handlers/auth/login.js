import { client } from "../../db.js";
import { sha256 } from 'js-sha256';

async function getLogin(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1 and password = $2`,
      [req.cookies['username'], req.cookies['password']]
    )
  ).rows[0].count;

  if (idcheck == 0) {
    res.send(`
<!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8'>

    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <meta property="og:title" content="Trang build PC số 1 Việt Nam"/>
    <meta property="og:image" content="https://server.yurixahri.net/Photos/koishi.png"/>
    
    <meta property="og:url" content="/"/>
    <meta property="og:site_name" content="Koishi Build PC"/>
    <meta property="og:description" content="Trang build PC số 1 Việt Nam">
    <meta property="og:type" content="website"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content="Trang build PC số 1 Việt Nam"/>
    <meta name="twitter:description" content="Trang build PC số 1 Việt Nam">
    <meta name="twitter:image" content="https://server.yurixahri.net/Photos/koishi.png"/>

    <title>Đăng nhập</title>
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
        <h1 style="color: aliceblue;">Login</h1>
        <form id="formDangKy" style="background-color: #193541; padding: 50px; border-radius: 5px;">


            <div style="display: flex; align-items: center; position: relative; margin-bottom: 20px;">
                <i class="icon-user" style="position: absolute; left: 0.5rem"></i>
                <input name="username" type="text" style="width: 100%; padding-left: 2.5rem; height: 1.5rem; border-radius: 5px;"
                    placeholder="Username" required />
            </div>
            
            <div style="
                display: flex;
                align-items: center;
                position: relative;
                
                ">
                <i class="icon-key" style="position: absolute; left: 0.5rem"></i>
                <input name="password" type="password" style="width: 100%; padding-left: 2.5rem; height: 1.5rem; border-radius: 5px;"
                    placeholder="Mật khẩu" required />
            </div>
            

            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px;">
                <a href="/register">Chưa có tài khoản? Đăng ký ngay!</a>
                <a href="/forgot_password">Quên mật khẩu?</a>
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
                    Đăng nhập
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
                boxShadow: "none"
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

            

            const response = await fetch('/submit_login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.status

            if (result == 200) {
                window.location.href = "/"
            } else {
                popup("Đăng nhập không thành công", "rgb(171 84 84)")
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

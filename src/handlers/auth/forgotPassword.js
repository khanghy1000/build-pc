import { client } from "../../db.js";
import { v4 as uuidv4 } from 'uuid';
import { transporter } from "../../email.js";

async function getForgotPassword(req, res) {
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

        <title>Quên mật khẩu</title>
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
        <h1 style="color: aliceblue;">Forgot Password</h1>
        <form id="formDangKy" style="background-color: #193541; padding: 50px; border-radius: 5px;">


            <div style="display: flex; align-items: center; position: relative; margin-bottom: 20px;">
                <i class="icon-id-card" style="position: absolute; left: 0.5rem"></i>
                <input name="username" type="text" style="width: 100%; padding-left: 2.5rem; height: 1.5rem; border-radius: 5px;"
                    placeholder="Username" required />
            </div>
            
            
            

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

            const response = await fetch('/forgot_submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.status

            if (result == 200) {
                popup("Đã gửi vào mail, hãy kiểm tra! (kiểm tra thư mục spam nếu không thấy)", "rgb(29 160 90)")
            } else {
                popup("Tài khoản không tồn tại", "rgb(171 84 84)")
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
      await transporter.sendMail({
        from: '"Yurixahri BOT" <no-reply@yurixahri.net>', // sender address
        to: user.email, // list of receivers
        subject: 'Quên mật khẩu Pcbuilder', // Subject line
        text: '', // plain text body
        html: `
                <p>Nhấn vào đường dẫn để thay đổi mật khẩu</p>
                <a href="/renew_password?token=${token}">Link</a>
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

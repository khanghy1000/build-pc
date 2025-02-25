import { client } from "../db.js";

async function getGuide(req, res) {
  const idcheck = (
    await client.query(
      `select count(username) from "USERS" where username = $1 and password = $2`,
      [req.cookies['username'], req.cookies['password']]
    )
  ).rows[0].count;

  res.send(`
  <!DOCTYPE html>
  <html>
  
  <head>
      <meta charset='utf-8'>
  
      <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
      <meta property="og:title" content="Trang build PC số 1 Việt Nam"/>
      <meta property="og:image" content="https://server.yurixahri.net/Photos/koishi.png"/>
      
      <meta property="og:url" content="/guide"/>
      <meta property="og:site_name" content="Koishi Build PC"/>
      <meta property="og:description" content="Trang build PC số 1 Việt Nam">
      <meta property="og:type" content="website"/>
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content="Trang build PC số 1 Việt Nam"/>
      <meta name="twitter:description" content="Trang build PC số 1 Việt Nam">
      <meta name="twitter:image" content="https://server.yurixahri.net/Photos/koishi.png"/>
  
      <title>PC Builder Guide</title>

      
      <link rel="shortcut icon" href="https://server.yurixahri.net/Photos/koishi.png">
      <style>
        body{
            height: 100vh;
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-image: linear-gradient(to bottom, rgb(15 27 38 / 93%), rgb(15 27 38 / 96%)), url(https://server.yurixahri.net/Photos/bgpcbuild.png);
            overflow-x: hidden;
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
    
      
        p{
            padding: 10px;
            border-radius: 5px;
            background-color: aliceblue;
            color: black;
        }
        
        img{
            border-radius: 5px;
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
      <div style="margin: 100px auto auto auto; width: 70%;height: fit-content;top: 0;bottom: 0; display: flex; flex-direction: column; color: aliceblue; padding-bottom: 200px;">
          <h1 style="text-align: center;">HƯỚNG DẪN SỬ DỤNG TRANG CHỌN PHẦN CỨNG PC</h1>
            <h2>Giao diện tạo build</h2>
            <p>Sau khi nhấn nút "Build" hay "Create" thì bạn sẽ được dẫn tới giao diện bên dưới và một build mới sẽ được khởi tạo trong CSDL.</p>    
            <img src="https://yurixahri.net:83/assets/Images/hd1.png" alt="tạo build">
            <p>Sau khi tạo ra build mới thì bạn phải đặt tên cho nó: Nhấn vào phần “Nhập tên build” sau đó tiến hành đặt tên cho build của mình rồi nhấn ENTER.</p>
            <p>Chúng bạn cần thêm những mô tả vào build và sự đóng góp này sẽ được đưa vào cải thiện hệ thống thông minh: Bắt đầu nhập mô tả về build của mình, mỗi build có thể có nhiều mô tả, sau mỗi mô tả nhấn ENTER để đóng mô tả đó lại và bắt đàu mô tả tiếp theo, sau khi đã mô tả hết build của mình nhấn Submit để đưa mô tả lên hệ thống.</p>
            <img src="https://yurixahri.net:83/assets/Images/hd2.png" alt="nhập mô tả">

            <br><br>
            <h2>Giao diện thêm linh kiện</h2>
            <p>Để thêm linh kiện vào một build: Nhấn vào nút Select ở một danh mục để thêm sản phẩm cho danh mục đó. Link sẽ dẫn đến trang chọn linh kiện của loại sản phẩm đó.</p>
            <img src="https://yurixahri.net:83/assets/Images/hd3.png" alt="chọn">
            <p>Trong giao diện này bạn có thể tìm được sản linh kiện theo tên và những thông số khác của linh kiện đó theo bản chất của linh kiện. Sau đó nhấn “Add” để thêm linh kiện vào build</p>
            <p>Đối với mục sản phẩm “Memory (RAM)” và “Storage” bạn có thể chọn nhiều lựa chọn khác nhau và thay đổi số lượng của nó trong một build. Ngoài ra còn có thể bấm dấu <span style="color: red;">X</span> để xóa những lựa chọn sai (vì có nhiều loại linh kiện nên không thể thay thế như những loại linh kiện khác).</p>
            <img src="https://yurixahri.net:83/assets/Images/hd4.png" alt="ram và ổ cứng">
            <p>Tổng giá tiền của build này và công suất tối thiểu cho nguồn tối thiểu cho build.</p>
            <img src="https://yurixahri.net:83/assets/Images/hd5.png" alt="tổng bill và đề xuất nguồn">
            <p>Bạn có thể lựa chọn trạng thái của build qua dropbox ở phía dưới bên trái trang Web, hay xóa build ra khỏi hệ thống.</p>
            <img src="https://yurixahri.net:83/assets/Images/hd6.png" alt="chế độ xem và xóa build">

            <br><br>
            <h2>Xem build của bản thân (Công khai-riêng tư)</h2>
            <div style="display: flex; align-items: center">
                <img src="https://yurixahri.net:83/assets/Images/hd7.png" alt="người dùng">
                <p>Khi di chuột qua tên người dùng của bạn ở góc trên cùng bên phải của trang bạn sẽ thấy những lựa chọn như sau hiện lên, chọn ‘My Builds’ để xem những build thuộc sở hữu của người dùng đang được đăng nhập vào web, chọn ‘Logout’ để đăng xuất.</p>
            </div>
            <p>Sau khi nhấn vào “My Builds” hệ thống sẽ liệt kê các build mà người dùng đang đăng nhập sở hữu từ những build Công khai tới những build Riêng tư.</p>
            <img src="https://yurixahri.net:83/assets/Images/hd8.png" alt="build của bạn">
            <p>Nút "BUILDS" trên thanh công cụ sẽ dẫn bạn đến danh sách các build mà người dùng trên hệ thông đã tạo và được cài đặt ở chế độ công khai. Ngoài ra bạn cũng có thể tìm kiếm build theo nhu cầu và thêm build vào tài khoản của mình để tiếp tục chỉnh sửa build đó thông qua nút "Add to your build".</p>
            <img src="https://yurixahri.net:83/assets/Images/hd9.png" alt="build công khai">

            <br><br>
            <h2>Một số lưu ý khi build PC</h2>
            <p>Khi xây dựng phần cứng máy tính hãy kiểm tra xem các linh kiện có phù hợp không. Sau đây là một vài danh sách các yêu cầu khi build PC:
                <br>- Mainboard và CPU phải cùng Socket với nhau.
                <br>- Mainboard và Ram phải cùng loại DDR với nhau.
                <br>- Tổng dung lượng Ram không được quá dung lượng cho phép của CPU hay Mainboard.
                <br>- Số lượng các thanh Ram không nên vượt quá số lượng khe cắm trên Mainboard.
                <br>- Số lượng các ổ cứng không nên vượt quá số lượng khe cắm trên Mainboard.
                <br>- Số lượng các ổ cứng không nên vượt quá số chỗ lắp trên thùng máy.
                <br>- Kích thước Mainboard, thùng máy, nguồn nên cùng loại để dễ dàng lắp máy hơn.
                <br>- Kích thước VGA nên nhỏ hơn hoặc bằng kích thước mà thùng máy hỗ trợ.
            </p>
            <p>Khi bạn thêm các linh kiện bị xung đột hay không tương thích, hệ thống sẽ thông báo cho bạn biết bên phải màn hình. Màu <span style="color: red;">đỏ</span> tương ứng với lỗi nghiêm trọng - máy sẽ không hoạt động, màu <span style="color: rgb(199, 173, 26);">vàng</span> tương ứng với những lưu ý nhỏ - nên tránh để tiết kiệm được tiền và dễ dàng build hơn.</p>
            <img src="https://yurixahri.net:83/assets/Images/hd10.png" alt="lưu ý">

            <br><br>
            <h2 style="text-align: center;">Và đó là toàn bộ những gì bạn cần biết để sử dụng trang này. Chúc các bạn xây dựng được bộ PC như ý muốn!</h2>
      </div>
  </body>
  <script type="text/javascript" src="https://yurixahri.net:83/assets/noel.js"></script>
  
  </html>    
      `);
}

export { getGuide };

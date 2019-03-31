var express = require("express");
var app = express();

// Router
var indexRouter = require('./routes/index');

app.use('/',indexRouter);
app.use(express.static("./public"));
app.set("view engine","ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var ip = require('ip');
const PORT = 3000;
server.listen(PORT);
console.log("Server nodejs chay tai dia chi: " + ip.address() + ":" + PORT);

//Khi có mệt kết nối được tạo giữa Socket Client và Socket Server
io.on('connection', function(socket) {	
	var led = [true, false] //định nghĩa một mảng 1 chiều có 2 phần tử: true, false. Mảng này sẽ được gửi đi nhằm thay đổi sự sáng tắt của 2 con đèn LED đỏ và xanh. Dựa vào cài đặt ở Arduino mà đèn LEd sẽ bị bật hoặc tắt. Hãy thử tăng hoạt giảm số lượng biến của mảng led này xem. Và bạn sẽ hiểu điều kỳ diệu của JSON!
	//Tạo một chu kỳ nhiệm vụ sẽ chạy lại sau mỗi 200ms
	var interval1 = setInterval(function() {
		for (var i = 0; i < led.length; i++) {
			led[i] = !led[i]
		}
		
		//Cài đặt chuỗi JSON, tên biến JSON này là json 
		var json = {
			"led": led, //có một phần tử là "led", phần tử này chứa giá trị của mảng led.
			// "content": "hello"
		}
		// socket.emit('LED', json) //Gửi lệnh LED với các tham số của của chuỗi JSON
		socket.on("client-send-data",function(dulieu){
            // console.log(dulieu); //Du lieu nay la thong so cam bien
            socket.broadcast.emit("Server-send-data", dulieu);
        });
		// console.log("send LED")//Ghi ra console.log là đã gửi lệnh LED
	}, 2000)//200ms
	
	//Khi socket client bị mất kết nối thì chạy hàm sau.
	socket.on('disconnect', function() {
		console.log("Client Disconnect" + socket.id) ;	//in ra màn hình console cho vui
		clearInterval(interval1);		//xóa chu kỳ nhiệm vụ đi, chứ không xóa là cái task kia cứ chạy mãi thôi đó!
    });
    
    // Connect with Website
    console.log("Client Connect: " + socket.id);
    // socket.on("client-send-data",function(data){
    //     console.log(data);
    // });
    // socket.emit("Server-send-data",{ hello: 'world' });
});

module.exports = app;
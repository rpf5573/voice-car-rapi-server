const express = require('express'),
		http = require('http'),
		// ws = require('ws'),
		serial_port = require('serialport'),
		body_parser = require('body-parser');

// ttyUSB0
const serial = new serial_port('/dev/ttyUSB0', {
	baudRate : 115200
});

let currentMovingMotorInfo = {
	motor: 0,
	direction: ''
};
let timerForStop = false;

// pigpio
// const Gpio = require('pigpio').Gpio;
// const LOW = 0;
// const HIGH = 1;
// const L298N = require('./motor/l298n.js');
//bcm code
// L298n 모터 드라이버와 라즈베리파이를 연결한 배선대로 핀넘버를 설정
// let l298n = new L298N(17,27,22,null,null,null);

const app = express();
app.use(body_parser.json());

const server = http.createServer();

// app.get('/smog/:onoff', function(req, res) {
// 	var onoff = req.params.onoff;
// 	if ( onoff == 'on' ) {
// 		l298n.forward();
// 	} else {
// 		l298n.stop();
// 	}
// });

app.get('/bottom/:direction', function(req, res) {
	// stop / forward / backward
	const dir = req.params.direction;
	serial.write("bottom,"+dir, function(err) {});
	return res.sendStatus(201);
});

app.get('/arm/stop', function(req, res) {
	serial.write("arm,stop", function(err) {});
	return res.sendStatus(201);
});

app.get('/:motor_number/:direction/', function(req, res) {
	const motor = req.params.motor_number;
	const dir = req.params.direction;
	
	serial.write(motor + "," + dir, function(err) {
		if (!err && dir != 'stop') { stopForSafty(motor, dir); }
	});
	//sockets.clients.forEach(function (conn) {
	//      conn.send("3," + motor + "," + dir +  "," + speed);
	//});

	return res.sendStatus(201);
});

app.get('/:motor_number/:direction/:speed/', function(req, res) {
	const motor = req.params.motor_number;
	const dir = req.params.direction;
	const speed = req.params.speed;
	
	serial.write(motor + "," + dir + "," + speed, function(err) {
		if (!err && dir != 'stop') { stopForSafty(motor, dir); }
	});
	//sockets.clients.forEach(function (conn) {
	//      conn.send("3," + motor + "," + dir +  "," + speed);
	//});

	return res.sendStatus(201);
});

app.get('/', function(req, res) {
	res.sendStatus('201');
});

server.on('request', app);
server.listen(8080, function() {
  console.log("Server Start.");
});

function stopForSafty(motor, dir) {
	if ( motor == 'motor-2' || motor == 'motor-5' || motor == 'motor-6' ) {
		if ( motor == currentMovingMotorInfo.motor && dir != currentMovingMotorInfo.direction && timerForStop ) {
			clearTimeout(timerForStop);
		}
		let stopTime = 1500;
		if ( motor == 'motor-2' ) {
			stopTime = 8000;
		}
		else if (motor == 'motor-5') {
			stopTime = 5000;
		}
		else if (motor == 'motor-6') {
			stopTime = 3000;
		}
		timerForStop = setTimeout(()=>{
			serial.write(motor + ",stop");
		}, stopTime);
		
		currentMovingMotorInfo.motor = motor;
		currentMovingMotorInfo.direction = dir;
	}
}
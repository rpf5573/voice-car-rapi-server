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

const app = express();
app.use(body_parser.json());

const server = http.createServer();

var globalTimer = {
  // 손
  10: false,
  11: false,
  12: false,
  
  // 팔
  20: false,
  21: false,
  22: false,
  23: false,
  24: false,

  // 몸체
  30: false,
  31: false,
  32: false,

  // 다리
  40: false,
  41: false,
  42: false,
  43: false,
  44: false,
  45: false,
}

app.get('/:code/:speed', (req, res) => {
	const code = req.params.code;
	let speed = req.params.speed;
	if ( ! code || ! speed ) {
		return res.tatus(201).json({error: "명령어 와 속도값이 없습니다"});
	}
	speed = modifySpeed(code, speed);
	const command = `${code}${speed}`;
	serial.write(command, function(err) {
		if ( err ) {
			console.error(err); 
		} else {
			// stop 명령은 10, 20, 30, 40 ... 이런식이다.
			let isStopCode = (code%10 == 0) ? true : false;
			let partCode = Math.floor(code/10);
			if ( ! isStopCode && (partCode == 1 || partCode == 2) ) {
				stopForSafty(code);
			}
		}
	});
	return res.sendStatus(201);
});

function stopForSafty(code) {
	// 이렇게 멈추는게 맞기는 한데,,, 만약에 3초안에 같은 모터 동작 명령이 들어오면,,,갑자기 멈출 수는 없잖아!!!
	if ( globalTimer[code] ) {
		clearTimeout(globalTimer[code]);
	}

	globalTimer[code] = setTimeout(() => {
		let stopCode = `${Math.floor(code/10) * 10}00`;
		console.log('stopForSafty', stopCode);
		try {
			serial.write(stopCode, (err) => {
				console.log('err', err);
				globalTimer[code] = false;
			});
		} catch(e) {
			console.log(e);
			globalTimer[code] = false;
		}
	}, 6000);
}

function modifySpeed(code, speed) {
	if ( speed == 100 ) {
		speed = 99;
	}
	let partCode = Math.floor(code/10);
	// 손이나 팔쪽에는 모터속도의 100%를 내면 고장난다!
	if ( partCode == 1 || partCode == 2 || partCode == 3 ) {
		speed = speed * 0.7;
	}
	return Math.floor(speed);
}

server.on('request', app);
server.listen(8080, function() {
  console.log("Server Start.");
});
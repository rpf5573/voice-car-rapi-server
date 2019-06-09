var express = require('express'),
		http = require('http'),
		// ws = require('ws'),
		serial_port = require('serialport'),
		body_parser = require('body-parser');

var serial = new serial_port('/dev/ttyUSB0', {
	baudRate : 115200
});

var app = express();
app.use(body_parser.json());

var server = http.createServer();
// var sockets = new ws.Server({
// 	server: server
// });

// var messages = [];

app.get('/bottom/:direction', function(req, res) {
	// stop / forward / backward
	var dir = req.params.direction;
	serial.write("bottom,"+dir, function(err) {});
	return res.send("ok");
});

app.get('/arm/stop', function(req, res) {
	serial.write("arm,stop", function(err) {});
});

app.get('/:motor_number/:direction/', function(req, res) {
	var motor = req.params.motor_number;
	var dir = req.params.direction;
	
	serial.write(motor + "," + dir, function(err) {});
	//sockets.clients.forEach(function (conn) {
	//      conn.send("3," + motor + "," + dir +  "," + speed);
	//});

	res.send("");
});

app.get('/:motor_number/:direction/:speed/', function(req, res) {
	var motor = req.params.motor_number;
	var dir = req.params.direction;
	var speed = req.params.speed;
	
	serial.write(motor + "," + dir + "," + speed, function(err) {});
	//sockets.clients.forEach(function (conn) {
	//      conn.send("3," + motor + "," + dir +  "," + speed);
	//});

	res.send("");
});

server.on('request', app);
server.listen(8080, function() {
  console.log("Server Start.");
});
// l298n.js
const PinPWM = require('./PinPWM.js');
const PinWrite = require('./PinWrite.js');

exports.NO1 = 0; // 1번 모터
exports.NO2 = 1; // 2번 모터
exports.FORWORD = 1;
exports.BACKWORD = -1;
let deviceList = []; // 끽해야 2개 들어간다
//bcm code
function initDevice(dNum,en,in1,in2) {
    deviceList[dNum] = {
        en:en, // enable A/B
        in1:in1, // 방향조절하는 in1
        in2:in2,
        enGpio : new PinPWM(en),
        in1Gpio : new PinWrite(in1),
        in2Gpio : new PinWrite(in2),
    };
}

function enPort(dNum) {
    return deviceList[dNum].enGpio;
}

function in1Port(dNum) {
    return deviceList[dNum].in1Gpio;
}

function in2Port(dNum) {
    return deviceList[dNum].in2Gpio;
}

function L298N(enableA,in1,in2,enableB,in3,in4) {
    if (enableA !== null) {
        initDevice(this.NO1,enableA,in1,in2);
    }
    if (enableB !== null) {
        initDevice(this.NO2,enableB,in3,in4);
    }
}
Object.assign(L298N.prototype, {
    // PWM으로 속도 조절
    setSpeed : function(dNum, speed) {
        enPort(dNum).setSpeedPercent(speed);
    },

    // 앞으로 가는건 in1 => 1 / in2 => 0
    forward : function(dNum) {
        in1Port(dNum).HIGH();
        in2Port(dNum).LOW();
    },

    // 뒤로 가는건 in1 => 0 / in2 => 1
    backward : function(dNum) {
        in1Port(dNum).LOW();
        in2Port(dNum).HIGH();
    },

    // 멈추는건 in1 => 0 / in2 => 0
    stop : function(dNum) {
        in1Port(dNum).LOW();
        in2Port(dNum).LOW();
    },
    PinPWM : PinPWM,
    PinWrite : PinWrite,
});
module.exports = L298N;
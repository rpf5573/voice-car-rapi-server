const Gpio = require('pigpio').Gpio;

const LOW = 0;
const HIGH = 1;

// 여기 pin이 바로 L298n의 in1, in2로 연결되는 gpio pin이다.
// 다시말해서 이 pin으로 HIGH나 LOW가 보내지게 되고, 모터의 회전 방향이 결정된다.
function PinWrite(pin) {
    this.pin = pin;
    this.gpio = new Gpio(pin, {mode: Gpio.OUTPUT});
}

Object.assign(PinWrite.prototype, {
    HIGH : function () {
        this.gpio.digitalWrite(HIGH);
    },
    LOW : function () {
        this.gpio.digitalWrite(LOW);
    },
    value : function () {
        return this.gpio.digitalRead();
    },
});
module.exports = PinWrite;
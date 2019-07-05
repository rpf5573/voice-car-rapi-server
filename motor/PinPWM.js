const Gpio = require('pigpio').Gpio;

// Duty Cycle의 최소~최대 범위이다.
const MIN = 0;
const MAX = 255;

// 이 pin은 L298n의 Enable A,B에 연결될 gpio pin이다.
function PinPWM(pin) {
    this.pin = pin;
    this.gpio = new Gpio(pin, {mode: Gpio.OUTPUT});
}
Object.assign(PinPWM.prototype, {
    setSpeedPercent : function (p) {
        if (p < 0 || p > 100) {
            console.log("Arg out of range(0-100%).");
            return;
        }
        let dutyCycle = (MAX - MIN) * p / 100 + MIN;

        // 위에서 설정한 dutyCycle에 맞춰서 Pulse Width를 생성한다. 이는 결국 0~5V사이의 전압을 뿜어낼것이다.
        // 다만, 이 전압가지고는 모터를 움직일 수 없기 때문에, 우리는 건전지를 따로 또 연결해준것이다.
        this.gpio.pwmWrite(parseInt(dutyCycle));
    }
});
module.exports = PinPWM;
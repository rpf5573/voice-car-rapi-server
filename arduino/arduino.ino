int motor_1_pwm = 3; //pin number
int motor_1_dir = 2;
int motor_2_pwm = 5;
int motor_2_dir = 4;
int motor_3_pwm = 6;
int motor_3_dir = 7;
int motor_4_pwm = 9;
int motor_4_dir = 8;
int motor_5_pwm = 10;
int motor_5_dir = 12;
int motor_6_pwm = 11;
int motor_6_dir = 13;

int motor_1_flag; //1 : forward, 2 : backward
int motor_2_flag;
int motor_3_flag;
int motor_4_flag;
int motor_5_flag; 
int motor_6_flag;

void setup() {
  pinMode(motor_1_pwm, OUTPUT);
  pinMode(motor_1_dir, OUTPUT);
  pinMode(motor_2_pwm, OUTPUT);
  pinMode(motor_2_dir, OUTPUT);
  pinMode(motor_3_pwm, OUTPUT);
  pinMode(motor_3_dir, OUTPUT);
  pinMode(motor_4_pwm, OUTPUT);
  pinMode(motor_4_dir, OUTPUT);
  pinMode(motor_5_pwm, OUTPUT);
  pinMode(motor_5_dir, OUTPUT);
  pinMode(motor_6_pwm, OUTPUT);
  pinMode(motor_6_dir, OUTPUT);
  
  Serial.begin(115200);
}

void loop() {
  String str_cmd = "";

  while(Serial.available()) {
    char tmp_cmd = Serial.read();
    str_cmd.concat(tmp_cmd);

    delay(10);
  }

  if (str_cmd == "") {
    return;
  }

  Serial.println(str_cmd);

  int param_1 = str_cmd.indexOf(",");
  int param_2 = str_cmd.indexOf(",", param_1+1);
  int req_len = str_cmd.length();

  String motor = str_cmd.substring(0, param_1);
  String dir = str_cmd.substring(param_1+1, param_2);
  String motor_speed = str_cmd.substring(param_2+1, req_len);

  pwm_speed = speed_to_pwm(motor_speed.toInt());

  if ( motor.equals("bottom") ) {
    // 3,4번을 작동시키면된다잉
    motor_control(&motor_3_flag, motor_3_dir, motor_3_pwm, dir, pwm_speed);
    motor_control(&motor_4_flag, motor_4_dir, motor_4_pwm, dir, pwm_speed);
    return;
  }

  if ( motor.equals("arm") && dir.equals("stop") ) {
    // 2, 5
    motor_control(&motor_2_flag, motor_2_dir, motor_2_pwm, dir, pwm_speed);
    motor_control(&motor_5_flag, motor_5_dir, motor_5_pwm, dir, pwm_speed);
    return;
  }

  // motor control individually
  if ( motor.equals("motor-1") ) {
    motor_control(&motor_1_flag, motor_1_dir, motor_1_pwm, dir, pwm_speed);
  }
  else if ( motor.equals("motor-2") ) {
    motor_control(&motor_2_flag, motor_2_dir, motor_2_pwm, dir, pwm_speed);
  }
  else if ( motor.equals("motor-3") ) {
    motor_control(&motor_3_flag, motor_3_dir, motor_3_pwm, dir, pwm_speed);
  }
  else if ( motor.equals("motor-4") ) {
    motor_control(&motor_4_flag, motor_4_dir, motor_4_pwm, dir, pwm_speed);
  }
  else if ( motor.equals("motor-5") ) {
    motor_control(&motor_5_flag, motor_5_dir, motor_5_pwm, dir, pwm_speed);
  }
  else if ( motor.equals("motor-6") ) {
    motor_control(&motor_6_flag, motor_6_dir, motor_6_pwm, dir, pwm_speed);
  }

  delay(10);
}

void motor_control(int* motor_flag, int motor_dir, int motor_pwm, String dir, int speed) {
  if (dir.equals("forward")) {
    *motor_flag = 1;
    digitalWrite(motor_dir, HIGH);
    analogWrite(motor_pwm, speed);
  } 
  else if (dir.equals("backward")) {
    *motor_flag = 1;
    digitalWrite(motor_dir, LOW);
    analogWrite(motor_pwm, speed);
  } 
  else if (dir.equals("stop")) {
    if(*motor_flag == 1) {
      analogWrite(motor_pwm, 1023);
    }
    else if(*motor_flag == 2) {
      analogWrite(motor_pwm, 0);
    }
  }
}

int speed_to_pwm(int speed) {
  int value = map(speed, 0, 100, 0, 1023);
  return value;
}

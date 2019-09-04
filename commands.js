
// 모터 번호별 포크레인 부위
// 1 : 몸체
// 2 :
// 3 : 오른쪽 바퀴
// 4 : 
// 5 : 팔꿈치
// 6 :
// motor-1 : 몸체
// motor

module.export = {

}

var a = 1;
let test = function(i) {
  setTimeout(() => {
    console.log(i);
  }, 1000 * i);
};

for ( var z = 1; z <= 10; z++ ) {
  a = a + 1;
  test(a);
}
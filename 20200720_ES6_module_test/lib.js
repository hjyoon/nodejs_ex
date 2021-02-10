// 첫 번째 방법 (외부로 보내고 싶은 것들에 일일이 키워드를 붙인다.)
// export const pi = Math.PI;
// export function square(x) {
//   return x * x;
// }
// export class Person {
//   constructor(name) {
//     this.name = name;
//   }
// }


// 두 번째 방법 (한 번에 export 해도 된다.)
const pi = Math.PI;
function square(x) {
  return x * x;
}
class Person {
  constructor(name) {
    this.name = name;
  }
}
export { pi, square, Person };


// default export (한 모듈에 하나만 존재)
let cube = function cube(x) {
	return x * x * x;
}
export default cube;

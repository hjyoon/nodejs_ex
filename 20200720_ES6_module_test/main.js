// 개별적으로 가져온다.
//import { pi, square, Person } from './lib.js';

// console.log(pi);         // 3.141592653589793
// console.log(square(10)); // 100
// console.log(new Person('Lee')); // Person { name: 'Lee' }


// "as" 를 사용해서 한번에 모두 가져올 수 있다.
// import * as lib from './lib.js'; 

// console.log(lib.pi);
// console.log(lib.square(10));
// console.log(new lib.Person('Lee'));


// "as" 를 사용해서 이름 변경도 가능하다.
// import { pi as PI, square as sq, Person as P} from './lib.js';

// console.log(PI);         // 3.141592653589793
// console.log(sq(10)); // 100
// console.log(new P('Lee')); // Person { name: 'Lee' }


// import cube from './cube.js'		// default export 를 가져온다.
// import * as lib from './lib.js'; 

// console.log(lib.pi);
// console.log(lib.square(10));
// console.log(new lib.Person('Lee'));
// console.log(cube(3));


// default export를 통해 export 된 값들을 함께 가져올 수 있습니다.
// 이 때, 기본 값(default export 된 값)을 가져오는 부분이 먼저 선언되야 합니다.
import cube, * as lib from './lib.js';

console.log(lib.pi);
console.log(lib.square(10));
console.log(new lib.Person('Lee'));
console.log(cube(3));
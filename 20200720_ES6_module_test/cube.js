let cube = function cube(x) {
	return x * x * x;
}

export default cube;

// 모듈 당 딱 한 개의 default export만 있어야 합니다.
// default export로 객체, 함수 클래스 등이 될 수 있습니다. 
// 가장 간단하게 export 할 수 있으며, 딱 한개만 default export를 할 수 있기 때문에,
// "메인" 이라고 할 수 있는 것을 default export 하는 것이 좋습니다.
// 단일 값이나 모듈에 대한 대체 값을 export 하는데 default export를 사용해야 합니다.
class Student {
  constructor(string, num) {
    this.name = string;
    this.age = num;
  }
  myName() {
  	return "My Name is " + this.name;
  }
}

const yun = new Student("윤효전", 29);

console.log(yun.name);
console.log(yun.age);
console.log(yun.myName());
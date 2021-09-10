/*
 * @Author: Lvhz
 * @Date: 2021-09-09 11:01:42
 * @Description: Description
 */
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

// interface Bear {
//   age: number
// }

class BearAnimal implements Bear {
  name: string;
  honey: boolean;
  constructor(name='dylan', honey=true) {
    this.name = name;
    this.honey = honey;
  }
}

function getBear() {
  return new BearAnimal()
}

const bear = getBear()
console.log(bear.name);
console.log(bear.honey);

// 另外的方式
type Animal1 = {
  name: string
}
type Bear1 = Animal1 & {
  honey: boolean
}


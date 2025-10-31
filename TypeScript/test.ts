let a:number = 1
let b:string = "hello"
let c:boolean = true


let d:any = {name: "John", age: 30} // 'any' type can hold any value
d = 'adawd'
d = true
d = 123
d = [1, 2, 3]

let obj:{name:string, age:number} = {name: "Jane", age: 25}
let obj1:{name:string, age?:number} = {name: "Jane"} // age is optional
let obj2:{[key:string]:number} = {a: 1, b: 2, c: 3} // index signature
let obj3:{readonly id:number, name:string} = {id: 1, name: "John"} // readonly property

let e:number[] = [1, 2, 3, 4, 5]
let f:[string, number] = ["hello", 10]
let regs:RegExp = /ab+c/
let date:Date[] = [new Date(), new Date("2020-01-01")]
let arr:Array<number> = [1, 2, 3, 4, 5]
let id :number | string = 123 // union type
id = 'awdsad'

type ID = number | string // type alias can define a union type
type haslength = {length: number} // type alias for an object with length property
function logLength(arg: haslength): haslength {
  return arg
}
logLength([])
logLength('hello')
logLength({length: 10})


interface User {
    name: string,
    age: number,
}
interface User {
    email: string,
}
interface X extends User {
    id: number,
}
let p:User = {
  name: "Alice",
  age: 28,
  email:'',
} 
let q:X = {// interface 继承
  id: 1,
  name: "Bob",
  age: 32,
  email:'',
}


function greet(name:string,date:Date):string {
    return `Hello ${name}, today is ${date.toDateString()}`
}

const myCanvas = document.getElementById("main_canvas") // HTMLElement | null
const myCanvas1 = document.getElementById("main_canvas") as HTMLCanvasElement // type assertion 类型声明
const myCanvas2 = <HTMLCanvasElement>document.getElementById("main_canvas") // type assertion 类型声明

let parsed = JSON.parse('{"x":10,"y":20}') as {x:number,y:number} // 类型断言
let unKnownValue = '30' as unknown as number // double assertion

const constString = 'hello' // type is 'hello' 直接量类型
function printText(s:string,alignment:'left'|'right'|'center') {} // 字符串字面量类型
printText('hello','left')
printText('hello','right')
printText('hello','center')
// printText('hello','top') // error

let xas:null = null
let xbs:undefined = undefined

function firstElement<Type>(arr:Type[]):Type {// 泛型
  return arr[0]
}
function map<Input,Output>(arr:Input[],func:(arg:Input)=>Output):Output[] {// 泛型输入输出
  return arr.map(func)
}
function longest<Type extends {length:number}>(a:Type,b:Type):Type {// 泛型约束 haslength
  return a.length >= b.length ? a : b
}

//函数重载
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(arg1: number, arg2?: number, arg3?: number): Date {
  if (arg2 !== undefined && arg3 !== undefined) {
    return new Date(arg3, arg1, arg2);
  }
  return new Date(arg1);
}

function noop():void {} // void 没有返回值
function error():never { // never 永远不会有返回值
  throw new Error()
}



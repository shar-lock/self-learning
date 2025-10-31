interface Animal {
  live():void
}
interface Dog extends Animal {
  woof():void
}
type Example1 = Dog extends Animal ? number : string // 条件类型
type Example2 = RegExp extends Animal ? number : string // 条件类型

type NameorId<T extends number | string> = T extends string ? string : number // 条件类型
type c = NameorId<number> // number

type Flatten<T> = T extends any[] ? T[number] : T // 条件类型

type Flatten2<T> = T extends Array<infer U> ? U : T // 条件类型和infer关键字
type MyReturnType<T> = T extends (...args: infer V) => infer U ? U : T // 条件类型和infer关键字
type isPromise<T> = T extends Promise<infer U> ? U : T // 条件类型和infer关键字

type ToArray<T> = [T] extends [any] ? T[] : never
type ToArrayStringOrNumber = ToArray<string | number> // 解决联合类型分配的问题
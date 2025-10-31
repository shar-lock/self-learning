
type Person = {
  name: string
  age: number
  location: string
}

type OptionsFlags<Type> = {
  readonly[Property in keyof Type]?: boolean
}
type PersonOptions = OptionsFlags<Person> // { name: boolean; age: boolean; location: boolean; }

type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
}
type onEmitter<Type> = {
  on(eventNames :`${string & keyof Type}Changed`,callback:(newValue:any)=>void) : void 
}
type personOn = onEmitter<Person>

type onEmitterAdvanced<Type> = {
  on<key extends string & keyof Type> (eventNames:`${key}Change`,callback:(newValue:Type[key])=>void) : void
}
type personOn2 = onEmitterAdvanced<Person>

type PersonGetters = Getters<Person>

type X1 = Capitalize<'foo'|'bar'|'baz'> // "Foo" | "Bar" | "Baz"

type MyCapitalize<T> = T extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Lowercase<Rest>}` : T

type X2 = MyCapitalize<'foo'|'bar'|'baz'> // "Foo" | "Bar" | "Baz"

interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type MyOmit<T,Keys extends keyof T> = {
  [prop in keyof T as prop extends Keys ? never : prop] : T[prop]
}

 

export type Food = {
  id: number,
  rid: number,
  name: string,
  desc: string,
  price: number,
  img: string,
  category:string,
  status: string,
}


export type DeskInfo = {
  id:number,
  rid:number,
  name:string,//餐桌名称
  title:string,
}

export type Order = {
  id:number,
  rid: number,
  did: number,
  deskName: string,
  customCount: number,
  status: string,
  timestamp: string,
  totalPrice: number,
  details:{
      amount: number,
      food: {
        id: number,
        rid: number,
        name: string,
        desc: string,
        price: number,
        img: string,
        category:string,
        status: string,
      }
  }[],
}

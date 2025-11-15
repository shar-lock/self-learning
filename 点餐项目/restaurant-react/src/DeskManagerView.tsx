import axios from "axios"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { QRCode } from 'antd'


type Desk = {
  id: number,
  rid: number,
  name: string,
  capacity: number,
}

class DeskManager{
  deskes:Desk[] = []
  constructor(){
    makeAutoObservable(this)
  }
  addDeak(...deskes:Desk[]){
    this.deskes.push(...deskes)
  }
}




function DeskManagerView(){

  let [manager] = useState(()=>new DeskManager())


  

  useEffect(()=>{
    let ignore = false
    axios.get(`/api/restaurant/1/desk`)
      .then(res=>{
        if(!ignore){
          manager.addDeak(...res.data)
        }
    })
    return ()=>{
      ignore = true
    }
  },[])
  
  async function deleteDesk(idx:number) {
    await axios.delete(`/api/restaurant/1/desk/${manager.deskes[idx].id}`)
    manager.deskes.splice(idx,1)
  }


  return (
    <div className="grow">
      桌面管理页面
      <Link className="text-blue-500" to='/home/add-desk'>添加桌面</Link>
      <div className="p-2 space-y-2">
        {
          manager.deskes.map((desk,idx)=>{
            return (
              <div key={desk.id} className="border flex grow rounded">
                <div className="p-2">
                  <div>名称: {desk.name}</div>
                  <div>座位: {desk.capacity}</div>
                  <div className="flex gap-2">
                    <button >编辑</button>
                    <button onClick={()=>deleteDesk(idx)}>删除</button>
                    <button>打印二维码</button>
                  </div>
                </div>
                <div className=" w-24 p-2">
                  <QRCode bgColor="white" size={100} value={`http://10.3.3.3:5174/r/1/d/${desk.id}`}/>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default observer(DeskManagerView)
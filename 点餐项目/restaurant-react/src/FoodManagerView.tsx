import axios from "axios"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useInput } from "./hooks"
import { type Food } from './Types'
import { Tabs, type TabsProps } from "antd"



class foodManager{
  foods:Food[] = []
  constructor(){
    makeAutoObservable(this)
  }
  addFood(...foods:Food[]){
    this.foods.push(...foods)
  }
  setFoodStatus(idx:number,status:string){
    this.foods[idx].status = status
  }
  editFood(idx:number,food:Food){
    this.foods[idx] = food
  }
  get grouped(){
    let group = this.foods.map((foodItem,idx)=>{
      return {
        ...foodItem,
        idx,
      }
    })
    let groupMap: Record<string, typeof group> = {}
    for(let foodItem of group){
      if(!groupMap[foodItem.category]){
        groupMap[foodItem.category] = []
      }
      groupMap[foodItem.category].push(foodItem)
    }
    return groupMap 
  }
}

function FoodManagerView(){

  let [manager] = useState(()=>new foodManager())
  useEffect(()=>{
    let ignore = false
    axios.get(`/api/restaurant/1/food`)
      .then(res=>{
        if(!ignore){
          manager.addFood(...res.data)
        }
    })
    return ()=>{
      ignore = true
    }
  },[])

//  async function onSale(idx:number){
//   let food = manager.foods[idx]
//   await axios.put(`/api/restaurant/1/food/${food.id}`,{
//     status:'on',
//   })
//   manager.setFoodStatus(idx,'on')
//  }

//  async function closeSale(idx:number){
//   let food = manager.foods[idx]
//   await axios.put(`/api/restaurant/1/food/${food.id}`,{
//     status:'off',
//   })
//   manager.setFoodStatus(idx,'off')
//  }


  let tabProps:TabsProps['items'] = Object.entries(manager.grouped).map(([category,foods])=>{
    return  {
      key:category,
      label:category,
      children:(
        <div className="p-2 space-y-2">
        {
          foods.map((foodItem)=>{
            return <FoodItem manager={manager} foodItem={foodItem} idx={foodItem.idx} key={foodItem.id}/>
          })
        }
      </div>
      )
    }
  })

  return (
    <div className="grow overflow-auto">
      菜品管理页面
      <Link className="text-blue-500" to='/home/add-food'>添加菜品</Link>
      <Tabs items={tabProps}/>
    </div>
  )
}

type FoodItemProp = {
  foodItem:Food,
  idx:number,
  manager:foodManager,
}



const FoodItem: React.FC<FoodItemProp> =  observer(({manager,foodItem,idx}) => {
  
  
  async function onSale(idx:number){
    let food = manager.foods[idx]
    
    await axios.put(`/api/restaurant/1/food/${food.id}`,{
      status:'on',
    })
    manager.setFoodStatus(idx,'on')
  }
  async function closeSale(idx:number){
    let food = manager.foods[idx]
    await axios.put(`/api/restaurant/1/food/${food.id}`,{
      status:'off',
    })
    manager.setFoodStatus(idx,'off')
  }
  
  let name = useInput(foodItem.name)
  let price = useInput(foodItem.price)
  let desc = useInput(foodItem.desc)
  let category = useInput(foodItem.category)
  let [editing,setEditing] = useState(false)
  
  let imgInputRef = useRef<HTMLInputElement | null>(null)

  async function handleEditing(){
    let fd = new FormData()
    fd.append('name',name.value)
    fd.append('price',price.value)
    fd.append('desc',desc.value)
    fd.append('category',category.value)
    //如果选了文件就上传
    if(imgInputRef.current!.files!.length >0){
      fd.append('img',imgInputRef.current!.files![0])
    }
    let res = await axios.put(`/api/restaurant/1/food/${foodItem.id}`,fd)

    //该请求的相应是编辑后的菜品
    manager.editFood(idx,res.data)
    setEditing(false)
  }

  async function deleteItem() {
    await axios.delete(`/api/restaurant/1/food/${foodItem.id}`)
    manager.foods.splice(idx,1)
  }
  if(editing){
    return (
      <div className="border rounded p-2">
      <div className="flex p-2">名称: <input className="border" type="text" {...name}/></div>
      <div className="flex p-2">价格: <input className="border" type="text" {...price}/></div>
      <div className="flex p-2">分类: <input className="border" type="text" {...category}/></div>
      <div className="flex p-2">描述: <input className="border" type="text" {...desc}/></div>
      <div className="flex p-2">图片: <input className="border" type="file" ref={imgInputRef}/></div>
      <div className="flex p-2">
        <button onClick={handleEditing}>确定</button>
        <button onClick={()=>setEditing(false)}>取消</button>
      </div>
    </div>
    )
  }else{
    return (
      <div className="border rounded p-2 flex gap-2 grow-0 shrink-0">
        <img className="w-24 h-24" src={'/upload/' + foodItem.img} alt={foodItem.name} />
        <div>
          <div>名称: {foodItem.name}</div>
          <div>价格: {foodItem.price}</div>
          <div>分类: {foodItem.category}</div>
          <div>描述: {foodItem.desc}</div>
          <div>状态: {foodItem.status=='on' ? '上架中' : '已下架'}</div>
          <div>
            {
              foodItem.status == 'on' ?  
              <button onClick={()=>closeSale(idx)}>下架</button> : 
              <button onClick={()=>onSale(idx)}>上架</button>
            }
            <button onClick={() => setEditing(true) }>编辑</button>
            <button onClick={deleteItem}>删除</button>
          </div>
        </div>
      </div>
    )
  }
})

export default observer(FoodManagerView)
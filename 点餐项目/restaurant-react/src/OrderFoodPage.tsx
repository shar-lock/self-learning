import axios from "axios"
import { useRequest, useThrottleFn, useToggle } from "ahooks"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useImmer } from 'use-immer'
import { type Food } from './Types'
import { useEffect, useMemo, useRef, useState } from "react"
import { io } from "socket.io-client"
import { SideBar,Checkbox,Stepper, Skeleton } from 'antd-mobile'

function getDeskInfo(id:number|string){
  return axios.get('/api/deskinfo?did=' + id).then(res=>res.data)
  }

function OrderFoodPage(){
  //是否展示购物篮
  const [extend, { toggle }] = useToggle(false);
  let params = useParams()
  let [query] = useSearchParams()
  let navigator =  useNavigate()

  let clientRef = useRef<any>(null)

  //请求桌号信息
  let {data:deskInfo,loading:deskInfoLoading} = useRequest(getDeskInfo,{
    defaultParams:[params.deskId!],
  })
  
  function getMenu(id:string|number){
    return axios.get('/api/menu/restaurant/' + id).then(res=>res.data)
  }
  //请求菜单
  let {data:menu,loading:menuLoading} = useRequest<Food[],[string|number]>(getMenu,{
    defaultParams:[params.restaurantId!],
    onSuccess:(data)=>{
      updateOrderCount((orderCount)=>{
        //有到少个菜为0
        orderCount.push(...Array(data.length).fill(0))
      })
      updateFoodSelected((foodSelected)=>{
        foodSelected.push(...Array(data.length).fill(true))
      })
    }
  })


  //使用socketIO链接服务端，实时通讯
  useEffect(()=>{
    if(menu){
      clientRef.current = io(`ws://${location.host}`, {
        path: '/desk',
        transports: ['websocket','polling'],
        query: {
          desk: `desk:${params.deskId}`//要加入的桌号
        }
      })
      
      //链接成功后，显示此桌已经加入购物车的菜品，仅触发一次
      clientRef.current.on('cart food',(data:any)=>{
        for(let info of data){
          let id = info.food.id
          let idx = menu.findIndex(it=>it.id == id)
          updateOrderCount(foodCount=>{
            foodCount[idx] = info.amount
          }) 
        }
      })
      
      //其它人新增菜品，多次触发
      clientRef.current.on('new food',(info:any)=>{
        let foodId = info.food.id
        let idx = menu!.findIndex(it=>it.id == foodId)
        if(idx>=0){
          updateOrderCount(draft=>{
            draft[idx] = info.amount
          })
        }
      })
  
      //其它人下单成功
      clientRef.current.on('placeorder success',()=>{
        navigator('/place-order-success')
      }) 
  
      return ()=>{
        clientRef.current.close()
      }
    }
  },[menu])


  function setFoodCount(idx:number,count:number){
    //通知服务端，当前桌号新增了菜品
    clientRef.current.emit('new food',{
      desk:'desk:' + params.deskId,
      food:menu![idx],
      amount:count,
    })
    updateOrderCount(draft=>{
      draft[idx] = count
    })
  }




  //每个菜的点餐数量
  let [orderCount,updateOrderCount] = useImmer<number[]>([])
  let [foodSelected,updateFoodSelected] = useImmer<boolean[]>([])


  function totalPrice(){
    return menu!.map(it=>it.price)
            .map((price,idx)=>{
              return price * orderCount[idx]
            }).reduce((a,b)=>a+b,0)
  }


  //下单
  async function placeOrder(){
    let order = {
      deskName: deskInfo!.name,
      customCount: query.get('c'),
      totalPrice:  totalPrice(),
      foods: selectedFood().filter(it=>it.selected).map(it=>({
        amount:it.count,
        food:it.food,
      }))
    }

    await axios.post(`/api/restaurant/${deskInfo!.rid}/desk/${deskInfo!.id}/order`,order)
    navigator('/place-order-success')
  }

  //已选择的菜品
  function selectedFood(){
    return  orderCount.map((count,idx)=>{
      return {
        count,
        food:menu![idx],
        idx,
        selected:foodSelected[idx],
      }
    }).filter(it=>it.count>0)
  }



  function setFoodSelected(idx:number,selected:boolean){
    updateFoodSelected(draft=>{
      draft[idx] = selected
    })
  }
  let groupedMenu = useMemo(()=>{
    if(menu == null) return {} 
    let group = menu.map((foodItem,idx)=>{
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
  },[menu])


  //处理滚动事件，侧边栏联动
  const [activeKey, setActiveKey] = useState(Object.keys(groupedMenu)[0] || 'menu')

  const { run: handleScroll } = useThrottleFn(
    () => {
      let currentKey = Object.keys(groupedMenu)[0]
      for (const item of Object.keys(groupedMenu)) {
        const element = document.getElementById(`anchor-${item}`)
        if (!element) continue
        const rect = element.getBoundingClientRect()
        if (rect.top <= 110) {
          currentKey = item
        } else {
          break
        }
      }
      setActiveKey(currentKey)
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    }
  )


  if(deskInfoLoading || menuLoading) return (
    <div>
      <Skeleton.Title animated/>
      <Skeleton.Paragraph lineCount={5} animated/>
      <Skeleton.Title animated/>
      <Skeleton.Paragraph lineCount={12} animated/>
    </div>
  )
  return (
    <div className="h-screen flex flex-col">
      <h1 className="text-xl border-b p-4">{ deskInfo.title } - {deskInfo.name}</h1>

      <div className="flex grow overflow-auto">
        <div className="overflow-auto shrink-0 w-32 border-r">
          <SideBar
            activeKey={activeKey}
            onChange={key => {
              document.getElementById(`anchor-${key}`)?.scrollIntoView({
                behavior:'smooth',
              })
            }}
          >
            {
              Object.keys(groupedMenu).map((category)=>{
                return (
                  <SideBar.Item title={category} key={category} />
                )
              })
            }
          </SideBar>
        </div>
        <div className="overflow-auto grow p-4 space-y-4" onScroll={handleScroll} >
          {
            Object.entries(groupedMenu).map(([category,foods])=>{
              return (
                <div key={category} className="space-y-2" id={'anchor-' + category}>
                  <h2 className="text-2xl font-bold">{category}</h2>
                  {
                    foods.map((foodItem:any)=>{
                      return (
                        <div className="flex gap-2" key={foodItem.id}> 
                        <img className="w-24 h-24 shrink-0" src={'/upload/'+ foodItem.img} alt="" />
                        <div className="grow">
                          <div>{foodItem.name}</div>
                          <div>￥{foodItem.price}</div>
                          <div>{foodItem.desc}</div>
                        </div>
                        <Stepper min={0} max={5} value={orderCount[foodItem.idx]} onChange={counter=>setFoodCount(foodItem.idx,counter)} />
                        </div>
                      )
                    })
                  }
                </div>
                )
            })
          }
        </div>
      </div>


      <div className="h-10 shrink-0"></div>
      <div className="fixed bottom-0 bg-slate-700 w-full text-white">
        <div hidden={extend} data-detail="当前购物车详情">
          <div className="flex">
            <div className="w-5"></div>
            <div className="basis-1/3 grow">名称</div>
            <div className="basis-0 grow text-center">小计</div>
            <div className="basis-0 grow text-center">数量</div>
         </div>
          {
            selectedFood().map(entry=>{
              return(
                <div className="flex items-center" key={entry.food.id}>
                  <div>
                    <Checkbox checked={entry.selected} onChange={checked => setFoodSelected(entry.idx,checked)} />
                  </div>
                  <div className="basis-1/3 grow ">{entry.food.name}</div>
                  <div className="basis-0 grow ">￥{entry.count * entry.food.price}</div>
                  <Stepper min={0} max={5} value={entry.count}  onChange={counter=>setFoodCount(entry.idx,counter)}/>
                  {/* <Counter min={0} max={5} value={entry.count}  onChange={counter=>setFoodCount(entry.idx,counter)}/> */}
                </div>
              )
             })
          }
        </div>
        <div className="items-center flex justify-between">
          <button className="relative" onClick={toggle}>展开
            <span hidden={!extend} className="absolute text-xs bg-red-500 text-white rounded-full p-px -right-3 -top-2">{selectedFood().map(e=>e.count).reduce((a,b)=>a+b,0)}</span>
          </button>
          <span>￥{totalPrice()}</span>
          <button onClick={placeOrder}>下单</button>
        </div>
      </div>
    </div>
  )
}

export default OrderFoodPage

type CounterProps={
  min:number,
  max:number,
  start?:number,
  step?:number,
  value?:number,
  onChange?:(current:number)=>void,
}

export function Counter({min,max,step = 1,value = 0,onChange = ()=>{}}:CounterProps){


  function inc(){
      let t =  value + step
      if(t>max){
        t = max
      }
      onChange(t)
  }
  function dec(){
      let t =  value - step
      if(t<min){
        t = min
      }
      onChange(t)
  }
  return (
    <div className="flex gap-1 self-center items-center">
      <button onClick={dec} className="bg-amber-400 w-8 h-8 flex items-center justify-center rounded-full">-</button>
      <span className="w-8 text-center">{value}</span>
      <button onClick={inc} className="bg-amber-400 w-8 h-8 flex items-center justify-center rounded-full">+</button>
    </div>
  )
}
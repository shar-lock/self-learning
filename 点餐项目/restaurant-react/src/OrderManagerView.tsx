import axios from 'axios'
import { useEffect, useState } from 'react'
import { makeAutoObservable, observable } from 'mobx'
import { observer } from 'mobx-react'
import {type Order} from './Types'
import { io } from 'socket.io-client'



class OrdersManager{
  orders:Order[] = []
  constructor(){
    makeAutoObservable(this)
  }
  deleteOrder(id:number){
    this.orders.splice(id,1)
  }
  changOrderStatus(idx:number,status:string){
    this.orders[idx].status = status
  }
  addOrders(...orders:Order[]){
    this.orders.push(...orders)
  }
  addOrder(order:Order){
    this.orders.unshift(order)
  }
}

function OrderManagerView(){
  let [manager] = useState(()=> observable(new OrdersManager())) 

  //请求订单
  useEffect(()=>{
    let ignore = false
    axios.get('/api/restaurant/1/order').then(res=>{
      if(!ignore){
        manager.addOrders(...res.data)
      }
    })
    return () =>{
      ignore = true
    }
  },[])


  //监听新订单 使用socketIO
  useEffect(()=>{
    let client = io(`ws://${location.host}`, {
      path: '/restaurant',
      transports: ['websocket','polling'],
      query: {
        restaurant: 'restaurant:1'//要监听的餐厅id
      }
    })

    client.on('new order',(newOrder)=>{
      console.log('有新订单了',newOrder)
      manager.addOrder(newOrder)
    })


    return ()=>{
      client.close()
    }
  },[])

  async function deleteOrder(id:number,idx:number){
    await axios.delete(`/api/restaurant/1/order/${id}`)
    manager.deleteOrder(idx)
  }
  async function confirmOrder(order:Order,idx:number){
    await axios.put(`/api/restaurant/1/order/${order.id}/status`,{
      status:'confrimed'
    })
    manager.changOrderStatus(idx,'confrimed')
  }
  async function completeOrder(order:Order,idx:number){
    await axios.put(`/api/restaurant/1/order/${order.id}/status`,{
      status:'completed'
    })
    manager.changOrderStatus(idx,'completed')
  }



  return (
    <div>
      订单管理页面
      <ul>
          {
            manager.orders.map((order,idx)=>{
              return (
                <li className='border' key={order.id}>
                  <div>座位号:{order.deskName}</div>
                  <div>人数:  {order.customCount}</div>
                  <div>状态:  {order.status === 'pending' ? '待确认' : order.status === 'confrimed' ? '已确认' : '已完成'}</div>
                  <div>时间:  {order.timestamp}</div>
                  <div>
                    {order.details.map((item,idx:number)=>{
                      return (
                        <div key={idx}>
                          <div>菜名:  {item.food.name}</div>
                          <div>数量:  {item.amount}</div>
                          <div>价格:  {item.food.price*item.amount}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div>
                    <button>打印</button>
                    {
                      order.status==='pending' ? <button onClick={()=> confirmOrder(order,idx)}>确认</button> : ''
                    }
                    {
                      order.status==='confrimed' ? <button onClick={() => completeOrder(order,idx)}>完成</button> : ''
                    }
                    <button onClick={() => deleteOrder(order.id,idx)}>删除</button>
                  </div>
                </li>
              )
            })
          }
      </ul>
    </div>
  )
}

export default observer(OrderManagerView)
import { Suspense, useEffect, useState } from "react"
import { Link,Outlet, useNavigate } from "react-router-dom"
import { useAtom } from "jotai"
import { isLoginAtom } from "./store"
import axios from "axios"

type RestaurantInfo = {
  title:string,
  id:string,
  name:string,
}

export default function HomeView(){
  let [isLogin,] = useAtom(isLoginAtom)
  let navigate = useNavigate()
  let [userinfo,setUserinfo] = useState<null | RestaurantInfo>(null)
  useEffect(()=>{
    axios.get('/api/userinfo').then(res=>{
      setUserinfo(res.data)
    })
  },[])
  useEffect(()=>{
    if(!isLogin){
      navigate('/')
    }
  },[isLogin])
  return (
    <div className="flex h-screen flex-col overflow-auto">
      <div>
       <h1 className="border-b shrink-0 p-2 justify-between flex items-center ">
        <span className="text-2xl">{userinfo?.title}</span>
        <button>退出</button>
       </h1>
      </div>
      <div className="flex grow overflow-auto">
        <div className="xw-24 border-r shrink-0">
          <Link className="[&.active]:bg-slate-700 block text-center p-2" to='/home/orders'>订单管理</Link>
          <Link className="[&.active]:bg-slate-700 block text-center p-2" to='/home/foods'>菜品管理</Link>
          <Link className="[&.active]:bg-slate-700 block text-center p-2" to='/home/desks'>桌面管理</Link>
        </div>
        <div className="grow overflow-auto">
          <Suspense fallback={'Loading'}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
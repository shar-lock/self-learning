import {useInput} from './hooks'
import axios from 'axios'
import { isLoginAtom } from './store'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
export default function login(){
  let name = useInput('')  
  let password = useInput('')
  let captcha = useInput('')
  let navigate = useNavigate()
  let [,setIsLogin] = useAtom(isLoginAtom)
  async function login(){
    try{
       await axios.post('/api/login',{
        name:name.value,
        password:password.value,
        captcha:captcha.value,
      })
      setIsLogin(true)
      navigate('/home')
    } catch(e:any){
      if(e.isAxiosError){
        alert('登录失败:' + e.response?.data.msg)
      }else{
        throw e
      }
    }
  }
  return (
    <div>
      <div className="h-12 m-12 items-center flex">
        <label className="flex gap-2">
          <span className="w-12 inline-block text-right">用户名</span>
          <input className='border' type="text" name="name" {...name}/>
        </label>
      </div>
      <div className="h-12 m-12 items-center flex">
        <label className="flex gap-2">
          <span className="w-12 inline-block text-right">密码</span>
          <input className='border' type="password" name="password" {...password}/>
        </label>
      </div>
      <div className="h-12 m-12 items-center flex">
        <label className="flex gap-2">
          <span className="w-12 inline-block text-right">验证码</span>
          <input className='border' type="text" name="captcha" {...captcha}/>
        </label>
        <div>
          <img src="/api/captcha" className='h-8' alt="验证码" />
        </div>
      </div>

      <div className="h-12 m-12 items-center flex">
        <button className="ml-14" onClick={login}>登录</button>
      </div>
    </div>
  )
}
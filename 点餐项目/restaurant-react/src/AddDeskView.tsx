
import { useInput } from "./hooks"
import axios from "axios"
import { useNavigate } from 'react-router-dom'

export default function AddDeskView(){
  let name = useInput('')
  let cap = useInput('')
  
  let navigate = useNavigate()

  function addFood(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
    e.preventDefault()
    axios.post('/api/restaurant/1/desk',{
      name:name.value,
      capacity:cap.value,
    }).then(()=>{
      navigate('/home/desks')
    })
  }
  return (
    <div>
      <form action="">
        <div className="flex items-center h-12">
          <label>名称：<input type="text" placeholder="名称" {...name}/></label>
        </div>
        <div className="flex items-center h-12">
          <label>座位数量：<input  type="text" placeholder="座位数量" {...cap}/></label>
        </div>
        <button onClick={e => addFood(e)}>提交</button>
      </form>
    </div>
  )
}
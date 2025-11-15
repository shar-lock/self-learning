import { useRef } from "react"
import { useInput } from "./hooks"
import axios from "axios"
import { useNavigate } from 'react-router-dom'

export default function AddFoodView(){
  let name = useInput('')
  let price = useInput('')
  let desc = useInput('')
  let category = useInput('')
  let imgInputRef = useRef<HTMLInputElement>(null)
  
  let navigate = useNavigate()

  function addFood(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
    e.preventDefault()
    let fd = new FormData()
    fd.append('name',name.value)
    fd.append('price',price.value)
    fd.append('desc',desc.value)
    fd.append('category',category.value)
    fd.append('status','on')
    fd.append('img',imgInputRef.current!.files![0])
  
    axios.post('/api/restaurant/1/food',fd).then(()=>{
      navigate('/home/foods')
    })
  }
  return (
    <div>
      <form action="">
        <div className="flex items-center h-12">
          <label >名称：<input type="text" placeholder="名称" {...name}/></label>
        </div>
        <div className="flex items-center h-12">
          <label >价格：<input type="text" placeholder="价格" {...price}/></label>
        </div>
        <div className="flex items-center h-12">
          <label >描述：<input type="text" placeholder="描述" {...desc}/></label>
        </div>
        <div className="flex items-center h-12">
          <label >分类：<input type="text" placeholder="分类" {...category}/></label>
        </div>
        <div className="flex items-center h-12">
          <input type="file" placeholder="图片" ref={imgInputRef}/>
        </div>
        <button onClick={e => addFood(e)}>提交</button>
      </form>
    </div>
  )
}
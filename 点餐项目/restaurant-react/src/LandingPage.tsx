import { useState } from "react"
import clsx from 'clsx'
import { useNavigate , useParams} from "react-router-dom"
import { useRequest } from 'ahooks'  
import axios from "axios"
import { useAtom } from "jotai"
import { deskInfoAtom } from "./store"
function getDeskInfo(id:number|string){
  return axios.get('/api/deskinfo?did=' + id).then(res=>res.data)
}

function LandingPage(){
  const [customCount,setCustomCount] = useState(0)
  const navigate = useNavigate()
  const params = useParams()
  
  function start(){       
    navigate('/r/1/d/1?c=' + customCount)
  }

  const [,setDeskInfo] = useAtom(deskInfoAtom)

  let {data,loading} = useRequest(getDeskInfo,{
    defaultParams:[params.deskId!],
    onSuccess(data) {
      setDeskInfo(data)
    }
  })
  


  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1>{loading ? 'Loading' : data.title + ':' + data.name}</h1>
      <div className="grid grid-cols-4 gap-2">
        {
          new Array(12).fill(0).map((_,idx)=>{
            return <div key={idx}  className={clsx(
              "w-8 h-8 flex justify-center items-center cursor-pointer rounded border [&.active]:text-red-500",
              {active:customCount == idx + 1}
            )}
            onClick={()=>setCustomCount(idx+1)}
            >{idx + 1}</div>
          })
        }
      </div>
      <button className="text-center" disabled={customCount == 0} onClick={start}>开始点餐</button>
    </div>
  )
}

export default LandingPage
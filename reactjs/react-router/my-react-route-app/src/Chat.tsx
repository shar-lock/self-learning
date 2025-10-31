
import { Link, useParams } from "react-router-dom";

export default function Chat() {
  let params  = useParams()
  
  return (
    <div>
      <Link to="/">返回</Link>
      <div>
        <p>Chating with {params.friendId} </p>
      </div>
    </div>
  )
}
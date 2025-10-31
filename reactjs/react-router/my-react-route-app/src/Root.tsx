import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Root() {
  return (
    <div>
      <div>
       <Outlet />
      </div>
      <div>
        <Link to="/">聊天</Link>
        <Link to="/discover">发现</Link>
        <Link to="/me">我的</Link>
      </div>
    </div>
  )
}
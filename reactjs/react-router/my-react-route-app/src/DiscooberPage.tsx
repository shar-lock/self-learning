import { Link } from "react-router-dom";

export default function DiscooberPage() {
  return (
    <div>
      <Link to="/">返回</Link>
      <div>
        <div><Link to="/friend-circle">朋友圈</Link></div>
      </div>
    </div>
  )
}
import { Link } from "react-router-dom";

export default function ChatList() {
  return (
    <div>
      <h2>Chat List</h2>
      <ul>
        {
          ['Alice', 'Bob', 'Charlie'].map((name) => (
            <li key={name}><Link to={'/chat/' + name}>{name}</Link></li>
          ))
        }
      </ul>
    </div>
  )
}
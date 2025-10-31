import type { Todo } from "./store"
import { useAtom } from "jotai"
import { todosAtom } from "./store"
type TodoItemProps = {
 todo:Todo,
}
export default function TodoItem({todo}:TodoItemProps){
  const [, setTodos] = useAtom(todosAtom)
  function toggle(id: number | string){
    setTodos(todos => {
      const todo = todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
      }
    }
    )
  }
  function deleteTodo(id: number | string){
    setTodos(todos => {
      const idx = todos.findIndex(t => t.id === id)
      if (idx > -1) {
        todos.splice(idx, 1)
      }
    })
  }
  return (
    <li className={todo.completed ? 'completed' : 'active'}>
      <input type="checkbox" checked={todo.completed} onClick={()=>toggle(todo.id)}/>
      <span>{todo.text}</span>
      <button onClick={()=>deleteTodo(todo.id)}>&times;</button>
    </li>
  )
} 
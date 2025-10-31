import { useAtom } from "jotai"
import { isAllCompletedAtom, todosAtom } from "./store"
export default function TodoHeader(){
  const [isAllCompleted] = useAtom(isAllCompletedAtom)
  const [, setTodos] = useAtom(todosAtom)
  function toggleAll(){
    setTodos(todos => todos.forEach(todo=>(todo.completed =  !isAllCompleted)))
  } 
  function addTodo(e: React.KeyboardEvent<HTMLInputElement>){
    if(e.key === 'Enter'){
      const text = e.currentTarget.value.trim()
      if(text.length === 0){
        return
      }
      setTodos(todos => {
        todos.push({
          id: Date.now(),
          text,
          completed: false,
        })
      })
      e.currentTarget.value = ''
    }
  }
  return <div>
    <input type="checkbox"  checked={isAllCompleted} onChange={toggleAll}/>
    <input type="text" onKeyDown={addTodo} />
  </div>
}
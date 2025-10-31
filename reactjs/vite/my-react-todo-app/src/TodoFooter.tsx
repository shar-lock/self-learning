import { useAtomValue,useAtom } from "jotai"
import { leftCountAtom ,hasCompletedAtom,todosAtom,visibleTypeAtom } from "./store"


export default function TodoFooter(){
  let leftCount = useAtomValue(leftCountAtom)
  let hasCompleted = useAtomValue(hasCompletedAtom)
  let [,setTodos] = useAtom(todosAtom)
  let [visibleType,setVisibleType] = useAtom(visibleTypeAtom)
  function clearCompleted(){
    setTodos(todos => todos.filter(todo => !todo.completed))
  }
  return <div>
    <span>{leftCount} item{leftCount > 1 ? 's' : ''} left</span>
    <div>
      <label><input type="radio" name="visibleType" checked={visibleType==='all'} onChange={()=>setVisibleType('all')} />All</label>
      <label><input type="radio" name="visibleType" checked={visibleType==='active'} onChange={()=>setVisibleType('active')} />Active</label>
      <label><input type="radio" name="visibleType" checked={visibleType==='completed'} onChange={()=>setVisibleType('completed')} />Completed</label>
    </div>
    {
      hasCompleted ? <button onClick={clearCompleted}>Clear Completed</button> : ''
    }
  </div>
}
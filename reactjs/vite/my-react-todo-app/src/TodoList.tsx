import { useAtom, useAtomValue } from 'jotai';
import { todosAtom,visibleTypeAtom} from './store.ts';
import TodoItem from './TodoItem.tsx';
export default function TodoList(){
  let [todos] = useAtom(todosAtom)
  const visibleType = useAtomValue(visibleTypeAtom)
  return <ul className={`show-${visibleType}`}>
    {
      todos.map((todo)=> <TodoItem key={todo.id} todo={todo}/>)
    }
  </ul>
}
import TodoHeader from './TodoHeader'
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';

function TodoApp(){
  return <div>
    <h1>My Todo App</h1>
    <TodoHeader />
    <TodoList />
    <TodoFooter />
  </div>;
}

export default TodoApp;
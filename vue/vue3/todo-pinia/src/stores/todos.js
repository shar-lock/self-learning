import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTodos = defineStore('todos', () => {
  const todos = ref([
    {
      id:1,
      text:'eat',
      completed:true,
    },{
      id:2,
      text:'sleep',
      completed:false,
    }
  ])
  let visibleType = ref('all')
  let editingId = ref(-1)


  let isAllCompleted = computed(()=>todos.value.every(e=>e.completed)) 
  let hasCompleted = computed(()=>todos.value.some(e=>e.completed))
  let leftcount = computed(()=>todos.value.filter(e=>!e.completed).length)
  let visibleTodos = computed(()=>{
    if(visibleType.value == 'all'){
      return todos.value
    }else if(visibleType.value == 'active'){
      return todos.value.filter(e => !e.completed)
    }else{
      return todos.value.filter(e => e.completed)
    }
  })



  function deleteTodo(id){
    let idx = todos.value.findIndex(e=>e.id==id)
    if(idx>=0){
      todos.value.splice(idx,1)
    }
  }
  function toggleAll(){
    if(isAllCompleted.value === true){
      todos.value.forEach(e=>e.completed = false)
    }else{
      todos.value.forEach(e=>e.completed = true)
    }
  }
  function addTodo(text){
    const newTodo = {
      id:Date.now(),
      text,
      completed:false,
    }
    todos.value.push(newTodo)
   }
   function clearCompleted(){
    todos.value = todos.value.filter(e=>!e.completed)
   }
  return { 
    todos,
    visibleTodos,
    isAllCompleted,
    editingId,
    visibleType,
    hasCompleted,
    leftcount,
    deleteTodo,
    toggleAll,
    addTodo,
    clearCompleted,
  }
},{
  persist:true
})

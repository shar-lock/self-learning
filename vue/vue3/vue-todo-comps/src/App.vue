<script setup>
  import TodoHeader from './TodoHeader.vue';
  import TodoList from './TodoList.vue';
  import TodoFooter from './TodoFooter.vue';
  import {ref,reactive} from 'vue'
  const todos = ref([{
    id:Math.random().toString(),
    text:'eat',
    completed:true,
  },{
    id:Math.random().toString(),
    text:'sleep',
    completed:false,
  }])
  let visibleType = ref('All')
  let editingIdx = ref(-1)
  function deleteTodo(id){
    let idx = todos.value.findIndex(it  =>  it.id===id)
    if(idx >= 0){
      todos.value.splice(idx,1)
    }
  }
  function toggleTodo(id){
    let idx = todos.value.findIndex(it  =>  it.id===id)
    if(idx >= 0){
      todos.value[idx].completed = !todos.value[idx].completed
    }
  }
  function toggleAll(){
    if(todos.value.every(e => e.completed)){
      todos.value.forEach(e => e.completed=false)
    }else{
      todos.value.forEach(e => e.completed=true)
    }
  }
  function addTodo(text){
    todos.value.push({
      id:Math.random().toString(),
      text,
      completed:false,
    })
  }
</script>

<template>
  <div>
    <TodoHeader :todos="todos" @toggle-All="toggleAll" @add-todo="addTodo"></TodoHeader>
    <TodoList :todos="todos" :visibleType="visibleType" @delete-todo="deleteTodo" @todo-status-change="toggleTodo"></TodoList>
    <TodoFooter :todos="todos" :visibleType="visibleType" @visibleType-change="visibleType = $event"></TodoFooter>
  </div>
</template>

<style scoped></style>

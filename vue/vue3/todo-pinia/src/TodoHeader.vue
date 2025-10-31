<script setup>
 import { useTodos } from './stores/todos';
 let store = useTodos()
 function addTodo(e){
  let text = e.target.value.trim()
  if(text){
    store.addTodo(text)
    e.target.value = ''
  }
 }
</script>

<template>
  <h1>Todo</h1>
  <div>
    <input type="checkbox" @click="store.toggleAll" :checked="store.isAllCompleted">
    <input type="text" @keyup.enter="addTodo($event)">
  </div>
</template>

<style scoped></style>

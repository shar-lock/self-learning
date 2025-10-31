<script setup>
import { useTodos } from './stores/todos';

 defineProps(['todo'])
 let store = useTodos()
 let vFocus = {
  mounted(el){
    el.focus()
  }
 }
</script>

<template>
  <li>
    <input type="checkbox" v-model="todo.completed">
    <input v-focus type="text" v-if="todo.id==store.editingId" :value="todo.text" @keyup.escape="store.editingId=-1" @blur="store.editingId=-1" @keyup.enter="todo.text=$event.target.value.trim();store.editingId = -1">
    <span v-else @dblclick="store.editingId=todo.id">{{ todo.text }}</span>
    <button @click="store.deleteTodo(todo.id)">x</button>
  </li>
</template>

<style scoped></style>
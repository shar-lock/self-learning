<script setup>
  import TodoItem from './TodoItem.vue';
  import { useTodos } from './stores/todos';
  let store = useTodos()
</script>

<template>
  <ul>
    <TodoItem v-for="todo in store.visibleTodos" :key="todo.id" :todo="todo"></TodoItem>
  </ul>
</template>

<style scoped></style>

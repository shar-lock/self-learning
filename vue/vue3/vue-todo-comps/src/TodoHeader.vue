<script setup>
  import { computed } from 'vue'
  let props = defineProps(['todos'])
  let isAllCompleted = computed(() => props.todos.every(e=>e.completed))
  let emit =  defineEmits(['toggle-All','add-todo'])
  function addTodo(e){
    let text = e.target.value.trim()
    if(text){
      emit('add-todo',text)
      e.target.value = ''
    }
  }
</script>

<template>
  <h1>Todo</h1>
  <div>
    <input type="checkbox" :checked="isAllCompleted" @change="$emit('toggle-All')">
    <input type="text" @keyup.enter="addTodo">
  </div>
</template>

<style scoped></style>

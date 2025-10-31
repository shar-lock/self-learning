<script setup>
  import { computed } from 'vue'
  import TodoItem from './TodoItem.vue';
  const props = defineProps({
    todos:Array,
    visibleType:String,
  })
  let visibleTodos = computed(() => {
    if(props.visibleType == 'All'){
      return props.todos
    }else if(props.visibleType == 'Active'){
      return props.todos.filter(e => !e.completed)
    }else{
      return props.todos.filter(e => e.completed)
    }
  })
  defineEmits(['todo-status-change','delete-todo'])
</script>

<template>
  <ul>
    <TodoItem v-for="(todo,i) of visibleTodos" :todo="todo" @status-change="$emit('todo-status-change',todo.id)" @delete="$emit('delete-todo',todo.id)"></TodoItem>
  </ul>
</template>

<style scoped></style>

<script setup>
import { useTodos } from './stores/todos';

  let store = useTodos()
</script>

<template>
  <div>
   <span>{{ store.leftcount }} item{{ store.leftcount > 1 ? 's' :'' }} left</span>
   <div>
    <label><input type="radio" name="visible" value="all" v-model="store.visibleType">All</label>
    <label><input type="radio" name="visible" value="active" v-model="store.visibleType">Active</label>
    <label><input type="radio" name="visible" value="completed" v-model="store.visibleType">Completed</label>
   </div>
   <button v-if="store.hasCompleted" @click="store.clearCompleted">clear completed</button>
  </div>
</template>

<style scoped></style>

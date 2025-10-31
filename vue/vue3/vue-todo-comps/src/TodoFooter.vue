<script setup>
  import { computed } from 'vue'
  let props = defineProps(['todos','visibleType'])
  defineEmits(['visibleType-change'])
  let showClearButton = computed(()=>props.todos.some(e=>e.completed))
  let Actnums = computed(()=>props.todos.filter(e=>!e.completed).length)
</script>

<template>
  <div>
   <span>{{ Actnums }} item{{ Actnums > 1 ? 's': '' }} left</span>
   <div>
    <label><input type="radio" name="visible" :checked="visibleType == 'All'" @click="$emit('visibleType-change','All')">All</label>
    <label><input type="radio" name="visible" :checked="visibleType == 'Active'" @click="$emit('visibleType-change','Active')">Active</label>
    <label><input type="radio" name="visible" :checked="visibleType == 'Completed'" @click="$emit('visibleType-change','Completed')">Completed</label>
   </div>
   <button v-show="showClearButton">clear completed</button>
  </div>
</template>

<style scoped></style>

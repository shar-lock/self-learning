<script setup>
 defineProps({
  todo:Object,
 })
 defineEmits(['delete','status-change'])
</script>

<template>
  <li>
    <!-- <input type="checkbox" v-model="todo.completed"> -->
    <input type="checkbox" :checked="todo.completed" @input="$emit('status-change')">
    <span>{{ todo.text }}</span>
    <button @click="$emit('delete')">x</button>
  </li>
</template>

<style scoped></style>

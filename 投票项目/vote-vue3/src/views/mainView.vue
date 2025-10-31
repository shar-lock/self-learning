<template>
  <Suspense>
    <template #fallback>Loading</template>
    <App/>
 </Suspense>
</template>

<script setup lang="ts">
import App from '@/App.vue'
</script>

  
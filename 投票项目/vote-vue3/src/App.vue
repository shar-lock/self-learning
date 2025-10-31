<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useVoteStore } from '@/stores/vote'
let voteStore = useVoteStore()
await voteStore.getUserInfo()
</script>

<template>
  <RouterView />
</template>


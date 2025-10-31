<template>
  <main class="flex flex-col h-screen">
    <RouterView class="grow"/>  
    <div class="flex h-12">
      <RouterLink to="select-create" class="basis-0 grow flex flex-col items-center">
        <span>➕</span>
        <span>创建投票</span>
      </RouterLink>
      <RouterLink to="/me" class="basis-0 grow flex flex-col items-center">
        <span>👨</span>
        <span>我的</span>
      </RouterLink>
    </div>
  </main>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useVoteStore } from '@/stores/vote';
let voteStore = useVoteStore()
onMounted(async ()=>{
  // try{
  //   let user = await fetch('/api/account/current-user').then(res=>res.json())
  //   voteStore.setUser(user)
  // }catch(err){
  //   console.log('No user logged in');
  // }
})
</script>
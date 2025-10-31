<template>
  <div class="flex flex-col h-screen bg-gray-100">
      <h1 class="p-4 text-xl">
        <RouterLink to="/me">
          <  个人设置
        </RouterLink >
      </h1>

      <div class="flex items-center justify-center gap-4 p-12">
          <img class="rounded-full w-20 h-20" src="https://dummyimage.com/100x100/000/fff.png&text=U" /> 
      </div>
      
      <RouterLink class="flex items-center justify-between px-4 py-2 bg-white h-16" to="/">
        昵称
        <div>sharlock ></div>
      </RouterLink>

    <button @click="logout" class="text-blue-500 text-center w-full cursor-pointer block border border-blue-500 py-2 mt-20">
          退出登录
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '../hooks.ts';
import { useVoteStore } from '@/stores/vote';
import { useRouter } from 'vue-router';
let isLogin = useLogin()
let voteStore = useVoteStore()
let router = useRouter()
async function logout(){
  await fetch('/api/account/logout')
  voteStore.user = null
  router.push('/')
} 
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-2xl mb-4">登录</h1>
    <form class="flex flex-col w-64">
      <input
        type="text"
        placeholder="Username"
        class="mb-2 p-2 border border-gray-300 rounded"
        v-model="name"
      />
      <input
        type="password"
        placeholder="Password"
        class="mb-4 p-2 border border-gray-300 rounded"
        v-model="password"
      />
      <button
        @click="login"
        class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  </div>  
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute ,useRouter} from 'vue-router';
import { useVoteStore } from '@/stores/vote';
let name = ref('');
let password = ref('');
let route = useRoute();
let next = (route.query.next || '/') as string
let voteStore = useVoteStore()
let router = useRouter()
async function login(){
   let user
   try{
     user = await fetch('/api/account/login',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        password: password.value
      })
    }).then(res=>res.json())
    voteStore.user = user
    router.replace(next)
   }catch(err){
     console.log('Login failed',err);
     return
   }
}
</script>
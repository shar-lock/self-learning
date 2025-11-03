<template>
  <div>
    <h1 class="p-4 text-xl">
      <RouterLink to="/me">
      <  我的投票列表
      </RouterLink >
    </h1>
    <div class=" divide-y mb-16">
      <div v-for="(vote,idx) of votes" :key="vote.voteId" @click="currentIdx == idx ? currentIdx = -1 : currentIdx = idx" class="bg-white px-4 py-2">
        <div class="h-16 flex items-center hover:bg-gray-100 justify-between px-4">{{ vote.title }}<span>{{vote.desc}}</span></div>
        <div :class="{hidden: currentIdx!==idx}" class="flex items-center border-t">
          <RouterLink :to="`/vote/${vote.voteId}`" class="basis-0 grow">查看</RouterLink>
          <span class="basis-0 grow">分享</span>
          <span class="basis-0 grow cursor-pointer" @click="deleteVote(vote.voteId,idx)" >删除</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useLogin } from '../hooks.ts';
import { reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { showDialog,showConfirmDialog } from 'vant'
let isLogin =  useLogin()
let currentIdx = ref(-1)
let votes = ref<{ voteId: string; title: string,desc:string}[]>([])
if(isLogin){
  let myvote = await fetch('/api/vote').then(res=>res.json())
  votes.value = myvote.result
}
async function deleteVote(id:string,idx:number){
  try{
    await showConfirmDialog({
      message:`确认删除该投票吗？`
    })
    await fetch(`/api/vote/${id}`,{
       method:'DELETE',
     })
   let myvote = await fetch('/api/vote').then(res=>res.json())
   votes.value.splice(idx,1)
  }catch{}
}
</script>
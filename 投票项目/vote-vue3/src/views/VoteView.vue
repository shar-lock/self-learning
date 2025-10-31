<template>
  <div class="bg-gray-100 h-full flex flex-col">
    <h1 class=" py-2 mx-4 text-xl"> <RouterLink to="/select-create">腾讯投票 {{ id }}</RouterLink> </h1>
    <div class="my-8 mx-4 relative">
      <h2 class="text-3xl font-bold mb-4">{{voteInfo.vote.title}}</h2>
      <h3>{{ voteInfo.vote.desc }}<span class="text-sky-500">[{{ voteInfo.vote.multiple ? '多选' : '单选'}}]</span></h3>
      <span class="absolute top-0 bg-blue-500 flex items-center px-2 py-1 text-white rounded-md right-0 cursor-pointer">
        share📤
      </span>
    </div>
    <ul class="space-y-4">
      <li class="bg-white shadow px-4 relative h-12 flex gap-2 items-center" v-for="(option,idx) of voteInfo.options">
        <span>{{ option.content }}</span>
        <span>✔️</span>
        <span class="ml-auto">4票</span>
        <span>24.2%</span>
        <div class="absolute bottom-0 h-0.5 bg-sky-500" :style="{width:idx*10 + 50 + '%'}"></div>
       
      </li>
    </ul>
    <div class="flex justify-between px-4 py-2 bg-white h-12 text-slate-500 items-center"> 
      <span>投票截止：{{ voteInfo.vote.deadline }}</span>
      <span>吐个槽</span>
    </div>
    <button  class=" cursor-pointer w-full bg-sky-500 text-white py-2 rounded mt-4">完成</button>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';
  let touter = useRoute()
  let id = touter.params.id
  let res = await fetch(`/api/vote/${id}`).then(res=>res.json())
  let voteInfo = ref(res.result)
  
</script>
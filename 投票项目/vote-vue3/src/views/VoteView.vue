<template>
  <div class="bg-gray-100 h-full flex flex-col">
    <h1 class=" py-2 mx-4 text-xl"> <RouterLink to="/select-create">腾讯投票 {{ id }}</RouterLink> </h1>
    <div class="my-8 mx-4 relative">
      <h2 class="text-3xl font-bold mb-4">{{voteInfo.vote.title}}</h2>
      <h3>{{ voteInfo.vote.desc }}<span class="text-sky-500">[{{ voteInfo.vote.multiple ? '多选' : '单选'}}]</span></h3>

      <span @click="showShare = true" class="absolute top-0 bg-blue-500 flex items-center px-2 py-1 text-white rounded-md right-0 cursor-pointer">
        share📤
      </span>
      <ActionSheet cancel-text="取消" description="分享到..." close-on-click-action v-model:show="showShare" :actions="actions"  />


    </div>
    <ul class="space-y-4">
      <li @click="handleOptionClick(option.optionId)" class="bg-white shadow px-4 relative h-12 flex gap-2 items-center" v-for="(option,idx) of voteInfo.options">
        <span>{{ option.content }}</span>
        <span>{{ optionChecked[option.optionId] ? '✔️' : ''}}</span>
        <span v-if="hasOneVote" class="ml-auto">{{ optionVotes[option.optionId].length ?? 0 }}票</span>
        <span v-if="hasOneVote">{{ optionPercentage[option.optionId] ?? '0%' }}</span>
        <div class="absolute bottom-0 h-0.5 bg-sky-500" :style="{width:optionPercentage[option.optionId] || '0%'}"></div>
      </li>
    </ul>
    <div class="flex justify-between px-4 py-2 bg-white h-12 text-slate-500 items-center"> 
      <span>投票截止：{{ new Date(voteInfo.vote.deadline).toLocaleString() }}</span>
      <span>吐个槽</span>
    </div>
    <button @click="submit" v-if="showBottomButton" :disabled="selectedOptionId.length == 0" class="disabled:bg-gray-500 cursor-pointer w-full bg-sky-500 text-white py-2 rounded mt-4">完成</button>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useVoteStore } from '@/stores/vote';
import { getCurrentInstance } from 'vue';
import { ActionSheet } from 'vant';
  let showShare = ref(false)
  const actions = [
      { name: '分享到朋友圈' },
      { name: '发送给朋友' },
      { name: '复制链接' },
    ];
  type voteInfoType = {
    vote:any,
    options:any
    userVotes:any
  }
  const instance = getCurrentInstance();

  let touter = useRoute()
  let id = touter.params.id
  let voteStore = useVoteStore()
  let res = await fetch(`/api/vote/${id}`).then(res=>res.json())
  let voteInfo = ref<voteInfoType>(res.result)
  // 统计每个选项的投票情况
  let optionVotes = computed(()=>{
    let everyOptionVote:any = {}
    for(let option of voteInfo.value.options ){
      everyOptionVote[option.optionId] = voteInfo.value.userVotes.filter((userVote:any)=> userVote.optionId === option.optionId)
    }
    return everyOptionVote
  })
  //统计百分比
  let optionPercentage = computed(()=>{
    let userCount = new Set(voteInfo.value.userVotes.map((e:any) => e.userId))
    let res: Record<string, string> = {}
    for(let optionId in optionVotes.value){
     if(userCount.size==0){
      res[optionId] = '0%'
     }
     else res[optionId] = (optionVotes.value[optionId].length / userCount.size * 100).toFixed(2) + '%'
    }
    return res
  })
  

  let hasVoted = computed(()=>{
    let res:any = {}
    for(let optionId in optionVotes.value){
      res[optionId] = optionVotes.value[optionId].some((optionVote:any) => optionVote.userId === voteStore.user?.result.userId)
    }
    return res
  })
  let hasOneVote = computed(()=>{
    return Object.values(hasVoted.value).some(it => it)
  })
  let showBottomButton = computed(()=>{
    if(!voteInfo.value.vote.anonymous){
      return false
    }
    let d = new Date().toISOString()
    if(voteInfo.value.vote.deadline < d){
      return false
    }
    if(voteInfo.value.vote.anonymous && hasOneVote.value){
      return false
    }
    return true
  })
//    voteInfo "result": {
//         "vote": {
//             "voteId": 27,
//             "userId": 2,
//             "title": "1 or 2?",
//             "desc": "",
//             "deadline": "2023-09-21 09:15",
//             "anonymous": 0,
//             "multiple": 0
//         },
//         "options": [
//             {
//                 "optionId": 75,
//                 "content": "1"
//             },
//             {
//                 "optionId": 76,
//                 "content": "2"
//             }
//         ],
//         "userVotes": [
//             {
//                 "optionId": 76,
//                 "avatar": "http://localhost:8008/uploads/avatar.png",
//                 "userId": 2
//             }
//         ]
//     }
  let selectedOptionId = ref<number[]>([])

  //模板中显示对勾的数据
  let optionChecked = computed(()=>{
    if(showBottomButton.value){
      let res:any = {}
      for(let id of selectedOptionId.value){
        res[id] = true
      }
      return res
    }else{
      return hasVoted.value
    }
  })

  async function handleOptionClick(optionId:number){
    //非匿名投票
    if(!voteInfo.value.vote.anonymous){
       await fetch(`/api/vote/${voteInfo.value.vote.voteId}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          optionIds: [optionId]
        })
      })
    }else{ //匿名投票 点击仅选中该项

      if(showBottomButton.value){
        if(selectedOptionId.value.includes(optionId)){
          selectedOptionId.value = selectedOptionId.value.filter(e=>e !== optionId)
        }else{
          if(!voteInfo.value.vote.multiple){
            selectedOptionId.value = [optionId]
          }
          else selectedOptionId.value.push(optionId)
        }
      }else{
        alert('无法投票')
      }
    }
  }

  function submit(){
    fetch(`/api/vote/${voteInfo.value.vote.voteId}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          optionIds: selectedOptionId.value
        })
      })
      window.location.reload()
  }
  //webSocket
  onMounted(()=>{
    let ws = new WebSocket(`/socket.io/realtime-voteinfo/${id}`)
    // console.log(ws)
    ws.onmessage = e =>{
      let userVotes = JSON.parse(e.data)
      voteInfo.value.userVotes = userVotes
    }
  })
</script>
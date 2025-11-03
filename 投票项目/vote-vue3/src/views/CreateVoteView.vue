<template>
  <NavBar :title="`创建${type}投票`">
    <template #left>
      <RouterLink to="/">
        <Icon name="arrow-left" />返回
      </RouterLink >
    </template>
  </NavBar>
  <div class="p-2 basis-0 grow flex flex-col">
    <input type="text" v-model="title" class="w-full border-b rouunded outline-none focus:ring my-1 text-2xl" placeholder="请输入投票标题">
    <input type="text" v-model="desc" class="w-full border-b rouunded outline-none focus:ring my-1" placeholder="投票描述（可选）">
    <div v-for="(option,idx) of options" :key="idx" class="flex items-center">
      <span @click="deleteOption(idx)" class="cursor-pointer w-5 h-5 ml-1 bg-red-500 font-bold text-white rounded-full flex justify-center items-center">-</span>
      <input v-model="options[idx]" type="text" class="w-full border-b rouunded outline-none focus:ring my-1" placeholder="选项">
    </div>
    <div class="flex items-center"  @click="addoption">
      <span class="cursor-pointer w-5 ml-1 h-5 bg-blue-500 font-bold text-white rounded-full flex justify-center items-center">+</span>
      <button class="my-1 p-1 text-sky-500">添加选项</button>
    </div>
    <div class="mt-4 divide-y">
      <div class="flex justify-between">
        截止日期
        <button @click="showPicker = true">{{deadDate.join('-')}} {{ deadTime.join(':') }}</button>
        <Popup v-model:show="showPicker" position="bottom" >
            <PickerGroup
              title="截止日期"
              :tabs="['选择日期', '选择时间']"
              @confirm="showPicker = false"
              @cancel="showPicker = false"
            >
            <DatePicker
                v-model="deadDate"
              />
              <TimePicker v-model="deadTime" />
            </PickerGroup>
        </Popup>
      </div>
      <div class="flex justify-between">
        匿名投票
        <el-switch v-model="anonymous" />
      </div>
    </div>
    <button  @click="create" class=" cursor-pointer w-full bg-sky-500 text-white py-2 rounded mt-4">创建投票</button>
  </div>
</template>
<script setup>
  import { ref,computed} from 'vue'
  import { useRoute,useRouter } from 'vue-router'
  import { useVoteStore } from '@/stores/vote'
  import { DatePicker , Popup,TimePicker,PickerGroup } from 'vant'
 import { NavBar,Icon } from 'vant'
  let voteStore = useVoteStore()
  let router = useRouter()
  let route = useRoute()
  let type = computed(()=>route.query.type =='singal' ? '单选' : '多选' )
  if(voteStore.user.code===-1){
    router.replace(`/login?next=${route.fullPath}`)
  }

  let showPicker = ref(false)

  let multiple = type.value === '多选'
  let title = ref('')
  let desc = ref('')
  let options = ref(['',''])
  let deadDate = ref(['2025','12','24']) //默认一周后
  let deadTime = ref(['12','00'])
  let deadline = computed(()=>{
    return new Date(deadDate.join('-') +' '+ deadTime.join(':'))
  })
  let anonymous = ref(false)
  function addoption(){
    options.value.push('')
  }
  function deleteOption(idx){
    options.value.splice(idx,1)
  }
  async function create(){
    let payload = {
      title: title.value,
      desc: desc.value,
      deadline: deadline.value,
      anonymous: anonymous.value,
      multiple: multiple,
      options: options.value.filter(opt=>opt.trim()!==''),
    }
    let res = await fetch('/api/vote',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res=>res.json())
    .catch(err=>{
      console.log('Create vote failed',err);
    })
    console.log('Create vote response',res);
    if(res.code==0){
      var id = res.result.voteId
      router.push(`/vote/${id}`)
    } else {
      voteStore.user = null
      router.push(`/login?next=${route.fullPath}`)
    }
  }
</script>
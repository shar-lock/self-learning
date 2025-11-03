<template>
  <div class="basis-0 grow flex flex-col ">
    <NavBar class="p-4 text-xl" title="我的" />
    <div class="flex items-center gap-4 p-12">
      <img class="rounded-full w-16 h-16" src="https://dummyimage.com/100x100/000/fff.png&text=U" alt="avatar"/>
      <span>sharlock</span>
    </div>
    <div class="bg-white divide-y">
      <RouterLink to="my-votes" class=" h-16 flex items-center justify-between px-4">
        我的投票
        <span>➡️</span>
      </RouterLink>
      <RouterLink to="/my-settings" class="h-16 flex items-center justify-between px-4">
        个人设置
        <span>➡️</span>
      </RouterLink>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref,computed} from 'vue'
  import { useRoute,useRouter } from 'vue-router'
  import { useVoteStore } from '@/stores/vote'
  import { NavBar } from 'vant'
  let voteStore = useVoteStore()
  let router = useRouter()
  let route = useRoute()
  if(voteStore.user ===null || voteStore.user.code===-1){
    router.replace(`/login?next=${route.fullPath}`)
  }
</script>
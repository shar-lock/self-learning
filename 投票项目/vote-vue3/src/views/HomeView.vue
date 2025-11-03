<template>
  <main class="flex flex-col h-screen">
    <RouterView/>
    <div class="flex h-12">
      <Tabbar router v-model="activeIdx">
        <TabbarItem to="/select-create" icon="plus">
          <span>创建投票</span>
        </TabbarItem>
        <TabbarItem to="/me" icon="user-circle-o">     
          <span>我的</span>
        </TabbarItem>
      </Tabbar>

      <!-- <RouterLink to="select-create" class="basis-0 grow flex flex-col items-center">
        <span>➕</span>
        <span>创建投票</span>
      </RouterLink>
      <RouterLink to="/me" class="basis-0 grow flex flex-col items-center">
        <span>👨</span>
        <span>我的</span>
      </RouterLink> -->
    </div>
  </main>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useVoteStore } from '@/stores/vote';
import { TabbarItem,Tabbar, NavBarar } from 'vant'
let voteStore = useVoteStore()
let activeIdx = ref(0)
</script>
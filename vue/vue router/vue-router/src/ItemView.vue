<template>
  <h1>商品详情</h1>
  <div>商品编号:{{ route.params.id }}</div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  let route = useRoute()
  console.log(route);
  // let itemData = ref(null)
  // onMounted(()=>{
  //   itemData.value = getItemInfo(route.params.itemId)
  // })
</script>
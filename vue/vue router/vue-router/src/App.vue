<script setup></script>

<template>
  <h1>You did it!</h1>
  <div class="nav">
    <RouterLink to="/buyer">我是买家</RouterLink>
    <RouterLink to="/seller">我是卖家</RouterLink>
  </div>

  <div>
    <RouterView />
  </div>
</template>

<style scoped>
 .nav{
  display: flex;
  gap:20px;
  margin-bottom: 20px;
 }
</style>

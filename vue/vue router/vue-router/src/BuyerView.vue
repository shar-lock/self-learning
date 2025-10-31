<template>
  <div style="display: flex; gap:20px; border: 1px solid black;">
    <aside style=" display: flex; flex-direction: column;  border-right: 1px solid black;">
      <RouterLink to='/buyer/bought'>购物车</RouterLink>
      <RouterLink to='/buyer/shouhou'>售后</RouterLink>
      <RouterLink to='/buyer/address'>地址管理</RouterLink>
    </aside>
    <div>
      <RouterView />
    </div>
  </div>
</template>
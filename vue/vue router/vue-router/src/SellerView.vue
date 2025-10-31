<template>
  <div style="display: flex; gap:20px; border: 1px solid black;">
    <aside style=" display: flex; flex-direction: column;  border-right: 1px solid black;">
      <RouterLink to='/seller/orders'>订单管理</RouterLink>
      <RouterLink to='/seller/inventory'>库存管理</RouterLink>
      <RouterLink to='/seller/delivery'>发货管理</RouterLink>
    </aside>
    <div>
      <RouterView />
    </div>
  </div>
</template>
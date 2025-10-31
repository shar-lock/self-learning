<template>
    <div class="grow">
    <RouterLink to="/create?type=singal" class="flex flex-col items-center justify-center w-full h-48"> 
      <span class="text-[80px]">📖</span>
      <span class="px-12 py-2 bg-sky-600 text-white rounded">创建单选</span>
    </RouterLink>
    <RouterLink to="/create?type=multiple" class="flex flex-col items-center justify-center w-full h-48"> 
      <span class="text-[80px]">📖</span>
      <span class="px-12 py-2 bg-sky-600 text-white rounded">创建多选</span>
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
  import backgroundImg from '@/assets/img/background.jpg'
</script>

<template>
  <div class="min-h-screen relative bg-cover bg-center" :style="{ backgroundImage: `url(${backgroundImg})` }">
    <div class="absolute inset-0 backdrop-blur-md bg-black/50"></div>
    <main class="relative z-10">
      <RouterView/>
    </main>
  </div>
</template>

<style scoped>

</style>
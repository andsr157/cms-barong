<script setup lang="ts">
const isLoading = ref(false)
const nuxtApp = useNuxtApp()

nuxtApp.hook("page:start", () => {
  isLoading.value = true
})
nuxtApp.hook("page:finish", () => {
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>
<template>
  <LoadingPage :is-loading="isLoading" />
  <UNotifications />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

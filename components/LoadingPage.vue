<script setup lang="ts">
defineProps<{
  isLoading?: boolean
}>()
</script>

<template>
  <Transition name="shrink-fade">
    <div
      v-if="isLoading"
      class="fixed flex justify-center items-center left-0 top-0 h-full w-full z-[999] bg-white"
    >
      <NuxtImg
        lazy
        src="/logo_144x144.png"
        class="animate object-contain w-20 h-20"
      />
    </div>
  </Transition>
</template>

<style>
.animate {
  animation-duration: 2s;
  animation-iteration-count: infinite;
  transform-origin: bottom;
  animation-name: bounce-6;
  animation-timing-function: ease;
}

@keyframes bounce-6 {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(1.1, 0.9) translateY(0);
  }
  30% {
    transform: scale(0.9, 1.1) translateY(-20px);
  }
  50% {
    transform: scale(1.05, 0.95) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(-7px);
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}

/* .shrink-fade-enter-active,
.shrink-fade-leave-active {
  transition: all 0.5s ease;
}
.shrink-fade-leave-to {
  opacity: 0.9;
  transform: scale(1);
  width: 32px;
  height: 32px;
  position: absolute;
  border-radius: 100%;
  margin-left: calc(50% - 16px);
  margin-top: calc(50% - 16px);
} */
</style>

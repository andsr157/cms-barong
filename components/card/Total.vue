<script setup lang="ts">
interface Props {
  label: string;
  total: number;
  icon: string;
  isTrue: boolean;
}
const props = defineProps<Props>();
const hover = ref(false);
</script>

<template>
  <div 
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :class="[
      'flex justify-between min-w-[260px] items-center h-36 shadow-lg  rounded-md px-5',
      hover
        ? 'bg-blue-700 -translate-y-3 transition-all duration-500'
        : 'bg-white',
    ]"
  >
    <div class="flex flex-col-reverse gap-3">
      <h3
        :class="[
          'font-normal text-base',
          hover ? 'text-white' : 'text-gray-700',
        ]"
      >
        {{ props.label }}
      </h3>


      <h4 v-if="props.isTrue === false"
        :class="[
          'font-semibold text-3xl',
          hover ? 'text-white' : 'text-gray-700',
        ]"
      >
        <ClientOnly>
          <AnimatedCounter
            :value="props.total"
            :duration="200"
            class="counter"
          />
        </ClientOnly>
      </h4>

      <h4 v-else
        :class="[
          'font-semibold text-3xl',
          hover ? 'text-white' : 'text-gray-700',
        ]"
      >
        <ClientOnly>
          <div class="flex gap-1">
            <span>Rp. </span>
            <AnimatedCounter
              :value="props.total"
              :duration="200"
              class="counter"
            />
          </div>
        </ClientOnly>
      </h4>

    </div>
    <div
      :class="[
        'w-10 h-10 rounded-md flex justify-center items-center',
        hover ? 'bg-white text-blue-700' : 'bg-blue-700 text-white',
      ]"
    >
      <Icon :name="props.icon" width="25" height="25" />
    </div>
  </div>
</template>

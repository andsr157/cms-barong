<script setup lang="ts">
interface Props {
    img: any,
    namePartner: string,
    rate: number,
    hover: boolean,
}
const prop = defineProps<Props>()
const colorRateStar = (hover: boolean): string => {
  return hover ? 'yellow' : 'blue'
}
</script>
<template>
          <div class="flex justify-between items-center flex-col sm:flex-row">
            <div class="flex items-center gap-3">
              <img :src="prop.img" class="rounded-full object-cover w-10 h-10" />
              <p :class="[hover ? 'text-white' : 'text-gray-700']">{{ prop.namePartner}}</p>
            </div>
            <div class="relative flex w-[112px] justify-end gap-1">
              <p :class="['p-1 rounded-md w-7 h-7 text-center', hover ? 'bg-white text-blue-700' : 'bg-blue-700 text-white']">{{ prop.rate }}</p>
              <NuxtRating
              :read-only="true"
              :rating-size="'20px'"
              :active-color="colorRateStar(prop.hover)"
              :rating-value=prop.rate
              class="absolute top-1 right-[115px] rounded-md"/>
            </div>
          </div>
</template>
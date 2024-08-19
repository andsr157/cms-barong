<script setup lang="ts">
interface Data {
  id: string
  name: string
  weight: number
}
const props = defineProps<{
  data: Data[]
}>()

const series = computed(() => {
  return props?.data.map((i) => i.weight)
})

const labels = computed(() => {
  return props?.data.map((i) => i.name)
})

const options = {
  labels: labels.value,
  plotOptions: {
    pie: {
      size: 200,
    },
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return val + "Kg"
      },
    },
  },
}
</script>

<template>
  <div class="w-full">
    <client-only>
      <apexchart
        type="donut"
        :options="options"
        :series="series"
      ></apexchart>
    </client-only>
  </div>
</template>

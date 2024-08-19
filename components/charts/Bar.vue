<script setup lang="ts">
const props = defineProps<{
  id: string
  data: number[]
}>()
const series = [
  {
    name: "transaction",
    data: props.data,
  },
]

const options = {
  chart: {
    id: props.id,
  },
  xaxis: {
    categories: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
  },
}
</script>

<template>
  <div class="w-full">
    <client-only>
      <apexchart
        type="bar"
        :options="options"
        :series="series"
      ></apexchart>
    </client-only>
  </div>
</template>

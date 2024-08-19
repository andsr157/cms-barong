<script setup lang="ts">
interface Data {
  id: string
  name: string
  weight: number
}
const props = defineProps<{
  data: Data[]
}>()

const options = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        total: {
          enabled: true,
          offsetX: 0,
          style: {
            fontSize: "13px",
            fontWeight: 900,
          },
        },
      },
    },
  },
  stroke: {
    width: 1,
    colors: ["#fff"],
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
    labels: {
      formatter: function (val: any) {
        return val + "Kg"
      },
    },
    reversed: true,
  },
  yaxis: {
    title: {
      text: undefined,
    },
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return val + "Kg"
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    offsetX: 40,
  },
}
</script>

<template>
  <div class="w-full">
    <client-only>
      <apexchart
        type="bar"
        :options="options"
        :series="props.data"
      ></apexchart>
    </client-only>
  </div>
</template>

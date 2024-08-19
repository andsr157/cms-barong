<script setup lang="ts">
import { convertToDate, getMonth } from "~/composables/helpers"
import { jsPDF } from "jspdf"
import generateTransactionTemplate from "~/composables/report/transactionTemplate"
import generateServiceFeeTemplate from "~/composables/report/serviceFeeTemplate"

const route = useRoute()

const type = route.query.type as string
const filterType = route.query.filter as string
const year = route.query.year as string
const start = route.query.start as string
const end = route.query.end as string

definePageMeta({
  layout: "blank",
})
const pdfSection = ref<HTMLElement | null>(null)
const showHtml = ref<string>("")

onMounted(async () => {
  let data: any
  let dateDetail: any
  let generatedHtml: any

  if (type === "transaction") {
    const res = (await $fetch(
      `/api/v1/report/transaction?filter=${filterType}&year=${year}&start=${start}&end=${end}`
    )) as any

    if (res && res.status === 200) {
      data = res
    }
  }

  if (type === "serviceFee") {
    const res = (await $fetch(
      `/api/v1/report/serviceFee?filter=${filterType}&year=${year}&start=${start}&end=${end}`
    )) as any

    if (res && res.status === 200) {
      data = res
    }
  }

  if (filterType === "date") {
    const startDate = convertToDate(start)
    const endDate = convertToDate(end)
    dateDetail = startDate + "-" + endDate
  } else if (filterType === "month") {
    const startDate = getMonth(parseInt(start), year)
    const endDate = getMonth(parseInt(end), year)
    dateDetail = startDate + "-" + endDate
  } else if (filterType === "year") {
    dateDetail = year
  }

  if (type === "transaction") {
    const { html } = generateTransactionTemplate(data, dateDetail)
    generatedHtml = html
  }

  if (type === "serviceFee") {
    const { html } = generateServiceFeeTemplate(data, dateDetail)
    generatedHtml = html
  }

  showHtml.value = generatedHtml

  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
    floatPrecision: 16,
  })
  if (pdfSection.value !== null) {
    doc.html(pdfSection.value, {
      html2canvas: {
        scale: 0.12,
      },
      callback: function (doc) {
        doc.save()
      },
      x: 10,
      y: 10,
    })
  }
})
</script>

<template>
  <div ref="pdfSection" v-html="showHtml" />
</template>

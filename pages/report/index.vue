<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  breadcrumbs: [{ label: "Laporan", to: "/report" }],
})

interface Year {
  name: string
  value: number
}

const loading = ref(false)
const year = ref<Year[]>()

const items = [
  {
    key: "transaksi",
    label: "Transaksi",
    value: "transaction",
  },
  {
    key: "setoran",
    label: "Setoran",
    value: "serviceFee",
  },
]

const type = ref<string>("transaction")

function onChange(index: number) {
  type.value = items[index].value
  fetchYear(type.value)
}

const fetchYear = async (type: string) => {
  try {
    const res = (await $fetch(`/api/v1/report/year/${type}`)) as any
    if (res && res.status === 200) {
      year.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  await fetchYear("transaction")
})
</script>

<template>
  <div class="mt-5">
    <div class="flex flex-col gap-y-2 mb-6">
      <h1 class="text-gray-700 text-4xl font-medium">Laporan</h1>
      <p class="text-gray-600">
        Cetak laporan transaksi dan setoran biaya layanan
      </p>
    </div>
    <UTabs :items="items" @change="onChange">
      <template #item="{ item }">
        <div class="bg-gray-100 w-full rounded-xl p-2 my-3">
          <h2 class="text-xl font-medium text-gray-700 bg-white p-3 rounded-xl">
            Cetak Laporan {{ item.label }}
          </h2>
        </div>
        <div class="flex flex-col gap-y-6" v-if="year">
          <CardReportDate
            :type="type"
            label="Filter Tanggal"
            description="Pilih rentang tanggal"
          />

          <CardReportMonth
            :year="year"
            :type="type"
            label="Filter Bulan"
            description="Pilih rentang bulan"
          />

          <CardReportYear
            :year="year"
            :type="type"
            label="Filter Tahun"
            description="Pilih tahun"
          />
        </div>
      </template>
    </UTabs>
  </div>
</template>

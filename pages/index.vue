<script setup lang="ts">
definePageMeta({
  middleware: "auth",
})
const { data: transaction } = await useFetch<number[]>(
  "/api/v1/dashboard/transaction"
)

const { data: CardTotalDashboard } = await useFetch<any>("/api/v1/dashboard")
const { data: trash } = await useFetch<any>("/api/v1/dashboard/trash")
const { data: trashCategory } = await useFetch<any>(
  "/api/v1/dashboard/trashCategory"
)

const header = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Nama Barang",
  },
  {
    key: "saleCount",
    label: "Jumlah Penjualan",
  },
]

const total = [
  {
    label: "Total users",
    total: CardTotalDashboard.value.data.totalUser,
    icon: "i-material-symbols-person-rounded",
    isTrue: false,
  },
  {
    label: "Total Item Rongsok",
    total: CardTotalDashboard.value.data.totalSubCategory,
    icon: "i-material-symbols-backpack-rounded",
    isTrue: false,
  },
  {
    label: "Total Partners",
    total: CardTotalDashboard.value.data.totalPartner,
    icon: "i-material-symbols-person-pin-rounded",
    isTrue: false,
  },
  {
    label: "Total setoran",
    total: CardTotalDashboard.value.data.totalServiceFee,
    icon: "i-solar-notebook-bold",
    isTrue: true,
  },
]
const hover = ref(false)
</script>

<template>
  <div class="flex flex-col gap-y-2 mb-5 mt-5">
    <h1 class="text-gray-700 text-4xl font-medium">Dashboard</h1>
    <p class="text-gray-600">Lihat dan Pantau Beberapa Data di Dashboard</p>
  </div>
  <div
    class="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-3 pb-5 hover:overflow-visible"
  >
    <CardTotal
      v-for="items in total"
      :label="items.label"
      :total="items.total"
      :icon="items.icon"
      :isTrue="items.isTrue"
    />
  </div>
  <div
    class="grid grid-cols-1 sm:grid-cols-4 gap-y-5 sm:gap-5 justify-center px-1"
  >
    <div
      class="shadow-lg rounded-lg sm:col-span-3 p-2 w-full hover:-translate-y-3 transition-all hover:duration-500"
    >
      <h3 class="font-semibold text-gray-700 text-lg">Data Total Transaksi</h3>
      <ChartsBar v-if="transaction" id="tr1" :data="transaction" />
    </div>

    <div
      class="row-start-1 sm:row-auto flex gap-3 flex-col sm:col-span-1 justify-start"
    >
      <div
        @mouseover="hover = true"
        @mouseleave="hover = false"
        :class="[
          'w-full h-auto sm:h-[210px] shadow-lg rounded-md p-2 flex flex-col gap-5 transition-all',
          hover ? '-translate-y-3 duration-500 bg-blue-700' : 'bg-whhite',
        ]"
      >
        <h1
          :class="[
            'font-semibold text-lg',
            hover ? 'text-white' : 'text-gray-700',
          ]"
        >
          Partner Top Rate
        </h1>
        <div class="flex flex-col font-medium text-sm gap-2">
          <CardPartnerTopRate
            v-for="item in CardTotalDashboard.data.topPartners"
            :img="item.avatar"
            :namePartner="item.name"
            :rate="item.averageRate"
            :hover="hover"
          />
        </div>
      </div>

      <div
        class="w-full h-auto shadow-lg p-2 flex flex-col justify-center hover:-translate-y-3 transition-all hover:duration-500"
      >
        <h3 class="font-semibold text-lg text-gray-700 mb-3">
          Penjualan Tertinggi
        </h3>
        <UTable
          :rows="CardTotalDashboard.data.topTrashItems"
          :columns="header"
          class="border-solid border-[1px] rounded-md"
        />
      </div>
    </div>

    <div
      class="shadow-lg rounded-lg p-2 sm:col-span-2 hover:-translate-y-3 transition-all hover:duration-500"
    >
      <h3 class="font-semibold text-gray-700 text-lg">Kategori Rongsok</h3>
      <ChartsDonut :data="trashCategory" />
    </div>

    <div
      class="shadow-lg rounded-lg p-2 sm:col-span-2 hover:-translate-y-3 transition-all hover:duration-500"
    >
      <h3 class="font-semibold text-gray-700 text-lg">Data Barang Rongsok</h3>
      <ChartsStackedBar :data="trash" />
    </div>
  </div>
</template>

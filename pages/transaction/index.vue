<script setup lang="ts">
import { format } from "date-fns"

definePageMeta({
  middleware: "auth",
  breadcrumbs: [{ label: "Transaksi", to: "/transaction" }],
})

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "user",
    label: "Nama Pengguna",
  },
  {
    key: "pengepul",
    label: "Nama Pengepul",
  },
  {
    key: "finalTotalPrice",
    label: "Total Harga",
  },
  {
    key: "statusTransaksi",
    label: "Status",
  },
  {
    key: "note",
    label: "Catatan",
  },
  {
    key: "date",
    label: "Tanggal Dibuat",
  },
  {
    key: "actions",
    label: "Action",
  },
]

const getStatusColor = (statusName: string) => {
  switch (statusName) {
    case "searching":
      return "orange"
    case "taking":
      return "blue"
    case "finish":
      return "green"
    case "canceled":
      return "red"
    default:
      return "grey"
  }
}

const isOpen = ref(false)

const items = (row: any) => [
  [
    {
      label: "Detail",
      icon: "i-heroicons-eye",
      click: () => {
        transactionById(row.id)
        isOpen.value = true
      },
    },
  ],
]

const { data: transaction } = (await useFetch("/api/v1/transaction")) as any

const page = ref(1)
const pageCount = 10

const transactionData = computed(() => {
  if (transaction.value.data) {
    const startIndex = (page.value - 1) * pageCount
    const endIndex = startIndex + pageCount
    return transaction.value.data
      .slice(startIndex, endIndex)
      .map((data: any) => {
        const {
          date,
          detailSampah,
          servicePrice,
          totalPrice,
          status,
          ...transaksi
        } = data
        const { name } = status
        return {
          ...transaksi,
          statusTransaksi: name,
          formattedDate: format(new Date(date), "dd MMMM yyyy"),
        }
      })
  } else {
    return []
  }
})

const dataTransactionById = ref()
console.log(dataTransactionById)
const transactionById = (id: number) => {
  const data = transaction.value.data.filter((item: any) => {
    return item.id === id
  })
  dataTransactionById.value = data
}

const q = ref("")

const filteredRows = computed(() => {
  if (!q.value) {
    return transactionData.value
  }

  return transactionData.value.filter((person: any) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})
</script>
<template>
  <div class="flex flex-col gap-y-2 mb-6 mt-5">
    <h1 class="text-gray-700 text-4xl font-medium">Transaksi</h1>
    <p class="text-gray-600">Kelola data Transaksi</p>
  </div>
  <div class="mt-5 w-48 right-0">
    <UInput
      icon="i-heroicons-magnifying-glass-20-solid"
      size="md"
      color="blue"
      :trailing="false"
      placeholder="Search..."
      v-model="q"
      variant="outline"
    />
  </div>

  <UTable
    :rows="filteredRows"
    :columns="columns"
    class="mt-5 border-solid border-[1px] rounded-md"
  >
    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-ellipsis-horizontal-20-solid"
        />
      </UDropdown>
    </template>
    <template #statusTransaksi-data="{ row }" :ui="{ td: 'p-2' }">
      <UBadge
        size="xs"
        :label="row.statusTransaksi"
        :color="getStatusColor(row.statusTransaksi)"
        :ui="{ rounded: 'rounded-full' }"
        class="w-[70px] h-auto text-center flex items-center justify-center"
      />
    </template>
    <template #date-data="{ row }">
      {{ row.formattedDate }}
    </template>
  </UTable>

  <div
    v-if="transaction.data"
    class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
  >
    <UPagination
      v-model="page"
      :page-count="pageCount"
      :total="transaction.data.length"
    />
  </div>

  <UModal v-model="isOpen" prevent-close>
    <div class="p-7 flex flex-col gap-4">
      <div class="flex justify-between items-center px-1">
        <h1 class="font-semibold">Detail Transaksi</h1>
        <Icon
          @click="isOpen = false"
          name="i-material-symbols-cancel"
          width="25"
          height="25"
          color="black"
          class="delay-150 ease-in-out hover:scale-125"
        />
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex gap-2 justify-between px-2">
          <ul class="px-5">
            <li
              v-for="data in dataTransactionById[0].detailSampah"
              class="text-sm list-disc"
            >
              {{ data.category }} | {{ data.subcategory }}
            </li>
          </ul>
          <ul>
            <li
              v-for="data in dataTransactionById[0].detailSampah"
              class="text-sm text-center"
            >
              {{ data.weight }} Kg
            </li>
          </ul>
        </div>
        <div class="bg-blue-700 rounded-lg p-3 flex justify-between">
          <div class="flex flex-col text-sm text-white">
            <h1>Total Harga</h1>
            <h1>Biaya Layanan</h1>
            <br />
            <h1 class="font-semibold">Pendapatan</h1>
          </div>
          <div class="flex flex-col text-sm text-white text-end">
            <h1>{{ dataTransactionById[0].totalPrice }}</h1>
            <h1>{{ dataTransactionById[0].servicePrice }}</h1>
            <br />
            <h1 class="font-semibold">
              {{ dataTransactionById[0].finalTotalPrice }}
            </h1>
          </div>
        </div>
      </div>
    </div>
  </UModal>
</template>

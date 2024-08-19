<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  breadcrumbs: [{ label: "Biaya Layanan", to: "/servicefee" }],
})

const toast = useToast()

const columns = [
  {
    key: "id",
    label: "Id Setoran",
  },
  {
    key: "partner",
    label: "Nama Pengepul",
  },
  {
    key: "totalFee",
    label: "Total",
  },
  {
    key: "lackOfFee",
    label: "Kekurangan",
  },
  {
    key: "actions",
    label: "Action",
  },
]

interface ServiceFee {
  id: string
  users: {
    id: string
    name: string
  }
  totalFee: number
  lackOfFee: number
}

const mode = ref("add")
const isLoading = ref(false)
const isModalOpen = ref(false)
const dataServiceFee = ref<ServiceFee[]>([])
const singleDataServiceFee = ref<ServiceFee[] | null>()

const search = ref("")

const filteredRows = computed(() => {
  if (!search.value) {
    return dataServiceFee.value
  }

  return dataServiceFee.value.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(search.value.toLowerCase())
    })
  })
})

const deleteSetoran = async (id: string) => {
  try {
    const res = (await $fetch(`/api/v1/serviceFee/${id}`, {
      method: "DELETE",
    })) as any
    if (res && res.status === 200) {
      if (dataServiceFee.value) {
        console.log(id)
        dataServiceFee.value = dataServiceFee.value.filter(
          (data: any) => data.id !== id
        )
      }
      toast.add({
        title: "Hapus Data Setoran Berhasil!",
        icon: "i-heroicons-check-circle",
        timeout: 1500,
      })
    } else {
      toast.add({
        title: "Hapus Data Setoran gagal!",
        icon: "i-heroicons-check-circle",
        timeout: 1500,
      })
    }
  } catch (error) {
    console.error(error)
    toast.add({
      title: "Hapus Data Setoran gagal!",
      icon: "i-heroicons-check-circle",
      timeout: 1500,
    })
  }
}
const actionsItem = (row: any) => [
  [
    {
      label: "edit",
      icon: "i-heroicons-eye",
      click: () => {
        mode.value = "edit"
        getSingleData(row.id)
        isModalOpen.value = true
      },
    },
    {
      label: "delete",
      icon: "i-heroicons-trash",
      click: () => {
        deleteSetoran(row.id)
      },
    },
  ],
]

const fetchData = async () => {
  try {
    isLoading.value = true
    const res = (await $fetch("/api/v1/serviceFee")) as any

    if (res && res.status === 200) {
      dataServiceFee.value = res.data
    }
    isLoading.value = false
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}

const getSingleData = (id: string) => {
  if (dataServiceFee && mode.value === "edit") {
    const filteredData = dataServiceFee.value.filter(
      (data: any) => data.id === id
    )
    singleDataServiceFee.value = filteredData
  } else {
    singleDataServiceFee.value = null
  }
}

const openAddModal = () => {
  mode.value = "add"
  isModalOpen.value = true
}

const submitedData = (value: any) => {
  console.log(value)
  if (value) {
    if (mode.value === "add") {
      dataServiceFee.value.push(value)
      isModalOpen.value = false
      toast.add({
        title: "Tambah Data Setoran Berhasil!",
        icon: "i-heroicons-check-circle",
        timeout: 1500,
      })
    } else if (mode.value === "edit") {
      const indexData = dataServiceFee.value.findIndex(
        (data: any) => data.id === value.id
      )
      if (indexData !== -1) {
        dataServiceFee.value[indexData] = {
          ...dataServiceFee.value[indexData],
          ...value,
        }
        isModalOpen.value = false
        toast.add({
          title: "Edit Data Setoran Berhasil!",
          icon: "i-heroicons-check-circle",
          timeout: 1500,
        })
      }
    }
  }
}

const errorSubmitedData = (value: any) => {
  if (value) {
    isModalOpen.value = false
    if (mode.value === "add") {
      toast.add({
        title: "Tambah Data Setoran Gagal!",
        icon: "i-heroicons-check-circle",
        timeout: 1500,
      })
    } else if (mode.value === "edit") {
      toast.add({
        title: "Edit Data Setoran Gagal!",
        icon: "i-heroicons-check-circle",
        timeout: 1500,
      })
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <ModalServiceFee
    :mode="mode"
    :editData="singleDataServiceFee"
    :isOpen="isModalOpen"
    :isLoading="isLoading"
    @close="isModalOpen = false"
    @submitData="submitedData"
    @errorSubmitData="errorSubmitedData"
  />
  <div class="flex flex-col gap-y-2 mb-6 mt-5">
    <h1 class="text-gray-700 text-4xl font-medium">Setoran Biaya Layanan</h1>
    <p class="text-gray-600">Kelola data setoran biaya layanan pengepul</p>
  </div>
  <div class="border-[1px] border-gray-200 dark:border-gray-700 rounded-xl">
    <div
      class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
    >
      <UInput v-model="search" placeholder="search.." />
      <UButton
        icon="i-heroicons-user-plus"
        size="md"
        color="blue"
        variant="solid"
        label="Tambah"
        :trailing="false"
        @click="openAddModal"
      />
    </div>
    <UTable :rows="filteredRows" :columns="columns" :loading="isLoading">
      <template #loading-state>
        <div class="flex items-center justify-center h-32">
          <i class="loader --6" />
        </div>
      </template>
      <template #partner-data="{ row }">
        <td>
          {{ row.users.name }}
        </td>
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="actionsItem(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>
  </div>
</template>

<style scoped>
.loader {
  --color: rgb(var(--color-primary-400));
  --size-mid: 6vmin;
  --size-dot: 1.5vmin;
  --size-bar: 0.4vmin;
  --size-square: 3vmin;

  display: block;
  position: relative;
  width: 50%;
  display: grid;
  place-items: center;
}

.loader::before,
.loader::after {
  content: "";
  box-sizing: border-box;
  position: absolute;
}

.loader.--6::before {
  width: var(--size-square);
  height: var(--size-square);
  background-color: var(--color);
  top: calc(50% - var(--size-square));
  left: calc(50% - var(--size-square));
  animation: loader-6 2.4s cubic-bezier(0, 0, 0.24, 1.21) infinite;
}

@keyframes loader-6 {
  0%,
  100% {
    transform: none;
  }

  25% {
    transform: translateX(100%);
  }

  50% {
    transform: translateX(100%) translateY(100%);
  }

  75% {
    transform: translateY(100%);
  }
}
</style>

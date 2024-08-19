<script setup lang="ts">
interface Props {
  isOpen: boolean
}

const emit = defineEmits(["close", "getUser"])

const columns = [
  {
    key: "id",
    label: "Id Pengepul",
  },
  {
    key: "name",
    label: "Nama Pengepul",
  },
  {
    key: "address",
    label: "Alamat",
  },
  {
    key: "telp",
    label: "Telepon",
  },
  {
    key: "actions",
    label: "Action",
  },
]

const data = ref<any>()
const search = ref("")
const isLoading = ref(false)

const filteredRows = computed(() => {
  if (!search.value) {
    return data.value
  }

  return data.value.filter((person: any) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(search.value.toLowerCase())
    })
  })
})

const fetchData = async () => {
  try {
    isLoading.value = true
    const res = (await $fetch("/api/v1/user/partner")) as any
    if (res && res.status === 200) {
      data.value = res.data
    }
    isLoading.value = false
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}

const closeUserModal = () => {
  emit("close")
}

const props = defineProps<Props>()

const pickUser = async (id: string) => {
  let partnerName
  let partnerId
  if (data) {
    const findIndex = data.value.findIndex((data: any) => data.id === id)
    partnerName = data.value[findIndex].name
    partnerId = data.value[findIndex].id
  }
  try {
    const res = (await $fetch(`/api/v1/serviceFee/current/${id}`)) as {
      currentMonthService: number
      lackOfFee: number
    }
    if (res) {
      emit("getUser", {
        serviceFee: res.currentMonthService,
        lackOfFee: res.lackOfFee,
        name: partnerName,
        partnerId: partnerId,
      })
      emit("close")
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <UModal v-model="props.isOpen" prevent-close fullscreen>
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: 'grow',
        },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-xl font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Cari dan Pilih Pengepul
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="closeUserModal"
          />
        </div>
      </template>

      <div class="w-[30%] mb-5">
        <UInput v-model="search" placeholder="search.." />
      </div>

      <UTable :rows="filteredRows" :columns="columns" :loading="isLoading">
        <template #loading-state>
          <div class="flex items-center justify-center h-32">
            <i class="loader --6" />
          </div>
        </template>
        <template #address-data="{ row }">
          {{ row.address[0]?.address_name }}
        </template>
        <template #actions-data="{ row }">
          <UButton
            color="primary"
            variant="ghost"
            icon="i-heroicons-arrow-right-circle-16-solid"
            @click="pickUser(row.id)"
          />
        </template>
      </UTable>
    </UCard>
  </UModal>
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

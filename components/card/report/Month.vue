<script setup lang="ts">
import { MONTH } from "./month"

interface Year {
  name: string
  value: number
}

interface Props {
  label: string
  description: string
  type: string
  year: Year[]
}

const props = defineProps<Props>()

const selectedYear = ref<number>()

const startMonth = ref<number>()
const endMonth = ref<number>()

const onSubmit = () => {
  if (selectedYear.value && startMonth.value && endMonth.value) {
    useRouter().push(
      `/report/print?type=${props.type}&filter=month&year=${selectedYear.value}&start=${startMonth.value}&end=${endMonth.value}`
    )
  }
}
</script>

<template>
  <UCard @submit.prevent="() => onSubmit()">
    <template #header>
      <p
        class="text-base font-semibold leading-6 text-gray-700 dark:text-white"
      >
        {{ props.label }}
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ props.description }}
      </p>
    </template>

    <div class="space-y-3">
      <UForm class="flex flex-col gap-3">
        <UFormGroup label="Pilih Tahun" name="trashCategory">
          <USelect
            v-model="selectedYear"
            :options="props.year"
            option-attribute="name"
            placeholder="Tahun"
          />
        </UFormGroup>
        <UFormGroup label="Pilih Bulan Awal" name="trashCategory">
          <USelect
            v-model="startMonth"
            :options="MONTH"
            option-attribute="name"
            placeholder="Bulan Awal"
          />
        </UFormGroup>

        <UFormGroup label="Pilih Bulan Akhir" name="trashCategory">
          <USelect
            v-model="endMonth"
            :options="MONTH"
            option-attribute="name"
            placeholder="Bulan Akhir"
          />
        </UFormGroup>
      </UForm>
    </div>

    <template #footer>
      <UButton type="submit" class="!bg-blue-600"> Cetak </UButton>
    </template>
  </UCard>
</template>

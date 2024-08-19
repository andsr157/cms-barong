<script setup lang="ts">
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

const onSubmit = () => {
  if (selectedYear.value) {
    useRouter().push(
      `/report/print?type=${props.type}&filter=year&year=${selectedYear.value}`
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
      <UFormGroup label="Pilih Tahun" name="trashCategory">
        <USelect
          v-model="selectedYear"
          :options="props.year"
          option-attribute="name"
          placeholder="Tahun"
        />
      </UFormGroup>
    </div>

    <template #footer>
      <UButton type="submit" class="!bg-blue-600"> Cetak </UButton>
    </template>
  </UCard>
</template>

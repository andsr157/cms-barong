<script setup lang="ts">
interface Props {
  label: string
  description: string
  type: string
}

const props = defineProps<Props>()

const selectedDate = ref()

const onSubmit = () => {
  if (selectedDate) {
    useRouter().push(
      `/report/print?type=${
        props.type
      }&filter=date&start=${selectedDate.value.start.toISOString()}&end=${selectedDate.value.end.toISOString()}`
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
      <DateRangePicker v-model="selectedDate" />
    </div>

    <template #footer>
      <UButton type="submit" class="!bg-blue-600"> Cetak </UButton>
    </template>
  </UCard>
</template>

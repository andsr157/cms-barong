<script setup lang="ts">
import { object, string, number, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

interface Props {
  isOpen: boolean
  isLoading: boolean
  mode: string
  editData?: any
}

const props = defineProps<Props>()
const isModalUserOpen = ref(false)

watch(
  () => props.editData,
  (newVal, oldVal) => {
    console.log("jalan")
    if (props.mode === "edit") {
      state.id = newVal[0].id
      state.partnerId = newVal[0].users.id
      state.name = newVal[0].users.name
      state.lack = newVal[0].lackOfFee
      state.total = newVal[0].totalFee
      state.oldTotal = newVal[0].totalFee
    }
  },
  { deep: true }
)

const emit = defineEmits()
const schema = object({
  partner: string().required("Required"),
  total: number().required("Required"),
})

type Schema = InferType<typeof schema>

const state = reactive<any>({
  id: undefined,
  partnerId: undefined,
  name: undefined,
  serviceFee: undefined,
  lackOfFee: undefined,
  total: undefined,
  oldTotal: undefined,
  lack: undefined,
})

const lack = computed(() => {
  if (props.mode === "add") {
    if (
      state.total != undefined &&
      state.lackOfFee !== undefined &&
      state.serviceFee != undefined
    ) {
      const data = state.serviceFee + state.lackOfFee - state.total
      return data <= 0 ? 0 : data
    } else {
      return 0
    }
  } else if (props.mode === "edit") {
    if (state.lack === 0) {
      const data = state.oldTotal - state.total
      return data <= 0 ? 0 : data
    } else if (state.lack > 0) {
      const data = state.oldTotal - state.total
      const newLack = state.lack + data
      return newLack <= 0 ? 0 : newLack
    }
  }
})

const submitSetoran = async (payload: any) => {
  try {
    let res
    if (props.mode === "add") {
      res = (await $fetch("/api/v1/serviceFee", {
        method: "POST",
        body: payload,
      })) as { data: any; status: number; error?: any }
    } else if (props.mode === "edit") {
      res = (await $fetch("/api/v1/serviceFee", {
        method: "PUT",
        body: payload,
      })) as { data: any; status: number; error?: any }
    }
    if (res && res.status === 200) {
      emit("submitData", res.data)
      resetForm()
    }
  } catch (error) {
    console.log(error)
    emit("errorSubmitData", error)
    resetForm()
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const payload = {
    partner_id: state.partnerId,
    totalFee: state.total,
    lackOfFee: lack.value,
  }
  if (props.mode === "add") {
    submitSetoran(payload)
  } else if (props.mode === "edit") {
    submitSetoran({ id: state.id, ...payload })
  }
}

function setLackOfFee(value: any) {
  if (value) {
    console.log(value)
    state.partnerId = value.partnerId
    state.name = value.name
    state.serviceFee = value.serviceFee
    state.lackOfFee = value.lackOfFee
  }
}

function resetForm() {
  state.id = undefined
  state.partnerId = undefined
  state.name = undefined
  state.serviceFee = undefined
  state.lackOfFee = undefined
  state.total = undefined
  state.lack = undefined
}

function closeModal() {
  resetForm()
  emit("close")
}
</script>

<template>
  <ModalPickUser
    :is-open="isModalUserOpen"
    @close="isModalUserOpen = false"
    @getUser="setLackOfFee"
  />
  <UModal v-model="props.isOpen" prevent-close>
    <div class="py-7 px-5">
      <h1 class="font-semibold text-lg mb-5">{{ props.mode }} setoran</h1>
      <UForm :schema="schema" :state="state" class="space-y-4">
        <UFormGroup label="Pengepul" name="partner">
          <div class="grid grid-cols-6 border-[2px] rounded-md border-gray-200">
            <div :class="props.mode === 'add' ? 'col-span-4' : 'col-span-6'">
              <UInput v-model="state.name" variant="none" disabled />
            </div>
            <div class="col-span-2" v-if="mode === 'add'">
              <div
                class="my-1 p-[5px] rounded-md bg-primary-500 text-sm text-white text-center cursor-pointer"
                @click="isModalUserOpen = true"
              >
                Pilih Pengepul
              </div>
            </div>
          </div>
        </UFormGroup>

        <UFormGroup
          name="total_service"
          v-if="state.name && props.mode === 'add'"
        >
          <div
            class="ps-4 py-2 bg-primary text-white dark:bg-white dark:text-black rounded-md"
          >
            <h3 class="text-md font-semibold">Rincian</h3>
            <p class="mt-1 text-sm">
              Biaya layanan Bulan Ini:
              <span class="font-semibold">Rp.{{ state.serviceFee }}</span>
            </p>
            <p class="mt-1 text-sm">
              Kekurangan Sebelumnya:
              <span class="text-sm font-semibold">
                Rp.{{ state.lackOfFee }}
              </span>
            </p>
          </div>
        </UFormGroup>

        <UFormGroup label="Total Setoran" name="total">
          <UInput v-model="state.total" type="number" />
        </UFormGroup>

        <UFormGroup label="Kekurangan" name="lack">
          <UInput v-model="lack" disabled inputClass="!bg-gray-200" />
        </UFormGroup>
      </UForm>

      <div class="flex justify-end mt-5">
        <div class="flex justify-center items-center gap-3">
          <UButton color="red" variant="solid" size="md" @click="closeModal">
            Batal</UButton
          >
          <UButton
            color="primary"
            variant="solid"
            size="md"
            :loading="props.isLoading"
            @click="onSubmit"
          >
            Simpan</UButton
          >
        </div>
      </div>
    </div>
  </UModal>
</template>

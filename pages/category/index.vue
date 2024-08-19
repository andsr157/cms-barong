<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  breadcrumbs: [{ label: "Kategori", to: "/category" }],
})
const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Kategori",
  },
  {
    key: "actions",
    label: "Actions",
  },
]
import * as Yup from "yup"
const { data: categoryData } = (await useFetch("/api/v1/category/")) as any
import { type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"
const isOpenAdd = ref(false)
const isOpenEdit = ref(false)
const isLoading = ref(false)
const toast = useToast()
import axios from "axios"

const formInputAdd = ref({
  category: "",
})

const formInputEdit = ref({
  id: "",
  category: "",
})

const filterCategoryData = () => {
  return categoryData.value.data.map((data: any) => {
    return data
  })
}

const schema = Yup.object({
  category: Yup.string()
    .required("Kategori Tidak Boleh Kosong")
    .min(2, "Kategori Terlalu Pendek"),
})
type Schema = InferType<typeof schema>

const items = (row: any) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square",
      click: () => {
        isOpenEdit.value = true
        categoryById(row.id)
      },
    },
    {
      label: "Hapus",
      icon: "i-heroicons-trash",
      click: async () => {
        const res = await axios.delete(`/api/v1/category/${row.id}`)
        if (res.data && res.data.status === 200) {
          categoryData.value.data = categoryData.value.data.filter(
            (data: any) => data.id !== res.data.data.id
          )
          toast.add({
            title: "Hapus Data Kategori Berhasil!",
            icon: "i-heroicons-check-circle",
            timeout: 1500,
          })
        } else {
          console.log("gagal")
          toast.add({
            title: "Hapus Data Kategori Gagal atau Data Sudah Berelasi!",
            icon: "i-heroicons-exclamation-circle-20-solid",
            timeout: 1500,
            color: "red",
          })
        }
      },
    },
  ],
]

const categoryById = (id: number) => {
  const data = categoryData.value.data.find((item: any) => {
    return item.id === id
  })
  console.log("id", data.id)
  formInputEdit.value.id = data.id
  formInputEdit.value.category = data.name
}

const onSubmitEdit = async () => {
  try {
    const payload = {
      id: formInputEdit.value.id,
      name: formInputEdit.value.category,
    }
    isLoading.value = true
    console.log("ini data edit", payload)
    const res = await axios.put("/api/v1/category/", payload)
    if (res.data) {
      const { data: updatedCategoryData } = await useFetch("/api/v1/category")
      categoryData.value = updatedCategoryData.value
      isLoading.value = false
      toast.add({
        title: "Edit Data Kategori Berhasil!",
        icon: "i-heroicons-check-circle",
        timeout: 1500,
      })
      isOpenEdit.value = false
    } else {
      toast.add({
        title: "Gagal Edit Data Kategori!",
        icon: "i-heroicons-exclamation-circle-20-solid",
        timeout: 1500,
        color: "red",
      })
      isLoading.value = false
    }
  } catch (error) {
    console.log(error)
    isLoading.value = true
  }
}

const q = ref("")
const filteredDataCategory = () => {
  if (!q.value) {
    return filterCategoryData()
  }

  return categoryData.value.data.filter((person: any) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
}

async function onSubmitAdd(event: FormSubmitEvent<Schema>) {
  try {
    const payload = {
      name: formInputAdd.value.category,
    }
    console.log("ini data", payload)
    isLoading.value = true
    const res = await axios.post("/api/v1/category/", payload)
    if (res.data) {
      const { data: updateCategoryData } = await useFetch("/api/v1/category/")
      categoryData.value = updateCategoryData.value
      isLoading.value = false
      formInputAdd.value.category = ""
      toast.add({
        title: "Tambah Data Kategori Berhasil!",
        icon: "i-heroicons-check-circle",
        timeout: 1500,
      })
      isOpenAdd.value = false
    } else {
      toast.add({
        title: "Gagal Menambah Data Kategori!",
        icon: "i-heroicons-exclamation-circle-20-solid",
        timeout: 1500,
        color: "red",
      })
      isLoading.value = false
    }
  } catch (error) {
    toast.add({
      title: "Data Kategori Tidak Boleh Kosong!",
      icon: "i-heroicons-exclamation-circle-20-solid",
      timeout: 1500,
      color: "red",
    })
    isLoading.value = false
  }
}

const clearFormAdd = () => {
  formInputAdd.value.category = ""
  isOpenAdd.value = false
}
</script>
<template>
  <div class="flex flex-col gap-y-2 mb-5 mt-5">
    <h1 class="text-gray-700 text-4xl font-medium">Kategori Barang</h1>
    <p class="text-gray-600">Kelola data Kategori Barang</p>
  </div>
  <div class="mt-5 flex gap-1 justify-between">
    <UInput
      icon="i-heroicons-magnifying-glass-20-solid"
      size="md"
      color="blue"
      :trailing="false"
      placeholder="Search..."
      v-model="q"
      variant="outline"
    />
    <NuxtLink @click="isOpenAdd = true">
      <UButton
        icon="i-heroicons-user-plus"
        size="md"
        color="blue"
        variant="solid"
        label="Tambah"
        :trailing="false"
      />
    </NuxtLink>
  </div>

  <!-- data tabel -->
  <UTable
    :rows="filteredDataCategory()"
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
  </UTable>

  <!-- Modal Add Category -->
  <UModal v-model="isOpenAdd" prevent-close>
    <div class="py-7 px-5 flex flex-col gap-3">
      <h1 class="font-semibold text-lg">Tambah Kategori</h1>

      <!-- input Kategori -->
      <UForm
        :schema="schema"
        :state="formInputAdd"
        class="flex flex-col gap-3"
        @submit="onSubmitAdd"
      >
        <UFormGroup label="Kategori" name="category">
          <UInput
            v-model="formInputAdd.category"
            type="text"
            placeholder="Masukkan Kategori"
          />
        </UFormGroup>

        <div class="flex justify-end mt-5">
          <div class="flex justify-center items-center gap-3">
            <UButton
              color="red"
              variant="solid"
              size="md"
              @click="clearFormAdd"
            >
              Batal</UButton
            >
            <UButton
              color="primary"
              variant="solid"
              size="md"
              :loading="isLoading"
              type="submit"
            >
              Simpan</UButton
            >
          </div>
        </div>
      </UForm>
    </div>
  </UModal>

  <!-- Modal Edit Category -->
  <UModal v-model="isOpenEdit" prevent-close>
    <div class="py-7 px-5 flex flex-col gap-3">
      <h1 class="font-semibold text-lg">Edit Kategori</h1>

      <!-- input Kategori -->
      <UForm
        :schema="schema"
        :state="formInputEdit"
        class="flex flex-col gap-3"
      >
        <UFormGroup label="Kategori" name="category">
          <UInput
            v-model="formInputEdit.category"
            type="text"
            placeholder="Masukkan Kategori"
          />
        </UFormGroup>

        <div class="flex justify-end mt-5">
          <div class="flex justify-center items-center gap-3">
            <UButton
              color="red"
              variant="solid"
              size="md"
              @click="isOpenEdit = false"
            >
              Batal</UButton
            >
            <UButton
              color="primary"
              variant="solid"
              size="md"
              :loading="isLoading"
              @click="onSubmitEdit"
            >
              Simpan</UButton
            >
          </div>
        </div>
      </UForm>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import type { ApiCategoryBody, Category } from "~/type/category.type"
import type { ApiItemBody, Item } from "~/type/item.type"
import type { ApiUnitBody, Unit } from "~/type/unit.type"
import type { FormSubmitEvent } from "#ui/types"
import axios from "axios"
import * as Yup from "yup"

const isOpenAdd = ref(false)
const isOpenEdit = ref(false)
const isLoading = ref(false)
const toast = useToast()
const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Nama Barang",
  },
  {
    key: "minPrice",
    label: "Minimal Harga",
  },
  {
    key: "maxPrice",
    label: "Maksimal Harga",
  },
  {
    key: "unit",
    label: "Unit",
  },
  {
    key: "category",
    label: "Kategori",
  },
  {
    key: "actions",
    label: "Actions",
  },
]

const { data: barang } = await useFetch<ApiItemBody>("/api/v1/barang")

const { data: kategori } = await useFetch<ApiCategoryBody>("/api/v1/category")
const dataKategori = kategori?.value?.data?.map((item: Category) => {
  return { name: item.name, value: item.id }
})

const { data: unit } = await useFetch<ApiUnitBody>("/api/v1/unit")
const dataUnit = unit?.value?.data?.map((item: Unit) => {
  return { name: item.name, value: item.id }
})
const schema = Yup.object({
  name: Yup.string()
    .required("Barang Tidak Boleh Kosong")
    .min(2, "Barang Terlalu Pendek"),
  minPrice: Yup.number()
    .integer("Minimal Harga Harus Angka")
    .required("Minimal Harga Tidak Boleh Kosong"),
  maxPrice: Yup.number()
    .integer("Maksimal Harga Harus Angka")
    .required("Maksimal Harga Tidak Boleh Kosong"),
  category: Yup.string().required("Kategori Tidak Boleh Kosong"),
  unit: Yup.string().required("Unit Tidak Boleh Kosong"),
})

type Schema = Yup.InferType<typeof schema>

interface FormInput {
  id?: string | null
  name: string
  minPrice: number | null
  maxPrice: number | null
  category: string | null
  unit: string | null
}

const formInputAdd = ref<FormInput>({
  name: "",
  minPrice: null,
  maxPrice: null,
  category: null,
  unit: null,
})

const formInputEdit = ref<FormInput>({
  id: null,
  name: "",
  minPrice: null,
  maxPrice: null,
  category: null,
  unit: null,
})

const deleteItem = async (id: string) => {
  try {
    const res = await axios.delete(`/api/v1/barang/${id}`)
    if (res.data && res.data.status === 200) {
      if (barang.value) {
        console.log(id)
        barang.value.data = barang.value.data.filter(
          (data: Item) => data.id !== id
        )
      }
      toast.add({
        title: "Hapus Data barang Berhasil!",
        icon: "i-heroicons-check-circle",
        timeout: 1500,
      })
    } else {
      toast.add({
        title: "Hapus Data barang gagal!",
        icon: "i-heroicons-check-circle",
        timeout: 1500,
      })
    }
  } catch (error) {
    console.log(error)
    toast.add({
      title: "Hapus Data barang gagal!",
      icon: "i-heroicons-check-circle",
      timeout: 1500,
    })
  }
}

const items = (row: any) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square",
      click: () => {
        isOpenEdit.value = true
        barangById(row.id)
      },
    },
    {
      label: "Hapus",
      icon: "i-heroicons-trash",
      click: () => {
        deleteItem(row.id)
      },
    },
  ],
]

const search = ref("")
const page = ref(1)
const pageCount = 10

const formattedBarang = computed(() => {
  if (barang.value?.data) {
    const startIndex = (page.value - 1) * pageCount
    const endIndex = startIndex + pageCount
    return barang?.value?.data.slice(startIndex, endIndex).map((data: any) => {
      const { category, ...restdata } = data
      return {
        ...restdata,
        category: category.name,
      }
    })
  } else {
    return []
  }
})

const filteredDataBarang = computed(() => {
  if (!search.value) {
    return formattedBarang.value
  }
  return formattedBarang?.value?.filter((person: any) =>
    Object.values(person).some((value) =>
      String(value).toLowerCase().includes(search.value.toLowerCase())
    )
  )
})

const barangById = (id: number) => {
  const data = barang?.value?.data.find((item: any) => {
    return item.id === id
  })
  formInputEdit.value.id = data?.id
  formInputEdit.value.name = data?.name ?? ""
  formInputEdit.value.minPrice = data?.minPrice ?? 0
  formInputEdit.value.maxPrice = data?.maxPrice ?? 0
  formInputEdit.value.category = data?.category?.id ?? ""
  formInputEdit.value.unit = data?.unit?.id ?? ""
}

async function onSubmitAdd(event: FormSubmitEvent<Schema>) {
  try {
    const payload = {
      name: formInputAdd.value.name,
      minPrice: formInputAdd.value.minPrice,
      maxPrice: formInputAdd.value.maxPrice,
      category_id: formInputAdd.value.category,
      unit_id: formInputAdd.value.unit,
    }
    isLoading.value = true
    const res = await axios.post("/api/v1/barang/", payload)
    if (res.data) {
      formInputAdd.value.name = ""
      formInputAdd.value.minPrice = null
      formInputAdd.value.maxPrice = null
      formInputAdd.value.category = null
      formInputAdd.value.unit = null
      if (barang.value) {
        barang.value.data.push(res.data.data)
      }
      isLoading.value = false
      isOpenAdd.value = false
      toast.add({
        title: "Berhasil Menambah Data Barang!",
        icon: "i-heroicons-check-circle",
        timeout: 1500,
        color: "green",
      })
    } else {
      toast.add({
        title: "Gagal Menambah Data Barang!",
        icon: "i-heroicons-exclamation-circle-20-solid",
        timeout: 1500,
        color: "red",
      })
      isLoading.value = false
    }
  } catch (error) {
    console.log(error)
  }
}

async function onSubmitEdit(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true
    const payload = {
      id: formInputEdit.value.id,
      name: formInputEdit.value.name,
      minPrice: formInputEdit.value.minPrice,
      maxPrice: formInputEdit.value.maxPrice,
      category_id: formInputEdit.value.category,
      unit_id: formInputEdit.value.unit,
    }
    const res = await axios.put("/api/v1/barang/", payload)
    if (res.data) {
      if (barang.value) {
        const indexData = barang.value.data.findIndex(
          (data) => data.id === res.data.data.id
        )
        if (indexData !== -1) {
          barang.value.data[indexData] = {
            ...barang.value.data[indexData],
            ...res.data.data,
          }
        }
      }
      isLoading.value = false
      isOpenEdit.value = false
      toast.add({
        title: "Berhasil Mengedit Data Barang!",
        icon: "i-heroicons-check-circle",
        timeout: 1500,
        color: "green",
      })
    } else {
      isLoading.value = false
    }
  } catch (error) {
    console.log(error)
  }
}

const clearFormAdd = () => {
  formInputAdd.value.name = ""
  formInputAdd.value.maxPrice = null
  formInputAdd.value.category = null
  formInputAdd.value.minPrice = null
  formInputAdd.value.unit = null
  isOpenAdd.value = false
}
</script>
<template>
  <div class="flex flex-col gap-y-2 mb-5 mt-5">
    <h1 class="text-gray-700 text-4xl font-medium">Barang</h1>
    <p class="text-gray-600">Kelola data Barang atau Sub Category Barang</p>
  </div>
  <div class="mt-5 flex gap-1 justify-between">
    <UInput
      icon="i-heroicons-magnifying-glass-20-solid"
      size="md"
      color="blue"
      :trailing="false"
      placeholder="Search..."
      v-model="search"
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

  <!-- Data Tabel -->

  <UTable
    :rows="filteredDataBarang"
    :columns="columns"
    class="mt-5 border-solid border-[1px] rounded-md"
  >
    <template #unit-data="{ row }">
      <td>{{ row.unit.name }}</td>
    </template>

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

  <div
    class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
  >
    <UPagination
      v-model="page"
      :page-count="pageCount"
      :total="barang?.data?.length"
    />
  </div>

  <!-- Modal Add -->
  <UModal v-model="isOpenAdd" prevent-close>
    <div class="py-7 px-5 flex flex-col gap-3">
      <h1 class="font-semibold text-lg">Tambah Barang</h1>

      <UForm
        :schema="schema"
        :state="formInputAdd"
        class="flex flex-col gap-3"
        @submit="onSubmitAdd"
      >
        <UFormGroup label="Barang" name="name">
          <UInput
            v-model="formInputAdd.name"
            type="text"
            placeholder="Masukkan Barang"
          />
        </UFormGroup>
        <UFormGroup label="Minimal Harga" name="minPrice">
          <UInput
            v-model="formInputAdd.minPrice"
            type="number"
            placeholder="Masukkan Minimal Harga Barang"
          />
        </UFormGroup>
        <UFormGroup label="Maksimal Harga" name="maxPrice">
          <UInput
            v-model="formInputAdd.maxPrice"
            type="number"
            placeholder="Masukkan Maksimal Harga Barng "
          />
        </UFormGroup>
        <UFormGroup label="Kategori" name="category">
          <USelect
            v-model="formInputAdd.category"
            :options="dataKategori"
            option-attribute="name"
            placeholder="Pilih Kategori"
          />
        </UFormGroup>
        <UFormGroup label="Unit" name="unit">
          <USelect
            v-model="formInputAdd.unit"
            :options="dataUnit"
            option-attribute="name"
            placeholder="Pilih Unit"
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

  <!-- Modal Edit -->
  <UModal v-model="isOpenEdit" prevent-close>
    <div class="py-7 px-5 flex flex-col gap-3">
      <h1 class="font-semibold text-lg">Edit Barang</h1>

      <!-- input Kategori -->
      <UForm
        :schema="schema"
        :state="formInputEdit"
        class="flex flex-col gap-3"
        @submit="onSubmitEdit"
      >
        <UFormGroup label="Barang" name="name">
          <UInput
            v-model="formInputEdit.name"
            type="text"
            placeholder="Masukkan Barang"
          />
        </UFormGroup>
        <UFormGroup label="Minimal Harga" name="minPrice">
          <UInput
            v-model="formInputEdit.minPrice"
            type="number"
            placeholder="Masukkan Minimal Harga Barang"
          />
        </UFormGroup>
        <UFormGroup label="Maksimal Harga" name="maxPrice">
          <UInput
            v-model="formInputEdit.maxPrice"
            type="number"
            placeholder="Masukkan Maksimal Harga Barng "
          />
        </UFormGroup>
        <UFormGroup label="Kategori" name="category">
          <USelect
            v-model="formInputEdit.category"
            :options="dataKategori"
            option-attribute="name"
            placeholder="Pilih Kategori"
          />
        </UFormGroup>
        <UFormGroup label="Unit" name="unit">
          <USelect
            v-model="formInputEdit.unit"
            :options="dataUnit"
            option-attribute="name"
            placeholder="Pilih Kategori"
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
              type="submit"
            >
              Simpan</UButton
            >
          </div>
        </div>
      </UForm>
    </div>
  </UModal>
</template>

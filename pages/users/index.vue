<script setup lang="ts">
import { v4 as uuidv4 } from "uuid"
import { createClient } from "@supabase/supabase-js"
import { format } from "date-fns"
import axios from "axios"
import * as Yup from "yup"
import { type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const config = useRuntimeConfig().app
const supabase = createClient(config.supabaseUrl, config.supabaseKey)
const router = useRoute()

definePageMeta({
  middleware: "auth",
  breadcrumbs: [{ label: "User", to: "/users" }],
})

const toast = useToast()
const isLoading = ref(false)
const isOpenAdd = ref(false)

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Nama Pengguna",
  },
  {
    key: "email",
    label: "Email Pengguna",
  },
  {
    key: "role",
    label: "Role",
  },
  {
    key: "telp",
    label: "Telepon",
  },
  {
    key: "address",
    label: "Alamat",
  },
  {
    key: "formattedCreateDate",
    label: "Tanggal Dibuat",
  },
  {
    key: "formattedUpdateDate",
    label: "Tanggal Diperbarui",
  },
  {
    key: "actions",
    label: "Action",
  },
]
const people = ["user", "partner"]

const { data: userData } = (await useFetch("/api/v1/user")) as any

// start add handle

const schema = Yup.object({
  name: Yup.string()
    .required("Nama Tidak Boleh Kosong")
    .min(2, "Nama Terlalu Pendek"),
  email: Yup.string()
    .email("Email Tidak Benar")
    .required("Email Tidak Boleh Kosong"),
  telp: Yup.string()
    .matches(/^\d+$/, "Nomor Telepon Harus Angka")
    .max(14, "Nomor Telepon Maksimal 14 Karakter")
    .required("Nomor Telepon Tidak Boleh Kosong"),
  address: Yup.string().required("Alamat Tidak Boleh Kosong"),
  role: Yup.string().required("Pilih Salah Satu Role"),
  password: Yup.string().matches(
    /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
    "Kata Sandi Harus Berisi Minimal 8 Karakter, Termasuk Satu Huruf Besar dan Satu Angka"
  ),
})

const schemaAddUser = Yup.object({
  name: Yup.string()
    .required("Nama Tidak Boleh Kosong")
    .min(2, "Nama Terlalu Pendek"),
  email: Yup.string()
    .email("Email Tidak Benar")
    .required("Email Tidak Boleh Kosong"),
  telp: Yup.string()
    .matches(/^\d+$/, "Nomor Telepon Harus Angka")
    .max(14, "Nomor Telepon Maksimal 14 Karakter")
    .required("Nomor Telepon Tidak Boleh Kosong"),
  address: Yup.string().required("Alamat Tidak Boleh Kosong"),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
      "Kata Sandi Harus Berisi Minimal 8 Karakter, Termasuk Satu Huruf Besar dan Satu Angka"
    )
    .required("Password Tidak Boleh Kosong"),
  role: Yup.string().required("Pilih Salah Satu Role"),
})

type SchemaAdd = InferType<typeof schemaAddUser>
type SchemaEdit = InferType<typeof schema>

const formInputAdd = reactive<any>({
  name: "",
  email: "",
  telp: "",
  address: "",
  password: undefined,
  role: people[0],
  image: undefined,
})

const typeInput = ref("password")
const switchVisibilityPassword = () =>
  (typeInput.value = typeInput.value === "password" ? "text" : "password")

const dataImage = ref<any>()
const dataImageEdit = ref<any>()

const dataUser = ref({
  id: "",
  name: "",
  email: "",
  telp: "",
  password: undefined,
  role: "",
  address: [{ id: "", address_name: "" }],
  avatar: "",
})

const isOpen = ref(false)

const formInput = ref({
  name: dataUser.value.name,
  email: dataUser.value.email,
  telp: dataUser.value.telp,
  password: undefined,
  address: dataUser.value.address[0].address_name,
  role: dataUser.value.role,
  image: dataUser.value.avatar,
})

const updateInput = (event: Event) => {
  const fileInput = event.target as HTMLInputElement
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    const selectedFile = fileInput.files[0]

    dataImage.value = selectedFile
    dataImageEdit.value = selectedFile
    console.log("data image edit", dataImageEdit.value)

    const reader = new FileReader()

    reader.addEventListener("load", () => {
      previewImage.value = reader.result as string
      formInputAdd.image = reader.result as string
    })

    reader.readAsDataURL(selectedFile)
  }
}

async function addUser(event: FormSubmitEvent<SchemaAdd>) {
  if (formInputAdd.role === "partner") {
    try {
      if (!dataImage.value) {
        toast.add({
          title: "Data Pengguna Tidak Boleh Kosong!",
          icon: "i-heroicons-exclamation-circle-20-solid",
          timeout: 1500,
          color: "red",
        })
        return
      }
      isLoading.value = true
      console.log("ini image yang dipilih", dataImage.value)
      const { data, error } = await supabase.storage
        .from("avatar")
        .upload(`${uuidv4()}.jpg`, dataImage.value)
      console.log(data)
      if (error) {
        console.error("Error uploading image:", error.message)
        return
      }
      const { data: publicUrlData, error: publicUrlError }: any =
        supabase.storage.from("avatar").getPublicUrl(data.path)

      if (publicUrlError) {
        console.error("Error getting public URL:", publicUrlError.message)
        return
      }
      console.log(publicUrlData.publicUrl)
      formInputAdd.image = publicUrlData.publicUrl
      const payload = {
        name: formInputAdd.name,
        email: formInputAdd.email,
        telp: formInputAdd.telp,
        password: formInputAdd.password,
        role: formInputAdd.role,
        address: formInputAdd.address,
        avatar: formInputAdd.image,
      }

      const res = await axios.post("/api/v1/user/", payload)
      if (res.data) {
        formInputAdd.name = ""
        formInputAdd.email = ""
        formInputAdd.telp = ""
        formInputAdd.password = undefined
        formInputAdd.role = people[0]
        formInputAdd.address = ""
        formInputAdd.image = ""
        const { data: updateUserData } = await useFetch("/api/v1/user/")
        userData.value = updateUserData.value
        isLoading.value = false
        toast.add({
          title: "Tambah Data Pengguna Berhasil!",
          icon: "i-heroicons-check-circle",
          timeout: 1500,
        })
        isOpenAdd.value = false
      } else {
        toast.add({
          title: "Gagal Menambah Data Pengguna!",
          icon: "i-heroicons-exclamation-circle-20-solid",
          timeout: 1500,
          color: "red",
        })
      }
      isLoading.value = false
    } catch (error) {
      console.log(error)
      isLoading.value = false
      toast.add({
        title: "Data Pengguna Tidak Boleh Kosong!",
        icon: "i-heroicons-exclamation-circle-20-solid",
        timeout: 1500,
        color: "red",
      })
    }
  } else {
    try {
      const payload = {
        name: formInputAdd.name,
        email: formInputAdd.email,
        telp: formInputAdd.telp,
        password: formInputAdd.password,
        role: formInputAdd.role,
        address: formInputAdd.address,
        avatar: "/assets/dummy-profile.png",
      }
      isLoading.value = true
      const res = await axios.post("/api/v1/user/", payload)
      if (res.data) {
        formInputAdd.name = ""
        formInputAdd.email = ""
        formInputAdd.telp = ""
        formInputAdd.password = undefined
        formInputAdd.role = people[0]
        formInputAdd.address = ""
        const { data: updateUserData } = await useFetch("/api/v1/user/")
        userData.value = updateUserData.value
        isLoading.value = false
        toast.add({
          title: "Tambah Data Pengguna Berhasil!",
          icon: "i-heroicons-check-circle",
          timeout: 1500,
        })
        isOpenAdd.value = false
      } else {
        toast.add({
          title: "Gagal Menambah Data Pengguna!",
          icon: "i-heroicons-exclamation-circle-20-solid",
          timeout: 1500,
          color: "red",
        })
        isLoading.value = false
      }
    } catch (error) {
      console.log(error)
      isLoading.value = false
      toast.add({
        title: "Data Pengguna Tidak Boleh Kosong!",
        icon: "i-heroicons-exclamation-circle-20-solid",
        timeout: 1500,
        color: "red",
      })
    }
  }
}

const clearFormAdd = () => {
  formInputAdd.name = ""
  formInputAdd.email = ""
  formInputAdd.telp = ""
  formInputAdd.address = ""
  formInputAdd.role = people[0]
  formInputAdd.password = undefined
  formInputAdd.image = ""
  previewImage.value = undefined
  formInputAdd.image = undefined
  dataImage.value = undefined
  dataImageEdit.value = undefined
  isOpenAdd.value = false
}

const clearFormEdit = () => {
  formInput.value.name = ""
  formInput.value.email = ""
  formInput.value.telp = ""
  formInput.value.address = ""
  formInput.value.role = people[0]
  formInput.value.password = undefined
  formInput.value.image = ""
  previewImage.value = undefined
  formInputAdd.image = undefined
  dataImage.value = undefined
  dataImageEdit.value = undefined
  isOpen.value = false
}

// end add handle

//action button
const items = (row: any) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square",
      click: () => {
        userDataById(row.id)
        isOpen.value = true
      },
    },
    {
      label: "Hapus",
      icon: "i-heroicons-trash",
      click: async () => {
        console.log(row.id)
        const res = await axios.delete(`/api/v1/user/${row.id}`)
        if (res.data && res.data.status === 200) {
          userData.value.data = userData.value.data.filter((data: any) => {
            return data.id !== res.data.data.id
          })
        }
        toast.add({
          title: "Hapus Data Pengguna Berhasil!",
          icon: "i-heroicons-check-circle",
          timeout: 1500,
        })
      },
    },
  ],
]
// end action button

const previewImage = ref<any>(undefined)

// and filter data user by ID and set form
const userDataById = async (id: number) => {
  const data = userData.value.data.find((item: any) => {
    return item.id === id
  })

  if (data && Array.isArray(data.address)) {
    if (data.address.length > 0 && data.address[0].is_main === true) {
      formInput.value.address = data.address[0].address_name
    } else {
      formInput.value.address = ""
    }
  } else {
    formInput.value.address = ""
  }

  dataUser.value = data
  dataUser.value.id = data.id
  formInput.value.name = data.name
  formInput.value.email = data.email
  formInput.value.telp = data.telp
  formInput.value.role = data.role
  formInput.value.image = data.avatar

  const imageBlob = await fetch(data.avatar).then((response) => response.blob())
  previewImage.value = URL.createObjectURL(imageBlob)
}

const page = ref(1)
const pageCount = 5

const filterUserDataByRole = computed(() => {
  if (!userData.value || !userData.value.data) {
    return []
  }
  const startIndex = (page.value - 1) * pageCount
  const endIndex = startIndex + pageCount
  return userData.value.data.slice(startIndex, endIndex).map((data: any) => {
    const { created_at, updated_at, ...users } = data
    const formattedCreateDate = format(new Date(created_at), "dd MMM yyyy")
    const formattedUpdateDate = updated_at
      ? format(new Date(updated_at), "dd MMM yyyy")
      : null
    return {
      ...users,
      created_at,
      updated_at,
      formattedCreateDate,
      formattedUpdateDate,
    }
  })
})

const q = ref("")
const filteredDataUser = () => {
  if (!userData.value || !userData.value.data) {
    return []
  }

  if (!q.value) {
    return filterUserDataByRole.value
  }

  return userData.value.data.filter((person: any) => {
    return Object.values(person).some((value) => {
      return (
        String(value).toLowerCase().includes(q.value.toLowerCase()) ||
        (person.created_at &&
          person.created_at.toLowerCase().includes(q.value.toLowerCase())) ||
        (person.updated_at &&
          person.updated_at.toLowerCase().includes(q.value.toLowerCase()))
      )
    })
  })
}

//edit post handle
async function onSubmit(event: FormSubmitEvent<SchemaEdit>) {
  if (formInput.value.role === "partner") {
    try {
      if (!dataImageEdit.value) {
        const payload = {
          id: dataUser.value.id,
          name: formInput.value.name,
          email: formInput.value.email,
          telp: formInput.value.telp,
          password: formInput.value.password,
          address: {
            id: dataUser.value.address[0].id,
            address_name: formInput.value.address,
          },
          role: formInput.value.role,
          avatar: formInput.value.image,
        }

        isLoading.value = true
        const res = await axios.put("/api/v1/user/", payload)
        if (res.data) {
          const { data: updateUserData } = await useFetch("/api/v1/user/")
          userData.value = updateUserData.value
          isLoading.value = false
          toast.add({
            title: "Edit Data Pengguna Berhasil!",
            icon: "i-heroicons-check-circle",
            timeout: 1500,
          })
          clearFormEdit()
        } else {
          toast.add({
            title: "Gagal Edit Data Pengguna!",
            icon: "i-heroicons-exclamation-circle-20-solid",
            timeout: 1500,
            color: "red",
          })
          isLoading.value = false
        }
      } else {
        isLoading.value = true
        const { data, error } = await supabase.storage
          .from("avatar")
          .upload(`${uuidv4()}.jpg`, dataImageEdit.value)
        console.log(data)
        if (error) {
          console.error("Error uploading image:", error.message)
          return
        }
        const { data: publicUrlData, error: publicUrlError }: any =
          supabase.storage.from("avatar").getPublicUrl(data.path)

        if (publicUrlError) {
          console.error("Error getting public URL:", publicUrlError.message)
          return
        }

        console.log(publicUrlData.publicUrl)
        formInput.value.image = publicUrlData.publicUrl
        const payload = {
          id: dataUser.value.id,
          name: formInput.value.name,
          email: formInput.value.email,
          telp: formInput.value.telp,
          password: formInput.value.password,
          address: {
            id: dataUser.value.address[0].id,
            address_name: formInput.value.address,
          },
          role: formInput.value.role,
          avatar: formInput.value.image,
        }

        const res = await axios.put("/api/v1/user/", payload)
        if (res.data) {
          const { data: updateUserData } = await useFetch("/api/v1/user/")
          userData.value = updateUserData.value
          isLoading.value = false
          toast.add({
            title: "Edit Data Pengguna Berhasil!",
            icon: "i-heroicons-check-circle",
            timeout: 1500,
          })
          clearFormEdit()
        } else {
          toast.add({
            title: "Gagal Edit Data Pengguna!",
            icon: "i-heroicons-exclamation-circle-20-solid",
            timeout: 1500,
            color: "red",
          })
        }

        isLoading.value = false
      }
    } catch (error) {
      console.log(error)
      isLoading.value = false
      toast.add({
        title: "Data Pengguna Tidak Boleh Kosong!",
        icon: "i-heroicons-exclamation-circle-20-solid",
        timeout: 1500,
        color: "red",
      })
    }
  } else {
    try {
      const payload = {
        id: dataUser.value.id,
        name: formInput.value.name,
        email: formInput.value.email,
        telp: formInput.value.telp,
        password: formInput.value.password,
        role: formInput.value.role,
        address: {
          id: dataUser.value.address[0].id,
          address_name: formInput.value.address,
        },
        avatar: "/assets/dummy-profile.png",
      }
      isLoading.value = true
      const res = await axios.put("/api/v1/user/", payload)
      if (res.data) {
        const { data: updateUserData } = await useFetch("/api/v1/user/")
        userData.value = updateUserData.value
        isLoading.value = false
        toast.add({
          title: "Edit Data Pengguna Berhasil!",
          icon: "i-heroicons-check-circle",
          timeout: 1500,
        })
        clearFormEdit()
      } else {
        toast.add({
          title: "Gagal Edit Data Pengguna!",
          icon: "i-heroicons-exclamation-circle-20-solid",
          timeout: 1500,
          color: "red",
        })
      }

      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      toast.add({
        title: "Data Pengguna Tidak Boleh Kosong!",
        icon: "i-heroicons-exclamation-circle-20-solid",
        timeout: 1500,
        color: "red",
      })
    }
  }
}
</script>
<template>
  <div class="flex flex-col gap-y-2 mb-5 mt-5">
    <h1 class="text-gray-700 text-4xl font-medium">Pengguna</h1>
    <p class="text-gray-600">Kelola data User dan Partner</p>
  </div>
  <div class="mt-5 flex gap-1 justify-between">
    <!-- Input Search -->
    <UInput
      icon="i-heroicons-magnifying-glass-20-solid"
      size="md"
      color="blue"
      :trailing="false"
      placeholder="Search..."
      v-model="q"
      variant="outline"
    />
    <!-- Button Tambah -->
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
    :rows="filteredDataUser()"
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
    <template #address-data="{ row }">
      <td v-if="row.address.length > 0">
        <template v-for="address in row.address">
          <td v-if="address.is_main === true">
            <p class="!w-64 text-wrap">
              {{ address.address_name }}
            </p>
          </td>
        </template>
      </td>
      <td v-else></td>
    </template>
  </UTable>
  <div
    class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
  >
    <UPagination
      v-model="page"
      :page-count="pageCount"
      :total="userData.data.length"
    />
  </div>

  <!-- modal EDIT USER -->
  <UModal v-model="isOpen" prevent-close>
    <div class="py-7 px-5 flex flex-col gap-3">
      <h1 class="font-semibold text-lg">Edit User</h1>

      <!-- input name -->
      <UForm :schema="schema" :state="formInput" class="flex flex-col gap-3">
        <UFormGroup label="Name" name="name">
          <UInput
            v-model="formInput.name"
            type="text"
            placeholder="Masukkan Nama"
          />
        </UFormGroup>

        <!-- input email -->
        <UFormGroup label="Email" name="email">
          <UInput
            v-model="formInput.email"
            type="email"
            placeholder="Masukkan Email"
          />
        </UFormGroup>

        <!-- input telp -->
        <UFormGroup label="Nomor Telepon" name="telp">
          <UInput
            v-model="formInput.telp"
            type="text"
            placeholder="Masukkan Nomor Telepon"
          />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput
            v-model="formInput.password"
            :type="typeInput"
            autocomplete="off"
            placeholder="Masukkan Password"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template #trailing>
              <UButton
                @click="switchVisibilityPassword"
                class="cursor-pointer"
                :v-show="true"
                color="blue"
                :padded="false"
                variant="link"
                :icon="
                  typeInput === 'password'
                    ? 'i-heroicons-eye-16-solid'
                    : 'i-heroicons-eye-slash-16-solid'
                "
              >
              </UButton>
            </template>
          </UInput>
        </UFormGroup>

        <!-- input address -->
        <UFormGroup label="Alamat" name="address">
          <UInput
            v-model="formInput.address"
            type="text"
            placeholder="Masukkan Nama Alamat"
          />
        </UFormGroup>

        <UFormGroup label="Role" name="role">
          <USelectMenu v-model="formInput.role" :options="people" />
        </UFormGroup>

        <UFormGroup
          v-if="formInput.role === 'partner'"
          label="Avatar"
          name="image"
        >
          <!-- <div class="w-20 h-20 rounded-full">
            <img :src="previewImage" class="object-cover w-full h-full" />
          </div>
          {{ previewImage }} -->
          <div
            class="w-20 h-20 rounded-[100%] mb-3 mt-3"
            v-if="formInput.image !== ''"
          >
            <img
              v-if="previewImage !== undefined"
              :src="previewImage"
              class="object-cover w-full h-full rounded-full"
            />
          </div>

          <input type="file" @change="updateInput" />
        </UFormGroup>

        <UFormGroup v-else> </UFormGroup>
      </UForm>

      <div class="flex justify-end mt-5">
        <div class="flex justify-center items-center gap-3">
          <UButton color="red" variant="solid" size="md" @click="clearFormEdit">
            Batal</UButton
          >
          <UButton
            color="primary"
            variant="solid"
            size="md"
            @click="onSubmit"
            :loading="isLoading"
          >
            Simpan</UButton
          >
        </div>
      </div>
    </div>
  </UModal>

  <!-- modal ADD USER -->
  <UModal v-model="isOpenAdd" prevent-close>
    <div class="py-7 px-5 flex flex-col gap-3">
      <h1 class="font-semibold text-lg">Tambah User</h1>

      <!-- input name -->
      <UForm
        :schema="schemaAddUser"
        :state="formInputAdd"
        class="flex flex-col gap-3"
        @submit="addUser"
      >
        <UFormGroup label="Name" name="name">
          <UInput
            v-model="formInputAdd.name"
            type="text"
            placeholder="Masukkan Nama"
          />
        </UFormGroup>

        <!-- input email -->
        <UFormGroup label="Email" name="email">
          <UInput
            v-model="formInputAdd.email"
            type="email"
            placeholder="Masukkan Email"
          />
        </UFormGroup>

        <!-- input telp -->
        <UFormGroup label="Nomor Telepon" name="telp">
          <UInput
            v-model="formInputAdd.telp"
            type="text"
            placeholder="Masukkan Nomor Telepon"
          />
        </UFormGroup>

        <!-- input password -->
        <UFormGroup label="Password" name="password">
          <UInput
            v-model="formInputAdd.password"
            :type="typeInput"
            autocomplete="off"
            placeholder="Masukkan Password"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template #trailing>
              <UButton
                @click="switchVisibilityPassword"
                class="cursor-pointer"
                :v-show="true"
                color="blue"
                :padded="false"
                variant="link"
                :icon="
                  typeInput === 'password'
                    ? 'i-heroicons-eye-16-solid'
                    : 'i-heroicons-eye-slash-16-solid'
                "
              >
              </UButton>
            </template>
          </UInput>
        </UFormGroup>

        <!-- input address -->
        <UFormGroup label="Alamat" name="address">
          <UInput
            v-model="formInputAdd.address"
            type="text"
            placeholder="Masukkan Nama Alamat"
          />
        </UFormGroup>

        <UFormGroup label="Role" name="role">
          <USelectMenu v-model="formInputAdd.role" :options="people" />
        </UFormGroup>

        <UFormGroup
          v-if="formInputAdd.role === 'partner'"
          label="Image"
          name="image"
        >
          <div
            class="w-20 h-20 rounded-[100%] mb-3 mt-3"
            v-if="formInputAdd.image !== undefined"
          >
            <img
              :src="formInputAdd.image"
              class="object-cover w-full h-full rounded-full"
            />
          </div>

          <input type="file" @change="updateInput" />
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
              type="submit"
              :loading="isLoading"
            >
              Simpan</UButton
            >
          </div>
        </div>
      </UForm>
    </div>
  </UModal>
</template>

<script setup lang="ts">
const supabaseClient = useSupabaseClient()

const toast = useToast()
const isOpen = ref(false)

const ToggleMenu = () => {
  isOpen.value = isOpen.value === false ? true : false
}
const route = useRoute()
const cleanedPath = ref<string>(route.path.replace("/", ""))

const logout = async () => {
  console.log("jalan")
  const { error } = await supabaseClient.auth.signOut()
  if (error) {
    toast.add({
      id: "auth_logout",
      title: "Logout Gagal",
      description: "Coba kembali",
      timeout: 4000,
    })
    return
  }
  useRouter().push("/login")
}

const homeLink = [
  {
    iconClass: "text-black",
    icon: "ri:home-5-fill",
    label: "Home",
    to: "/",
  },
]

interface Crumbs {
  label: string
  icon?: string
  iconClass?: string
  labelClass?: string
  to: string
}

const crumbs = computed(() => {
  const links = (route.meta.breadcrumbs ?? []) as Crumbs[]
  return [...homeLink, ...links]
})

const menu = [
  {
    label: "Beranda",
    icon: "i-uil-home-alt",
    to: "/",
  },
  {
    label: "Pengguna",
    icon: "i-material-symbols-person-outline",
    to: "/users",
  },
  {
    label: "Kategori",
    icon: "i-tabler-category-2",
    to: "/category",
  },
  {
    label: "Unit",
    icon: "game-icons:weight-crush",
    to: "/unit",
  },
  {
    label: "Barang",
    icon: "i-material-symbols-backpack-outline-rounded",
    to: "/items",
  },
  {
    label: "Transaksi",
    icon: "i-icon-park-outline-transaction-order",
    to: "/transaction",
  },
  {
    label: "Setoran",
    icon: "ri:booklet-line",
    to: "/servicefee",
  },
  {
    label: "Laporan",
    icon: "i-material-symbols-file-copy-outline-rounded",
    to: "/report",
  },
]
</script>

<template>
  <div class="flex w-full h-[100%]">
    <div
      :class="
        isOpen === false
          ? 'w-52 min-h-screen bg-blue-700 py-5 text-white duration-700 fixed z-50 '
          : 'w-16 min-h-screen bg-blue-700 px-3 py-5 text-white flex flex-col fixed items-center duration-500 z-50'
      "
    >
      <div class="flex gap-5 justify-between items-center mb-3">
        <p
          :class="
            isOpen === true ? 'hidden' : 'font-semibold cursor-default pl-5'
          "
        >
          Barong
        </p>
        <div
          :class="
            isOpen === false
              ? 'mr-1 hover:bg-blue-900 hover:rounded-md hover:transition hover:delay-50 px-2 text-center py-2'
              : 'mr-0 hover:bg-blue-900 hover:rounded-md hover:transition hover:delay-50 px-2 text-center py-2'
          "
          @click="ToggleMenu"
        >
          <Icon
            class="cursor-pointer"
            name="i-uil-bars"
            width="20"
            height="20"
          />
        </div>
      </div>

      <!-- Icon and Label -->
      <div
        :class="
          isOpen === true
            ? 'hidden transition duration-700 delay-500'
            : 'flex flex-col gap-3 text-sm transition duration-700 delay-1000'
        "
      >
        <NuxtLink
          v-for="menus in menu"
          :to="menus.to"
          :class="
            menus.to === route.path
              ? 'border-r-4 duration-500 border-gray-300 flex gap-3 items-center hover:bg-blue-800 hover:border-r-4  hover:transition hover:delay-50 px-5 py-2'
              : 'flex gap-3 items-center hover:bg-blue-800 hover:border-r-4  hover:transition hover:delay-50 border-gray-300 px-5 py-2'
          "
          @click="isOpen = true"
        >
          <Icon :name="menus.icon" width="20" height="20" />
          <span>{{ menus.label }}</span>
        </NuxtLink>

        <div
          @click="logout"
          class="cursor-pointer flex gap-3 items-center font-semibold hover:bg-blue-800 hover:border-r-4 hover:transition hover:delay-50 border-gray-300 px-5 py-2"
        >
          <Icon
            name="i-material-symbols-logout-rounded"
            width="20"
            height="20"
          />
          <span class="font-medium">Keluar</span>
        </div>
      </div>

      <!-- Icon -->
      <div
        :class="
          isOpen === true ? ' flex flex-col items-center gap-3 ' : 'hidden'
        "
      >
        <NuxtLink
          v-for="menus in menu"
          :to="menus.to"
          :class="
            menus.to === route.path
              ? 'bg-blue-900 px-2 py-2 rounded-lg'
              : 'hover:bg-blue-900 hover:transition hover:delay-50 px-2 py-2 hover:rounded-lg'
          "
        >
          <Icon :name="menus.icon" width="20" height="20" />
        </NuxtLink>
        <div
          @click="logout"
          class="hover:bg-blue-900 hover:transition hover:delay-50 px-2 py-2 hover:rounded-lg"
        >
          <Icon
            name="i-material-symbols-logout-rounded"
            width="20"
            height="20"
          />
        </div>
      </div>
    </div>
    <div
      :class="
        isOpen === false
          ? 'px-5 py-12 w-full h-screen overflow-y-auto pl-[228px] duration-500 '
          : 'px-5 py-12 w-full h-screen overflow-y-auto pl-[84px] duration-500 '
      "
    >
      <UBreadcrumb class="!text-black" divider="/" :links="crumbs" />
      <slot></slot>
    </div>
  </div>
</template>

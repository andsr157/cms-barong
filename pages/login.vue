<script setup lang="ts">
const toast = useToast()
const supabase = useSupabaseClient()

interface State {
  loading: boolean
  email: string
  password: string
}

const state = reactive<State>({
  loading: false,
  email: "",
  password: "",
})

const login = async () => {
  state.loading = true
  const { data, error } = await supabase.auth.signInWithPassword({
    email: state.email,
    password: state.password,
  })
  if (error) {
    toast.add({
      id: "auth_error",
      title: "Login Gagal",
      description: "Email atau password salah",
      timeout: 4000,
    })
    state.loading = false
    return
  }
  useRouter().push("/")
  state.loading = false
}

definePageMeta({
  layout: "blank",
  middleware: "login",
})
</script>

<template>
  <!-- <UNotification
    v-if="state.error"
    :timeout="2000"
    id="auth"
    position="bottom"
    title="Notification"
    description="email atau password salah"
  /> -->
  <div class="px-6 py-12 lg:px-8 h-[100vh]">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm mb-5">
        <h2
          class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Login
        </h2>
      </div>
      <form class="space-y-6" action="#" method="POST" @submit.prevent="login">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Email address</label
          >
          <div class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              v-model="state.email"
              autocomplete="email"
              required
              class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Password</label
            >
          </div>
          <div class="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              v-model="state.password"
              autocomplete="current-password"
              required
              class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            :disabled="state.loading"
            type="submit"
            class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Masuk
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

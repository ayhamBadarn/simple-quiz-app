<script setup>
import { useRouter } from 'vue-router';

defineProps(['isAuth'])

const links = [
  {
    title: 'my quizzes',
    to: { name: 'my-quizzes' },
  },
  {
    title: 'create quiz',
    to: { name: 'create' }
  },
]
const signLinks = [
  {
    title: 'login',
    to: { name: 'login' }
  },
  {
    title: 'sing up',
    to: { name: 'signup' }
  }
]
const { push } = useRouter()


const logOut = () => {
  localStorage.removeItem('token')
  push({ name: 'quizzes' })
}

</script>

<template>
  <nav class="h-full flex items-center justify-center px-6 -mt-6 text-slate-300">
    <div class="flex items-center gap-6 capitalize text-sm">
      <template v-if="isAuth">
        <RouterLink class="hover:text-slate-50 cursor-pointer" v-for="link in links" :to="link.to">{{ link.title }}
        </RouterLink>
        <button class="hover:text-slate-50 cursor-pointer" @click="logOut">
          Log out
        </button>
      </template>
      <template v-else>
        <RouterLink class="hover:text-slate-50 cursor-pointer" v-for="link in signLinks" :to="link.to">{{ link.title }}
        </RouterLink>
      </template>
    </div>
  </nav>
</template>
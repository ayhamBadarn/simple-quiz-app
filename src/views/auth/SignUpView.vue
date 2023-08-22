<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate'
import { object, string } from "yup"
import { RouterLink, useRouter } from 'vue-router';
import axios from '../../plugins/axios';
import AppCard from "../../components/AppCard.vue"
import AppAlert from '../../components/AppAlert.vue';


const schema = object({
  name: string().required(),
  email: string().email().required(),
  password: string().min(6).required(),
})

const { push } = useRouter()
const alert = ref(null)

const { validate, handleSubmit, errors, useFieldModel } = useForm({
  validationSchema: schema,
});

const [email, password, name] = useFieldModel(['email', 'password', 'name'])

const signup = handleSubmit(async ({ email, password, name }, { resetForm }) => {
  const result = await validate();
  if (result.valid) {
    try {

      const endPoint = `/api/auth/signup`
      const res = await axios.post(endPoint, {
        fullName: name,
        email,
        password

      })
      localStorage.clear()
      localStorage.setItem('token', res.data.data.token)
      resetForm()
      push({ name: 'my-quizzes' })

    } catch (err) {
      console.log(err)
      const error = err.response.data
      if (error.status === 'fail') {
        alert.value.message = error.message
        alert.value.show = true
      }
    }
  }
});
</script>


<template>
  <app-card class="mt-12 shadow-md shadow-slate-600 mb-12">
    <form class=" p-8 rounded-lg  " @submit.prevent="signup" novalidate>
      <h2 class="text-2xl font-semibold mb-6 text-center uppercase">Sign Up</h2>

      <div class="mb-4">
        <label for="name" class="block text-base text-slate-200 font-medium ">Full Name</label>
        <input v-model="name" type="text" id="name" name="name"
          class="mt-1 px-3 py-2 w-full border rounded-md text-slate-800 focus:outline-none focus:shadow-sm focus:shadow-slate-200 transition-all">
        <span class="text-slate-300 h-8 py-2 flex">{{ errors.name }}</span>
      </div>

      <div class="mb-4">
        <label for="email" class="block text-base text-slate-200 font-medium ">Email</label>
        <input v-model="email" type="email" id="email" name="email"
          class="mt-1 px-3 py-2 w-full border rounded-md text-slate-800 focus:outline-none focus:shadow-sm focus:shadow-slate-200 transition-all">
        <span class="text-slate-300 h-8 py-2 flex">{{ errors.email }}</span>
      </div>

      <div class="mb-6">
        <label for="password" class="block text-base text-slate-200 font-medium">Password</label>
        <input v-model="password" type="password" id="password" name="password"
          class="mt-1 px-3 py-2 w-full border rounded-md text-slate-800 focus:outline-none focus:shadow-sm focus:shadow-slate-200 transition-all">
        <span class="text-slate-300 h-8 py-2 flex">{{ errors.password }}</span>
      </div>

      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full uppercase transition-all focus:outline-none"
        type="submit">Sign Up</button>
    </form>
    <AppAlert ref="alert" />

    <RouterLink :to="{ name: 'login' }"
      class="text-xs text-slate-400 hover:text-slate-200 transition-all w-full flex justify-center focus:outline-none">
      Have an account already? Log in
    </RouterLink>
  </app-card>
</template>

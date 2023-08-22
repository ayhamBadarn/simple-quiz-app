<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios, { authHeader } from '../../plugins/axios'
import AppCard from '../../components/AppCard.vue'
import AppAlert from '../../components/AppAlert.vue'
import CreateListQuestion from '../../components/dashboard/CreateListQuestion.vue'
import CreateSetupQuestion from '../../components/dashboard/CreateSetupQuestion.vue'

const { params } = useRoute()
const setup = ref(true)
const questions = ref(null)
const quiz = ref({})
const alert = ref(null)

const endSetupAction = async (data) => {
  quiz.value = data
  setup.value = false
}

const sendError = (message) => {
  alert.value.message = message
  alert.value.show = true
}

onMounted(async () => {
  try {
    const endPoint = `/api/user/quiz/${params.quizId}`
    const res = await axios.get(endPoint, {
      headers: {
        ...authHeader(localStorage.getItem('token'))
      }
    })
    endSetupAction(res.data.data)

  } catch (err) {
    const error = err?.response
    if (error?.status === 403 || error?.status === 401) {
      localStorage.removeItem('token')
      push({ name: 'login' })
    } else if (error?.data.status === 'fail' && error?.status === 400) {
      emit('errorQuestion', error.data.message)
    } else
      console.log(err.response)
  }
})
</script>


<template>
  <div v-if="quiz?.title" class="mt-12 flex flex-wrap text-slate-300 justify-center items-center gap-3 capitalize">
    <h1 class="text-2xl">{{ quiz.title }} </h1>
    <button v-if="!setup" @click=" setup = true">Edit</button>

  </div>
  <section v-if="setup" class="w-full lg:w-1/2 m-auto ">
    <app-card class=" mx-0 mt-12 shadow-md shadow-slate-600 mb-12">
      <CreateSetupQuestion :edit="quiz" @endSetup="endSetupAction" @errorQuiz="sendError" />
    </app-card>
  </section>

  <section v-if="quiz.id && !setup"
    class="w-full lg:w-3/4 m-auto flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-4 justify-end align-middle">
    <CreateListQuestion :quizId="quiz.id" ref="questions" />
  </section>

  <AppAlert ref="alert" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios, { authHeader } from '../../plugins/axios';
import AppCard from '../../components/AppCard.vue'

const { push } = useRouter()
const userQuizzes = ref(null)

const editQuiz = (id) => {
  push({ name: 'update', params: { quizId: id } })
}

const deleteQuiz = async (id) => {

  try {
    const endPoint = `/api/user/quiz/${id}`

    await axios.delete(endPoint, {
      headers: {
        ...authHeader(localStorage.getItem('token'))
      }
    })

    userQuizzes.value = userQuizzes.value.filter(quiz => quiz.id !== id)
  } catch (err) {
    if (err.response.status === 403 || err.response.status === 401) {
      localStorage.removeItem('token')
      push({ name: 'login' })
    } else
      console.log(err.response)
  }
}
onMounted(async () => {
  try {
    const endPoint = `/api/user/quiz/`

    const res = await axios.get(endPoint, {
      headers: {
        ...authHeader(localStorage.getItem('token'))
      }
    })

    userQuizzes.value = res.data.data
  } catch (err) {
    if (err.response.status === 403 || err.response.status === 401) {
      localStorage.removeItem('token')
      push({ name: 'login' })
    } else
      console.log(err.response)
  }
})
</script>

<template>
  <section v-if="userQuizzes">
    <h1 class="text-center mb-8 mt-10 text-3xl text-white">My Quizzes</h1>
    <section class="lg:w-3/4 px-3 m-auto">
      <app-card v-for="quiz in userQuizzes" :key="quiz.id" class="my-4 flex flex-col">
        <div class="mb-3">
          <h2 class="text-xl capitalize">{{ quiz.title }}</h2>
          <div class="text-xs flex gap-3 text-slate-400">
            <p> {{ new Date(quiz.createdAt).toLocaleDateString('en-US',{
              year: 'numeric',
              month: 'short',
              day: '2-digit'
            }) }}</p>
            <p>{{ quiz.userName }}</p>
          </div>
        </div>
        <p class="text-base text-slate-300">{{ quiz.description }}</p>
        <div class="text-xs flex justify-between items-center gap-3 text-slate-400 mt-3 uppercase">
          <div>
            <p> difficulty {{ quiz.difficulty }}</p>
          </div>
        </div>
        <div class="self-end flex gap-2">
          <button @click="editQuiz(quiz.id)"
            class="p-2 text-xs rounded-md  uppercase bg-slate-700 text-white hover:bg-opacity-60">
            Edit
          </button>
          <button @click="deleteQuiz(quiz.id)"
            class="p-2 text-xs rounded-md  uppercase bg-slate-700 text-white hover:bg-opacity-60">
            Delete
          </button>
        </div>
      </app-card>
    </section>
  </section>
</template>
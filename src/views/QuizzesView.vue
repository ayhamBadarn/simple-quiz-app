<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppCard from '../components/AppCard.vue'
import axios from '../plugins/axios'

const { push } = useRouter()
const quizzesData = ref(null)
const startQuiz = (slug) => {
  push({ name: 'quiz', params: { quiz: slug } })
}

onMounted(async () => {
  const endPoint = `/api/quizzes`
  const quizzes = await axios.get(endPoint)

  quizzesData.value = quizzes.data.data
})
</script>

<template>
  <h1 class="text-center mb-8 text-3xl text-white">All Quizzes</h1>
  <section class="lg:w-3/4 px-3 m-auto">
    <app-card v-for="quiz in quizzesData" :key="quiz.id" class="my-4 ">
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
          <p>{{ quiz.questions }} question </p>
          <p> difficulty {{ quiz.difficulty }}</p>
        </div>
        <button @click="startQuiz(quiz.slug)"
          class=" self-end  px-4 py-2 rounded-md  uppercase bg-slate-700 text-white hover:bg-opacity-60">
          Quiz Start
        </button>
      </div>
    </app-card>
  </section>
</template>

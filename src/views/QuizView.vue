<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppCard from '../components/AppCard.vue'
import QuizChoices from '../components/QuizChoices.vue'
import QuizCompleted from '../components/QuizCompleted.vue'
import axios from '../plugins/axios'

const { params } = useRoute()
const quiz = ref(null)
const questions = ref(null)
const quizCompleted = ref(false)
const currentlyQuestion = ref(0)

const score = computed(() => {
  let value = 0
  questions.value.map(q => {
    if (+q.correct == q.selected)
      value++
  })
  return value
})

const getCurrentQuestion = computed(() => {
  let question = questions.value[currentlyQuestion.value]
  question.index = currentlyQuestion.value
  return question
})

const setAnswer = (value) => {
  questions.value[currentlyQuestion.value].selected = value
}

const nextQuestion = () => {
  if (currentlyQuestion.value < questions.value.length - 1) {
    currentlyQuestion.value++
  } else {
    quizCompleted.value = true
  }
}

onMounted(async () => {
  const endPoint = `/api/quizzes/${params.quiz}`
  const req = await axios.get(endPoint)

  quiz.value = req.data.data
  questions.value = quiz.value.questions
  questions.value.forEach(element => {
    element['selected'] = -1
  });
})

</script>
<template>
  <section v-if="quiz">
    <section class="flex justify-center" v-if="quizCompleted">
      <quiz-completed :score="score" :length="questions.length" />
    </section>
    <section class="lg:w-3/4 px-3 m-auto" v-else>

      <h1 class="text-center mb-8 text-6xl text-white capitalize">{{ quiz.title }}</h1>

      <app-card class=" lg:max-w-lg  w-full mx-auto p-6 bg-slate-500 text-white rounded-lg shadow-md">

        <div class="flex flex-col lg:flex-row justify-between">
          <h2 class="text-xl font-semibold mb-2 capitalize order-2 lg:order-1">{{ getCurrentQuestion.question }}</h2>
          <span class="text-gray-600 self-end lg:self-center pb-2 lg:order-2">Score {{ score }} / {{
            questions.length
          }}</span>
        </div>

        <QuizChoices ref="radio" :selected="getCurrentQuestion.selected" :answer="+getCurrentQuestion.correct"
          :choices="getCurrentQuestion.answers" v-model:value="getCurrentQuestion.selected" @update:value="setAnswer" />

        <div class="flex justify-end">
          <button class=" mt-6 px-4 py-2 rounded-md  uppercase"
            :class="`${getCurrentQuestion.selected < 0 ? 'bg-slate-600 bg-opacity-70 text-slate-400' : 'bg-slate-700 text-white hover:bg-opacity-60'}`"
            :disabled="getCurrentQuestion.selected < 0" @click="nextQuestion">
            {{
              getCurrentQuestion.index === questions.length - 1 ? 'finish'
              : getCurrentQuestion.selected < 0 ? 'Choose an answer' : 'Next question' }} </button>
        </div>
      </app-card>
    </section>
  </section>
</template>

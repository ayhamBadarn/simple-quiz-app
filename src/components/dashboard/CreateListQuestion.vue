<script setup>
import { onMounted, ref } from 'vue'
import axios, { authHeader } from '../../plugins/axios'

import AppCard from '../AppCard.vue';
import FormQuestion from './FormQuestion.vue';

const questions = ref([])

const form = ref(null)

const props = defineProps(['quizId'])
defineExpose({ questions })

const saveQuestionAction = (values) => questions.value.push(values)
const updateQuestionAction = (values, updated) => {
  if (updated) {
    questions.value[questions.value.findIndex(q => q.id == values.id)] = values
  }
}

const deleting = async (id) => {
  try {
    const endPoint = `/api/user/quiz/${props.quizId}/question/${id}`
    await axios.delete(endPoint, {
      headers: {
        ...authHeader(localStorage.getItem('token'))
      }
    })
    questions.value = questions.value.filter(q => q.id !== id)
  } catch (err) {
    const error = err?.response
    if (error?.status === 403 || error?.status === 401) {
      localStorage.removeItem('token')
      push({ name: 'login' })
    } else
      console.log(err.response)
  }
}

const editing = (q) => {
  form.value.edit = q
  form.value.setDataForm()
}
onMounted(async () => {
  try {
    const endPoint = `/api/user/quiz/${props.quizId}/question`
    const res = await axios.get(endPoint, {
      headers: {
        ...authHeader(localStorage.getItem('token'))
      }
    })

    questions.value = [...res.data.data]

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
  <app-card class=" mx-0 mt-12 shadow-md shadow-slate-600 mb-12">
    <FormQuestion ref="form" :quizId="quizId" @updateQuestion="updateQuestionAction" @saveQuestion="saveQuestionAction"
      @errorQuestion="sendError" />
  </app-card>

  <div class=" mx-0 mt-12 mb-12 lg:order-first order-1">

    <div class="flex text-slate-300 justify-center items-center gap-6 capitalize">
      <h3 class="text-xl font-semibold mb-6 text-center uppercase">List Of question </h3>
    </div>
    <ul class="mb-4">
      <li v-for="q in questions" :key="q.id" class="block text-base text-slate-200 font-medium py-3 ">
        <div class="flex flex-wrap text-slate-300  items-center gap-3 capitalize justify-between">
          <p class="text-base max-w-[30rem] lg:max-w-[10rem]"> {{ q.question }} </p>
          <div class="flex gap-4">
            <button @click="editing(q)">Edit</button>
            <button @click="deleting(q.id)">Delete</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

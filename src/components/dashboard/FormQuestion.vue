<script setup>
import { useForm } from 'vee-validate'
import { object, string } from "yup"
import axios, { authHeader } from '../../plugins/axios'
import { ref } from 'vue';


const emit = defineEmits(['saveQuestion', 'errorQuestion', 'updateQuestion'])
const props = defineProps(['quizId'])
const edit = ref(null)

const schema = object({
  question: string().required(),
  option1: string().required(),
  option2: string().required(),
  option3: string().required(),
  correct: string().required(),
})


const { validate, handleSubmit, errors, useFieldModel, setFieldValue, resetForm } = useForm({
  validationSchema: schema,

});

const [question, correct, option1, option2, option3] = useFieldModel(['question', 'correct', 'option1', 'option2', 'option3'])
const close = () => {
  emit('updateQuestion', edit.value, null)
  edit.value = null
  resetForm()
}
const create = async (values) => {
  const answers = [values.option1, values.option2, values.option3].join(',')
  const endPoint = `/api/user/quiz/${props.quizId}/question`
  const res = await axios.post(endPoint, {
    question: values.question,
    correct: values.correct,
    answers
  }, {
    headers: {
      ...authHeader(localStorage.getItem('token'))
    }
  })
  emit('saveQuestion', res.data.data)
}

const update = async (values) => {
  const answers = [values.option1, values.option2, values.option3].join(',')
  const endPoint = `/api/user/quiz/${props.quizId}/question/${edit.value.id}`

  const updateValue = {
    question: values.question,
    correct: values.correct,
    answers
  }

  await axios.put(endPoint, updateValue, {
    headers: {
      ...authHeader(localStorage.getItem('token'))
    }
  })
  edit.value = null
  emit('updateQuestion', { id: edit.value.id, ...updateValue }, 1)
}

const signup = handleSubmit(async (values, { resetForm }) => {
  const result = await validate();
  if (result.valid) {
    try {
      if (edit.value) update(values)
      else create(values)
      resetForm()
    } catch (err) {
      const error = err?.response
      if (error?.status === 403 || error?.status === 401) {
        localStorage.removeItem('token')
        push({ name: 'login' })
      } else if (error?.data.status === 'fail' && error?.status === 400) {
        emit('errorQuestion', error.data.message)
      } else
        console.log(err)
    }
  }
})

const setDataForm = () => {
  resetForm()
  const [option1, option2, option3] = edit.value.answers.split(",")
  setFieldValue('question', edit.value.question)
  setFieldValue('option1', option1)
  setFieldValue('option2', option2)
  setFieldValue('option3', option3)
  setFieldValue('correct', edit.value.correct)
}

defineExpose({
  edit,
  setDataForm
})
</script>


<template>
  <form class="p-8 rounded-lg" @submit.prevent="signup" novalidate>
    <h2 v-if="edit" class="text-2xl font-semibold mb-6 text-center uppercase">Edit Question</h2>
    <h2 v-else class="text-2xl font-semibold mb-6 text-center uppercase">New Question</h2>

    <div class="mb-4">
      <label for="question" class="block text-base text-slate-200 font-medium ">Body Of Question</label>
      <textarea v-model="question" type="text" id="question" name="question"
        class="h-24 resize-none mt-1 px-3 py-2 w-full border rounded-md text-slate-800 focus:outline-none focus:shadow-sm focus:shadow-slate-200 transition-all">
      </textarea>
      <span class="text-slate-300 h-8 py-2 flex">{{ errors.question }}</span>
    </div>

    <div class="mb-4">
      <label for="option1" class="block text-base text-slate-200 font-medium ">Answer 1</label>
      <input v-model="option1" type="text" id="option1" name="option1"
        class="mt-1 px-3 py-2 w-full border rounded-md text-slate-800 focus:outline-none focus:shadow-sm focus:shadow-slate-200 transition-all">
      <span class="text-slate-300 h-8 py-2 flex">{{ errors.option1 }}</span>
    </div>

    <div class="mb-4">
      <label for="option2" class="block text-base text-slate-200 font-medium ">Answer 2</label>
      <input v-model="option2" type="text" id="option2" name="option2"
        class="mt-1 px-3 py-2 w-full border rounded-md text-slate-800 focus:outline-none focus:shadow-sm focus:shadow-slate-200 transition-all">
      <span class="text-slate-300 h-8 py-2 flex">{{ errors.option2 }}</span>
    </div>

    <div class="mb-4">
      <label for="option3" class="block text-base text-slate-200 font-medium ">Answer 3</label>
      <input v-model="option3" type="text" id="option3" name="option3"
        class="mt-1 px-3 py-2 w-full border rounded-md text-slate-800 focus:outline-none focus:shadow-sm focus:shadow-slate-200 transition-all">
      <span class="text-slate-300 h-8 py-2 flex">{{ errors.option3 }}</span>
    </div>

    <div class="mb-4">
      <label for="correct" class="block text-base text-slate-200 font-medium ">Choise Correct Answer</label>
      <select v-model="correct" type="text" id="correct" name="correct"
        class="mt-1 px-3 py-2 w-full border rounded-md text-slate-800 focus:outline-none focus:shadow-sm focus:shadow-slate-200 transition-all">
        <option value="0">Answer 1</option>
        <option value="1">Answer 2</option>
        <option value="2">Answer 3</option>
      </select>
      <span class="text-slate-300 h-8 py-2 flex">{{ errors.correct }}</span>
    </div>

    <div class="flex justify-end">
      <div v-if="edit" class="flex gap-3 w-full justify-between">
        <div
          class="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md  uppercase transition-all focus:outline-none "
          type="button" @click="close">Close</div>
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md  uppercase transition-all focus:outline-none "
          type="submit">Update</button>
      </div>
      <button v-else
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600  uppercase transition-all focus:outline-none "
        type="submit">Save</button>
    </div>
  </form>
  <AppAlert ref="alert" />
</template>

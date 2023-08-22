<script setup>
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { object, string } from "yup"
import axios, { authHeader } from '../../plugins/axios'
import { onMounted } from 'vue';

const props = defineProps(['edit'])
const emit = defineEmits(['endSetup', 'errorQuiz'])
const { push } = useRouter()
const schema = object({
  title: string().min(10).required(),
  description: string().min(30).required(),
  difficulty: string().required(),
})


const { validate, handleSubmit, errors, useFieldModel, setFieldValue } = useForm({
  validationSchema: schema,
});

const [title, description, difficulty] = useFieldModel(['title', 'description', 'difficulty'])

const create = async (values) => {
  const endPoint = '/api/user/quiz'

  const res = await axios.post(endPoint, {
    title: values.title,
    description: values.description,
    difficulty: values.difficulty
  }, {
    headers: {
      ...authHeader(localStorage.getItem('token')),
    }
  })

  emit('endSetup', res.data.data.id, res.data.data.title)
}

const editing = async (values) => {
  const endPoint = `/api/user/quiz/${props.edit.id}`

  const dataUpdated = {
    title: values.title,
    description: values.description,
    difficulty: values.difficulty
  }

  await axios.put(endPoint, dataUpdated, {
    headers: {
      ...authHeader(localStorage.getItem('token')),
    }
  })

  emit('endSetup', { id: props.edit.id, ...dataUpdated })
}

const save = handleSubmit(async (values, { resetForm }) => {
  const result = await validate();
  if (result.valid) {
    try {
      if (props.edit)
        editing(values)
      else
        create(values)
      resetForm
    } catch (err) {
      const error = err?.response
      if (error?.status === 403 || error?.status === 401) {
        localStorage.removeItem('token')
        push({ name: 'login' })
      } else if (error?.data.status === 'fail' && error?.status === 400) {
        emit('errorQuiz', error.data.message)
      } else
        console.log(err)
    }
  }
})

onMounted(() => {
  if (props?.edit) {
    setFieldValue('title', props.edit.title)
    setFieldValue('difficulty', props.edit.difficulty)
    setFieldValue('description', props.edit.description)
  }
})

</script>

<template>
  <form class=" p-8 rounded-lg" @submit.prevent="save" novalidate>
    <h2 v-if="edit" class="text-2xl font-semibold mb-6 text-center uppercase">Edit Quiz</h2>
    <h2 v-else class="text-2xl font-semibold mb-6 text-center uppercase">New Quiz</h2>

    <div class="mb-4">
      <label for="title" class="block text-base text-slate-200 font-medium ">Quiz Title </label>
      <input v-model="title" type="text" id="title" name="title"
        class="mt-1 px-3 py-2 w-full border rounded-md text-slate-800 focus:outline-none focus:shadow-sm focus:shadow-slate-200 transition-all">
      <span class="text-slate-300 h-8 py-2 flex">{{ errors.title }}</span>
    </div>

    <div class="mb-4">
      <label for="difficulty" class="block text-base text-slate-200 font-medium ">difficulty</label>
      <select id="difficulty" name="difficulty" v-model="difficulty"
        class="mt-1 px-3 py-2 w-full border rounded-md text-slate-800 focus:outline-none focus:shadow-sm focus:shadow-slate-200 transition-all">
        <option disabled value="">Please select one</option>
        <option>Easy</option>
        <option>Normal</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
      <span class="text-slate-300 h-8 py-2 flex">{{ errors.difficulty }}</span>
    </div>

    <div class="mb-6">
      <label for="description" class="block text-base text-slate-200 font-medium">About The Quiz</label>
      <textarea v-model="description" name="description" id="description"
        class="resize-none h-36 mt-1 px-3 py-2 w-full border rounded-md text-slate-800 focus:outline-none focus:shadow-sm focus:shadow-slate-200 transition-all">
      </textarea>
      <span class="text-slate-300 h-8 py-2 flex">{{ errors.description }}</span>
    </div>
    <div class="flex justify-end">
      <div v-if="edit" class="flex gap-3 w-full justify-between">
        <div
          class="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md  uppercase transition-all focus:outline-none "
          type="button" @click="$emit('endSetup',edit)">Close</div>
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md  uppercase transition-all focus:outline-none "
          type="submit">Update</button>
      </div>
      <button v-else
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md  uppercase transition-all focus:outline-none "
        type="submit">Save</button>
    </div>
  </form>
</template>

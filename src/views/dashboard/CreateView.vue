<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppCard from '../../components/AppCard.vue'
import AppAlert from '../../components/AppAlert.vue'
import CreateSetupQuestion from '../../components/dashboard/CreateSetupQuestion.vue'

const { push } = useRouter()

const alert = ref(null)


const sendError = (message) => {
  alert.value.message = message
  alert.value.show = true
}
</script>


<template>
  <h1 class="mt-12 text-4xl text-slate-100 font-semibold mb-6 text-center uppercase">Create New Quiz</h1>

  <section class="w-full lg:w-1/2 m-auto ">
    <app-card class=" mx-0 mt-12 shadow-md shadow-slate-600 mb-12">
      <CreateSetupQuestion @endSetup="(id) => push({ name: 'update',params: { quizId: id } })" @errorQuiz="sendError" />
    </app-card>
  </section>


  <AppAlert ref="alert" />
</template>

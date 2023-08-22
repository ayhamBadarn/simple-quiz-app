<script setup>
import { useRouter } from 'vue-router';

const { push } = useRouter()

defineProps(['score', 'length'])
</script>

<template>
  <section>
    <div class="text-slate-300 capitalize flex flex-col justify-center">
      <h2 class="text-4xl "> You have finished the quiz</h2>
      <p class="text-center text-xl py-6"> Your score is {{ score }} / {{ length }}</p>
      <button @click="push({ name: 'quizzes' })"
        class="border border-slate-400 min-w-max w-44 h-10 rounded-md self-center uppercase hover:bg-slate-500 shadow">
        Quizzes</button>
    </div>
  </section>
</template>
<script setup>
import { RouterLink } from "vue-router"
</script>
<template>
  <header class="w-full h-14  shadow-md mb-12">
    <nav class="h-full flex items-center justify-center px-6 text-slate-300">
      <div class="flex items-center gap-6 capitalize">
        <RouterLink class="hover:text-slate-50 cursor-pointer" :to="{ name: 'quizzes' }">quizzes</RouterLink>
        <RouterLink class="hover:text-slate-50 cursor-pointer" :to="{ name: 'dashboard' }">
          create quiz
        </RouterLink>
      </div>
    </nav>
  </header>

  <main>
    <section class="container m-auto px-3">
      <slot />
    </section>
  </main>
</template>
<script setup>
import { onMounted, ref } from 'vue';

const show = ref(false)
const message = ref('')

defineExpose({
  show,
  message
})
onMounted(() => {
  setTimeout(() => show.value = false, 8000)
})
</script>

<template>
  <Teleport to="body">
    <div
      class="min-w-[20rem] min-h-[5rem] bg-slate-500 fixed bottom-4 right-4 text-slate-100 px-4 py-2 rounded-md shadow-md"
      :class="{ 'animate-fadeIn': show,'animate-fadeOut': !show }">
      <div class="flex justify-between">
        <p class="text-slate-200 text-sm pt-3">{{ message }}</p>
        <button @click="show = false"
          class=" border border-slate-400 rounded-full flex justify-center items-center text-slate-50 text-xs w-5 h-5">x</button>
      </div>
    </div>

  </Teleport>
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-fadeOut {
  transition: transform 5ms;
  transition: opacity 1ms 3ms;
  opacity: 0;
  transform: translateY(60px)
}
</style>
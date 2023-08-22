<script setup>
defineProps(['choices', 'answer', 'selected', 'value'])
const emit = defineEmits(['update:value'])

const change = (event, i) => {
  emit('update:value', i)
  event.target.checked = false
}

</script>

<template>
  <label :for="'answer' + i" v-for="option,i in choices.split(',')" :key="i"
    class="flex cursor-pointer transition-colors duration-300 my-2 px-4 py-2 p-2 rounded-md" :class="`${selected === i ?
      i === answer ?
        'bg-green-100 text-green-600'
        :
        'bg-rose-100 text-rose-600'
      : 'bg-slate-700 hover:bg-opacity-50'} ${selected > -1 && selected != i
        ? 'bg-opacity-50' : ''}  
                `">
    {{ option }}
    <input type="radio" @change="change($event,i)" :id="'answer' + i" :name="'answer' + i" class="hidden" :value="i"
      :disabled="selected > -1">
  </label>
</template>
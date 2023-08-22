<script setup>
import { RouterView } from "vue-router"
import DashboardLayout from "../../components/dashboard/DashboardLayout.vue"
import { onMounted, onUpdated, ref } from "vue";


const isLogin = () => localStorage.key('token') !== null

const isAuth = ref(null)

onMounted(() => {
  isAuth.value = isLogin()
})
onUpdated(() => {
  isAuth.value = isLogin()
})

</script>
<template>
  <DashboardLayout :isAuth="isAuth" />
  <RouterView name="dashboard" />
</template>
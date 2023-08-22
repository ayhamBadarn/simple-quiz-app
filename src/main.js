import './assets/main.css'
import { createApp } from 'vue'
import route from './routes'
import App from './App.vue'

createApp(App).use(route).mount('#app')

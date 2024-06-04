import Notifications from 'notiwind'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import print from 'vue3-print-nb'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Notifications)
app.use(print)


app.mount('#app')

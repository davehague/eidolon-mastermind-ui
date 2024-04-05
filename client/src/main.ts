import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

async function checkAgents() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  console.log('baseUrl:', baseUrl)
  try {
    const response = await fetch(`${baseUrl}/processes`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log(data) // Or handle the data as needed in your application
  } catch (error) {
    console.error('There was a problem fetching the agent processes: ', error)
  }
}

checkAgents()

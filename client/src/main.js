import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { setupMotion } from './directives/motion.js'

const app = createApp(App)
setupMotion(app) // registra v-reveal y v-parallax (y se desactiva solo con "reducir movimiento")
app.mount('#app')

import './assets/main.css'
import 'vant/lib/index.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import mainView from './views/mainView.vue'
import router from './router'

const app = createApp(mainView)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')

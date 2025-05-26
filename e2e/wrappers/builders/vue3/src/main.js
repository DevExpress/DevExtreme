import { createApp } from 'vue'
import App from './App.vue'
import 'devextreme/dist/css/dx.light.css';
import router from './router'

createApp(App).use(router).mount('#app')

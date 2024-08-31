import { createApp } from 'vue'
import './style.css'
import { createPinia } from "pinia";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css';
import App from "./App.vue";
import 'element-plus/theme-chalk/dark/css-vars.css';
import './styles/dark/css-vars.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(ElementPlus);
app.mount('#app');
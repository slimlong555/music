import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidatePlugin from "./includes/validation";

import "./includes/firebase";
import './assets/base.css';
import './assets/main.css';
 
const app = createApp(App);


app.use(createPinia());
app.use(router);
app.use(VeeValidatePlugin , {foo:100}) ; // 开发人员使用它来允许其他开发人员配置插件的功能。

app.mount('#app');

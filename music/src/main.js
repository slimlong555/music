import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidatePlugin from "./includes/validation";
import { auth } from "./includes/firebase";
import Icon from "./directives/icon";
import i18n from "./includes/i18n";
import { registerSW } from "virtual:pwa-register";


import './assets/base.css';
import './assets/main.css';

registerSW({ immediate: true });
 
let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin , {foo:100});// 开发人员使用它来允许其他开发人员配置插件的功能。
    app.directive("icon",Icon);
    app.use(i18n);


    app.mount("#app");
  }
});
// 然后在回调函数中，创建一个条件语句来检查app变量是否是空的。

// 每当用户的身份验证状态发生变化时，Firebase都会发出该事件。


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidatePlugin from "./includes/validation";
import { auth } from "./includes/firebase";
import Icon from "./directives/icon";
import i18n from "./includes/i18n";
import { registerSW } from "virtual:pwa-register";
import  GlobalComponents  from './includes/_globals';
import progressBar from './includes/progress-bar';

import './assets/base.css';
import './assets/main.css';
import "nprogress/nprogress.css"

registerSW({ immediate: true });
progressBar(router) // 这将使router object对象在进度条文件中可访问。
 
let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin , {foo:100});// 开发人员使用它来允许其他开发人员配置插件的功能。
    app.directive("icon",Icon);
    app.use(i18n);
    app.use(GlobalComponents);// 第一步是搜索全局组件文件。
                              // 自动化流程的目的是让我们可以在全球范围内注册组件而无需更新任何其他文件。
                              // 找到组件文件后，我们将开始在每次迭代中循环遍历它们。
                              // 之后，我们要格式化组件的名称。
                              // 最后，我们将使用导入的数据注册组件。


    app.mount("#app");
  }
});
// 然后在回调函数中，创建一个条件语句来检查app变量是否是空的。

// 每当用户的身份验证状态发生变化时，Firebase都会发出该事件。


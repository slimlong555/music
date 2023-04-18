import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/views/HomeView.vue";
import About from "@/views/AboutView.vue";
import Manage from "@/views/Manage.vue";
import useUserStore from "@/stores/user";




const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "about",
    path: "/about",
    component: About,
  },
  {
    name: "manage",
    // alias: "/manage", 此值将是一条路径，会将此属性设置为旧路径，即manage
    path: "/manage-music",
    component: Manage,
    beforeEnter(to, from, next) {
      console.log("Manage Route Guard");
      next();
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/manage",
    redirect: { name: "manage" },
  },
  {
    path: "/:catchAll(.*)*", /* 正则表达式将匹配任何值。星号用于兑现记录中不存在的路径。如果找不到匹配项，View路由器将确保检查其他记录是否匹配。 */
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), /* 我们可以使用此选项在浏览器中启用历史记录模式。 */
  routes,
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
  // console.log("Global Guard");

  if (!to.meta.requiresAuth) {
    next();
    return;
  }
  const store = useUserStore();

  if (store.userLoggedIn) {
    next();
  } else {
    next({ name: "home" });
  }
});


export default router

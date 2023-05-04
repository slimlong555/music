import NProgress from "nprogress";

export default (router) => {
  router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
  });

  router.afterEach(NProgress.done); //我们不需要做任何其他事情，所以如果路由器调用此函数就可以了
};

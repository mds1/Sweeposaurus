import { route } from 'quasar/wrappers';
import VueRouter from 'vue-router';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default route(function ({ Vue }) {
  Vue.use(VueRouter);

  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  Router.beforeEach((to, from, next) => {
    // Only allow user to navigate directly to home page
    // Navigating to home page is allowed. Navigating to cancel or speedUp without visiting
    // home page is not allowed. This is to ensure the user connects a wallet first
    if (to.name === 'home' || to.name === 'help') {
      next();
    } else if (from.name === null) {
      next({ name: 'home' });
    }
    next();
  });

  return Router;
});

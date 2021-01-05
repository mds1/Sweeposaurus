import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/Home.vue') },
      { name: 'help', path: '/help', component: () => import('pages/Help.vue') },
      { name: 'cancel', path: '/cancel', component: () => import('pages/TransactionCancel.vue') },
      {
        name: 'speedUp',
        path: '/speed-up',
        component: () => import('pages/TransactionSpeedUp.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;

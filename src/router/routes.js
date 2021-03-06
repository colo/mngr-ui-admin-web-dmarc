
/**
* Dynamic Layout
* https://dev.to/lampewebdev/vuejs-pages-with-dynamic-layouts-problems-and-a-solution-4460
*/

/**
* Avoid lazy loading or Apps get null $route (and breaks Dynamic Layout)
* https://forum.vuejs.org/t/this-route-only-returns-null-in-app-vue/64006/3
**/
import Index from '@apps/dmarc/Index.vue'
// import Hosts from '@apps/hosts/Index.vue'
import Error from '../views/Error.vue'

const routes = [
  {
    path: '/',
    // component: () => import('layouts/MainLayout.vue'),
    name: 'index',
    // component: () => import('@apps/start/Index.vue'),
    component: Index
    // meta: { layout: 'VerticalLayout' },

  },
  {
    path: '/hosts',
    name: 'hosts',
    component: () => import('@apps/hosts/Index.vue'),
  },
  {
    path: '/logs',
    name: 'Logs',
    redirect: { name: 'LogsNginx' },
    component: () => import('@apps/logs/Index.vue'),
    children: [
      {
        path: 'nginx',
        name: 'LogsNginx',
        // redirect: { name: 'LogsNginxInstalls' },
        component: () => import('@apps/logs/nginx/Index.vue'),
      },
    ]
  },
  {
    path: '/educativa',
    name: 'Educativa',
    redirect: { name: 'EducativaSize' },
    component: () => import('@apps/educativa/Index.vue'),
    children: [
      {
        path: 'size',
        name: 'EducativaSize',
        redirect: { name: 'EducativaSizeInstalls' },
        component: () => import('@apps/educativa/size/Index.vue'),
        children: [
          {
            path: 'installs',
            name: 'EducativaSizeInstalls',
            component: () => import('@apps/educativa/size/installs/Index.vue'),
          },
          {
            path: 'emails',
            name: 'EducativaSizeEmails',
            component: () => import('@apps/educativa/size/emails/Index.vue'),
          },
        ]
      },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('../views/Error.vue'),
    // component: Error,
    props: { number: 404, title: 'Oops… You just found an error page', subtitle: 'We are sorry but the page you are looking for was not found'},
    meta: { layout: 'EmptyLayout' },
  }
]

export default routes

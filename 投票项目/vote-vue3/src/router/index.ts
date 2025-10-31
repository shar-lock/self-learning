import { createRouter,createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',
          redirect: 'select-create',
        },
        {
          path: 'select-create',
          component: ()=>import('../views/SelectCreate.vue'),
        },
        {
          path:'me',
          component: ()=>import('../views/Me.vue'),
        }
      ]
    },
    {
      path: '/create',
      component: ()=>import('../views/CreateVoteView.vue'),
    },
    {
      path:'/vote/:id',
      component: ()=>import('../views/VoteView.vue'),
    },
    {
      path:'/my-votes',
      component: ()=>import('../views/MyVotesView.vue'),
    },
    {
      path:'/login',
      component: ()=>import('../views/LoginView.vue'),
    },
    {
      path:'/my-settings',
      component: ()=>import('../views/mySettings.vue'),
    }
  ],
})

export default router

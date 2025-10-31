import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import SellerView from '@/SellerView.vue'
import BuyerView from '@/BuyerView.vue'
import BoughtView from '@/BoughtView.vue'
import ShouhouView from '@/ShouhouView.vue'
import OrdersView from '@/OrdersView.vue'
import ItemView from '@/ItemView.vue'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { 
      path: '/buyer',
      component: BuyerView,
      children: [
       {
         path: 'bought',
         component: BoughtView,
       },
       {
         path: 'shouhou',
         component: ShouhouView,
       }
      ],
    },
    { path: '/seller',
      component: SellerView,
      children: [
        {
          path: 'orders',
          component: OrdersView,
        },
       ],
    },
    {
      path:'/item/:id',//动态路由
      component: ItemView,
    }
  ],
})

export default router

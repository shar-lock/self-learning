import { createHashRouter, redirect } from "react-router-dom";
import HomeView from './HomeView.tsx'
import Login from "./Login.tsx";
import IndexView from "./IndexView.tsx";
import React from "react";
import LandingPage from "./LandingPage.tsx";
import OrderFoodPage from './OrderFoodPage.tsx'
let OrderManagerView = React.lazy(()=>import('./OrderManagerView.tsx'))
let FoodManagerView = React.lazy(()=>import('./FoodManagerView.tsx'))
let DeskManagerView = React.lazy(()=>import('./DeskManagerView.tsx'))
let AddFoodView = React.lazy(()=>import('./AddFoodView.tsx'))
let AddDeskView = React.lazy(()=>import('./AddDeskView.tsx'))

const router = createHashRouter([
  {
    path: "/",
    element: <IndexView />,
  },
  {
    path:'/login',
    element: <Login/>
  },
  {
    path:'/home',
    element:<HomeView/>,
    children:[
      {
        path:'',
        loader:() => redirect('/home/orders')
      },
      {
        path:'orders',
        element:<OrderManagerView />,
      },
      {
        path:'foods',
        element:<FoodManagerView />,
      },
      {
        path:'desks',
        element:<DeskManagerView />,
      },
      {
        path:'add-food',
        element:<AddFoodView/>
      },
      {
        path:'add-desk',
        element:<AddDeskView/>
      }
    ],
  },
  {
    path:'/landing/r/:restaurantId/d/:deskId',
    element:<LandingPage />
  },
  {
    path:'/r/:restaurantId/d/:deskId',
    element:<OrderFoodPage />
  },
  {
    path:'/place-order-success',
    element:<div>下单成功</div>
  }
]);

export default router
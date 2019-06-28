import Vue from 'vue'
import Router from 'vue-router'
import GoodList from '../views/GoodList'
import Login from '../views/Login'
import Register from '../views/Register'
import Cart from '../views/Cart'
import Address from '../views/Address'
import OrderConfirm from '../views/OrderConfirm'
import OrderPay from '../views/OrderPay'
import OrderSuccess from '../views/OrderSuccess'
import ManagerLogin from '../views/ManagerLogin'
import ManagerHome from '../views/ManagerHome'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'goodlist',
      component: GoodList
    }, {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'address',
      component: Address
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderPay',
      name: 'orderPay',
      component: OrderPay
    },
    {
      path: '/orderSuccess',
      name: 'orderSuccess',
      component: OrderSuccess
    },
    {
      path: '/managerLogin',
      name: 'managerLogin',
      component: ManagerLogin
    },
    {
      path: '/managerHome',
      name: 'managerHome',
      component: ManagerHome
    }
  ]
})

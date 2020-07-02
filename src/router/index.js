import Vue from "vue";
import Router from "vue-router";
// import Login from '@/views/login/index'

// 下面的情况，默认会导入@/views/login下的index.vue组件
import Login from '@/views/login'
import Layout from '@/components/Layout'
import Home from '@/views/home'
import Member from '@/views/member'
import Goods from '@/views/goods'
import Staff from '@/views/staff'
import Supplier from '@/views/supplier'
import Register from '@/views/register'
Vue.use(Router);


export default new Router({
      mode: 'history',  // 没有哈希#
      routes: [
        {
          path: '/login',
          name: 'login', // 路由名称
          component: Login // 组件对象
        },
        {
          path: '/register',
          name: 'register',
          component: Register
        },
        {
          path: '/',
          name: 'layout', // 路由名称
          redirect: '/home', // 当访问 / 时重定向到 home
          component: Layout , // 组件对象
          // 因为首页，商品，会员都是 Layout 下的 main 里的，所以要将这些组件作为 Layout 组件的子组件，使用children，里面是一个数组，接收一个个对象
          // meta 是
          children: [
            {
              path: '/home',
              component: Home,
              meta: {title: '首页'}
            },
            // {
            //   path: '/member',
            //   component: Member,
            //   meta: {title: '会员管理'}
            // },
          ]
        },

        
        // 上面的是一种写法，可以放在children下面，还有一种方法是下面的这种
        // 当访问 /member 时，渲染的是 Layout 组件，


        {
          path: '/member',
          component: Layout,
          children: [
            {
              path: '/', // 等价于 /member/,请求 /member 时会在后面拼接个 / 因为AppNavbar下的index.vue写的是/member/
              component: Member,
              meta: {title: '会员管理'}
            }
          ]
        },
        {
          path: '/supplier',
          component: Layout,
          children:[
              {
                path: '/',  
                component: Supplier,
                meta: {title: '供应商管理'}
              }
          ]
          
        },
        {
          path: '/goods',
          component: Layout,
          children:[
              {
                path: '/',  
                component: Goods,
                meta: {title: '商品管理'}
              }
          ]
          
        },
        {
          path: '/staff',
          component: Layout,
          children:[
              {
                path: '/',  
                component: Staff,
                meta: {title: '员工管理'}
              }
          ]
          
        }
        
      ]
});
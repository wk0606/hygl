import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'Main',
    //   redirect:'/main'
    // },
    {
      path: '/',
      name: 'Login',
      redirect:'/login'
    },
    {
      path:'/login',
      name:'Login',
      component: resolve=>require(['../views/Login'],resolve)
    },
    {
      path:'/main',
      name:'Main',
      component: resolve=>require(['../views/main/index'],resolve),
      redirect:'/main/mall',
      children:[
        {
          path:'mall',
          name:'mall',
          component:resolve=>require(['../views/mall/index'],resolve),
          redirect: '/main/mall/index',
          children:[
            {path:'index',name:'ssgk',component:resolve=>require(['../views/mall/index_gk.vue'],resolve)},
            {
              path:'shop',
              name:'shop',
              component:resolve=>require(['../views/mall/main.vue'],resolve),
              redirect: '/main/mall/shop/product_sp',
              children:[
                {path:'product_sp',name:'product_sp',component:resolve=>require(['../views/mall/product/index'],resolve)},
                {path:'product_fb',name:'product_fb',component:resolve=>require(['../views/mall/product/product_fb'],resolve)},
                {path:'product_edit',name:'product_edit',component:resolve=>require(['../views/mall/product/product_sp/product_edit'],resolve)},
                {path:'product_group_add/:id',name:'product_group_add',component:resolve=>require(['../views/mall/product/product_group/product_group_add'],resolve)},
                {path:'asset_jy',name:'asset_jy',component:resolve=>require(['../views/mall/asset/index'],resolve)},
                {path:'set_dd',name:'set_dd',component:resolve=>require(['../views/mall/set/set_dd/index'],resolve)},
                {path:'set_dd_addkd/:id',name:'set_dd_addkd',component:resolve=>require(['../views/mall/set/set_dd/set_kdfh/kdfh_add'],resolve)},
                {path:'set_jy',name:'set_jy',component:resolve=>require(['../views/mall/set/set_jy'],resolve)},
                {path:'set_dp',name:'set_dp',component:resolve=>require(['../views/mall/set/set_dp/index'],resolve)},
                {path:'set_dprz',name:'set_dprz',component:resolve=>require(['../views/mall/set/set_dp/set_dpxx/set_dprz'],resolve)},
                {path:'order',name:'order',component:resolve=>require(['../views/mall/order/index'],resolve)},
                {path:'order_details/:ddh',name:'order_details',component:resolve=>require(['../views/mall/order/order_qbdd/qbdd_details'],resolve)},
              ]
            },
          ]
        },
        {path:'charts',name:'charts',component:resolve=>require(['../views/main/charts'],resolve)},
        {path:'client',name:'client',component:resolve=>require(['../views/client/index'],resolve)},
        {path:'box',name:'box',component:resolve=>require(['../views/box/index'],resolve)},
        {path:'activity',name:'activity',component:resolve=>require(['../views/activity/index'],resolve)},
        {path:'activity-add/:id',name:'activityAdd',component:resolve=>require(['../views/activity/addActivity'],resolve)},
        {path:'statistics',name:'statistics',component:resolve=>require(['../views/statistics/index'],resolve)},
        {path:'setting',name:'setting',component:resolve=>require(['../views/setting/index'],resolve)},
        {path:'comments',name:'comments',component:resolve=>require(['../views/comments/index'],resolve)},
      ]
    }
  ]
})

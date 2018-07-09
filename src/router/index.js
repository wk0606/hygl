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
      redirect:'/main/charts',
      children:[
        {path:'/main/charts',name:'charts',component:resolve=>require(['../views/main/charts'],resolve)},
        {path:'/main/client',name:'client',component:resolve=>require(['../views/client/index'],resolve)},
        {path:'/main/box',name:'box',component:resolve=>require(['../views/box/index'],resolve)},
        {path:'/main/activity',name:'activity',component:resolve=>require(['../views/activity/index'],resolve)},
        {path:'/main/activity-add/:id',name:'activityAdd',component:resolve=>require(['../views/activity/addActivity'],resolve)},
        {path:'/main/statistics',name:'statistics',component:resolve=>require(['../views/statistics/index'],resolve)},
        {path:'/main/setting',name:'setting',component:resolve=>require(['../views/setting/index'],resolve)},
        {path:'/main/comments',name:'comments',component:resolve=>require(['../views/comments/index'],resolve)},
        {path:'/main/mall',name:'mall',component:resolve=>require(['../views/mall/index'],resolve)},
        {
          path:'/main/mallchildren',
          name:'mallchildren',
          component:resolve=>require(['../views/mall/main'],resolve),
          redirect:'/main/mallchildren/set_dd',
          children:[
            {path:'/main/mallchildren/set_dd',name:'set_dd',component:resolve=>require(['../views/mall/set/set_dd/index'],resolve)},
            {path:'/main/mallchildren/set_dd_addkd',name:'set_dd_addkd',component:resolve=>require(['../views/mall/set/set_dd/set_kdfh/kdfh_add'],resolve)},
            {path:'/main/mallchildren/set_jy',name:'set_jy',component:resolve=>require(['../views/mall/set/set_jy'],resolve)},
            {path:'/main/mallchildren/set_dp',name:'set_dp',component:resolve=>require(['../views/mall/set/set_dp/index'],resolve)}
          ]
        }
      ]
    }
  ]
})

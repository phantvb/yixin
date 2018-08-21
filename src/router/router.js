import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import resetLogin from '@/components/resetLogin'
import manager from '@/components/page_manager/manager'
import manager_index from '@/components/page_manager/manager_index'
import mission_follow from '@/components/page_manager/manager_mission_follow'
import mission_detail from '@/components/page_manager/manager_mission_detail'
import worker from '@/components/page_manager/manager_worker'
import call_count from '@/components/page_manager/manager_call_count'
import call_detail from '@/components/page_manager/manager_call_detail'
import label from '@/components/page_manager/manager_label'
import staff from '@/components/page_staff/staff'
import staff_index from '@/components/page_staff/staff_index'
import staff_stage from '@/components/page_staff/staff_stage'
import staff_follow from '@/components/page_staff/staff_mission_follow'
import staff_detail from '@/components/page_staff/staff_mission_detail'
import staff_call_count from '@/components/page_staff/staff_call_count'
import operation from '@/components/page_operation/operation'
import operation_index from '@/components/page_operation/operation_index'
import operation_manager from '@/components/page_operation/operation_manager'
import operation_staff from '@/components/page_operation/operation_staff'
import userInfo from '@/components/user_info'

import test from '@/components/test'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },{
    path: '/login',
    component: login
  },{
    path: '/resetLogin',
    component: resetLogin
  }, {
    path: '/manager',
    component: manager,
    children:[
      {path:'index',component:manager_index},
      {path:'follow',component:mission_follow},
      {path:'detail',component:mission_detail},
      {path:'worker',component:operation_staff},
      {path:'call_count',component:call_count},
      {path:'call_detail',component:call_detail},
      {path:'label',component:label},
      {path:'userInfo',component:userInfo}
    ]
  }, {
    path: '/staff',
    component: staff,
    children:[
      {path:'index',component:staff_index},
      {path:'stage',component:staff_stage},
      {path:'follow',component:staff_follow},
      {path:'detail',component:staff_detail},
      {path:'call_count',component:staff_call_count},
      {path:'userInfo',component:userInfo}
    ]
  }, {
    path: '/operation',
    component: operation,
    children:[
      {path:'index',component:operation_index},
      {path:'manager',component:operation_manager},
      {path:'staff',component:operation_staff},
      {path:'userInfo',component:userInfo}
    ]
  }, {
    path: '/test',
    component: test
  }]
});


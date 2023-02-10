import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
// import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'analysis',
              name: '分析页',
              component: () => import('@/pages/dashboard/analysis'),
            }
          ]
        },
        {
          path: 'node',
          name: '节点',
          meta: {
            icon: 'global',
            page: {
              cacheAble: false
            }
          },
          component: () => import('@/pages/node/Node'),
        },
        {
          path: 'node/detail/:id',
          name: '节点详情',
          meta: {
            highlight: '/node',
            invisible: true
          },
          component: () => import('@/pages/node/NodeDetail')
        },
        {
          path: 'namespace',
          name: '命名空间',
          meta: {
            icon: 'block',
            page: {
              cacheAble: false
            }
          },
          component: () => import('@/pages/namespace'),
        },
        {
          path: 'pod',
          name: '容器组',
          meta: {
            icon: 'table',
            page: {
              cacheAble: false
            }
          },
          component: () => import('@/pages/pod/Pod'),
        },
        {
          path: 'pod/detail/:id',
          name: '容器组详情',
          meta: {
            highlight: '/pod',
            invisible: true
          },
          component: () => import('@/pages/pod/PodDetail')
        },
      ]
    },
  ]
}

export default options

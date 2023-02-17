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
          path: 'k8s',
          name: 'K8S',
          meta: {
            icon: 'cloud'
          },
          component: BlankView,
          children: [
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
            {
              path: 'deployment',
              name: '无状态',
              meta: {
                icon: 'table',
                page: {
                  cacheAble: false
                }
              },
              component: () => import('@/pages/deployment/Deployment'),
            },
            {
              path: 'deployment/detail/:id',
              name: 'Deployment详情',
              meta: {
                highlight: '/deployment',
                invisible: true
              },
              component: () => import('@/pages/deployment/DeploymentDetail')
            },
          ]
        },
        {
          path: 'setting',
          name: '设置',
          meta: {
            icon: 'setting'
          },
          component: () => import('@/pages/setting/Setting')
        },
        {
          path: 'business',
          name: '业务',
          meta: {
            icon: 'appstore'
          },
          component: BlankView,
          children:[
            {
              path: 'image',
              name: '镜像',
              meta: {
                page: {
                  cacheAble: false
                }
              },
              component: () => import('@/pages/image/Image')
            },
            {
              path: 'file',
              name: '文件',
              meta: {
                page: {
                  cacheAble: false
                }
              },
              component: () => import('@/pages/file/File')
            },
            {
              path: 'project',
              name: '项目',
              meta: {
                page: {
                  cacheAble: false
                } 
              },
              component: () => import('@/pages/project/Project')
            },
            {
              path: 'project_node_tag',
              name: '节点标签',
              meta: {
                page: {
                  cacheAble: false
                } 
              },
              component: () => import('@/pages/project/NodeTag')
            },
            {
              path: 'project_resources',
              name: '资源模板',
              meta: {
                page: {
                  cacheAble: false
                } 
              },
              component: () => import('@/pages/project/Resources')
            },
          ]
        },
        {
          path: 'log',
          name: '日志',
          meta: {
            icon: 'profile'
          },
          component: BlankView,
          children:[
            {
              path: 'userlog',
              name: '用户日志',
              meta: {
                page: {
                  cacheAble: false
                } 
              },
              component: () => import('@/pages/log/Userlog')
            },
            {
              path: 'adminlog',
              name: '管理日志',
              meta: {
                page: {
                  cacheAble: false
                } 
              },
              component: () => import('@/pages/log/Adminlog')
            },
          ]
        }
      ]
    },
  ]
}

export default options

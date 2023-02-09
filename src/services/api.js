//跨域代理前缀
const API_PROXY_PREFIX='/api'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  LOGIN: `${BASE_URL}/root/checkPermission`,
  ROUTES: `${BASE_URL}/routes`,
  GOODS: `${BASE_URL}/goods`,
  GOODS_COLUMNS: `${BASE_URL}/columns`,
  NAMESPACE_LIST: `${BASE_URL}/root/listNamespaces`,
  NODE_LIST: `${BASE_URL}/root/listNodes`,
  NODE: `${BASE_URL}/root/getNode`,
  POD_LIST: `${BASE_URL}/admin/listPods`,
  POD: `${BASE_URL}/admin/getPod`,
}

//跨域代理前缀
const API_PROXY_PREFIX='/api'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  LOGIN: `${BASE_URL}/root/checkPermission`,
  NAMESPACE_LIST: `${BASE_URL}/root/listNamespaces`,
  NODE: `${BASE_URL}/root/getNode`,
  NODE_LIST: `${BASE_URL}/root/listNodes`,
  NODE_METRICS: `${BASE_URL}/root/nodesMetrics`,
  POD_LIST: `${BASE_URL}/admin/listPods`,
  POD: `${BASE_URL}/admin/getPod`,
  POD_EVENT : `${BASE_URL}/admin/podEvent`,
  CONTAINER_LOG : `${BASE_URL}/admin/podLog`,
  POD_CPU: `${BASE_URL}/admin/podCpu`, 
  POD_MEMORY: `${BASE_URL}/admin/podMemory`,
  DEPLOYMETN_LIST: `${BASE_URL}/admin/listDeployments`,
  DEPLOYMETN: `${BASE_URL}/admin/getDeployment`,
  SERVICE_LIST:`${BASE_URL}/admin/listServices`,
  IMAGE_LIST:`${BASE_URL}/admin/listImages`,
  FILES:`${BASE_URL}/admin/getFilesInfo`,
  FILES_LIST:`${BASE_URL}/admin/listFiles`,
  DATASET:`${BASE_URL}/admin/getDatasetInfo`,
  DATASET_LIST:`${BASE_URL}/admin/listDatasets`,

  PROJECT:`${BASE_URL}/admin/getProjectInfo`,
  PROJECT_LIST:`${BASE_URL}/admin/listProjects`,

  NODETAG_ADD:`${BASE_URL}/root/addNodeTag`,
  NODETAG_DEL:`${BASE_URL}/root/delNodeTag`,
  NODETAG_EDIT:`${BASE_URL}/root/editNodeTag`,
  NODETAG_LIST:`${BASE_URL}/admin/listNodeTags`,

  RESOURCES_LIST:`${BASE_URL}/admin/listResources`,

  IMAGE:`${BASE_URL}/admin/getImageInfo`,
  IMAGE_ADD:`${BASE_URL}/admin/addImage`,
  IMAGE_DEL:`${BASE_URL}/admin/delImage`,
  IMAGE_EDIT:`${BASE_URL}/admin/editImage`,
}


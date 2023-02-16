import { NAMESPACE_LIST, NODE_LIST, NODE, NODE_METRICS, POD_LIST, POD, POD_EVENT, CONTAINER_LOG} from './api'
import { POD_CPU, POD_MEMORY } from './api'
import { DEPLOYMETN, DEPLOYMETN_LIST } from './api'
import { SERVICE_LIST } from './api'


import {request, METHOD} from '@/utils/request'

export async function getNamespaceList() {
  return request(NAMESPACE_LIST, METHOD.POST, {})
}

export async function getNode(nodeName) {
  return request(NODE, METHOD.POST, {"name": nodeName})
}

export async function getNodeList() {
  return request(NODE_LIST, METHOD.POST, {})
}

export async function getNodeMetrics() {
  return request(NODE_METRICS, METHOD.POST, {})
}

export async function getPodsOfOneNode(namespace, fieldSelector) {
  return request(POD_LIST, METHOD.POST, {"namespace": namespace, "fieldSelector":fieldSelector})
}

export async function getPodsOfOneNamespace(namespace, fieldSelector, labelSelector) {
  return request(POD_LIST, METHOD.POST, {"namespace": namespace, "fieldSelector":fieldSelector, "labelSelector":labelSelector})
}

export async function getPodByName(namespace, podName) {
  return request(POD, METHOD.POST, {"namespace": namespace, "pod": podName})
}

export async function getPodEvent(namespace, fileSelector) {
  return request(POD_EVENT, METHOD.POST, {"namespace": namespace, "fieldSelector":fileSelector})
}

export async function getContainerLog(namespace, podName, containerName, lines) {
  return request(CONTAINER_LOG, METHOD.POST, {"namespace": namespace, "pod":podName, "container":containerName, "lines":lines})
}

export async function getPodCPU(namespace, podName) {
  return request(POD_CPU, METHOD.POST, {"namespace": namespace, "pod":podName})
}

export async function getPodMemory(namespace, podName) {
  return request(POD_MEMORY, METHOD.POST, {"namespace": namespace, "pod":podName})
}

export async function getDeploymentsOfOneNamespace(namespace) {
  return request(DEPLOYMETN_LIST, METHOD.POST, {"namespace": namespace, "fieldSelector":""})
}

export async function getDeploymentByName(namespace, deploymentName) {
  return request(DEPLOYMETN, METHOD.POST, {"namespace": namespace, "deployment":deploymentName})
}

export async function getDeploymentEvent(namespace, fileSelector) {
  return request(POD_EVENT, METHOD.POST, {"namespace": namespace, "fieldSelector":fileSelector})
}


export async function getServicesfOneNamespace(namespace, fieldSelector, labelSelector) {
  return request(SERVICE_LIST, METHOD.POST, {"namespace": namespace, "fieldSelector":fieldSelector, "labelSelector": labelSelector})
}
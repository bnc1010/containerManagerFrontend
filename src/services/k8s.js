import {NAMESPACE_LIST, NODE_LIST, NODE, POD_LIST, POD, POD_EVENT, CONTAINER_LOG} from './api'
import {request, METHOD} from '@/utils/request'

export async function getNamespaceList() {
  return request(NAMESPACE_LIST, METHOD.POST, {})
}

export async function getNodeList() {
  return request(NODE_LIST, METHOD.POST, {})
}

export async function getNode(nodeName) {
  return request(NODE, METHOD.POST, {"name": nodeName})
}

export async function getPodsOfOneNode(namespace, fileSelector) {
  return request(POD_LIST, METHOD.POST, {"namespace": namespace, "fieldSelector":fileSelector})
}

export async function getPodsOfOneNamespace(namespace) {
  return request(POD_LIST, METHOD.POST, {"namespace": namespace, "fieldSelector":""})
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




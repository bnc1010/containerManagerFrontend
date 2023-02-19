import {IMAGE, IMAGE_LIST, IMAGE_ADD, IMAGE_DEL, IMAGE_EDIT} from './api'
import {FILES, FILES_LIST} from './api'
import {DATASET, DATASET_LIST} from './api'
import {PROJECT, PROJECT_LIST} from './api'
import {NODETAG_LIST, NODETAG_ADD, NODETAG_DEL, NODETAG_EDIT,  RESOURCES_LIST} from './api'


import {request, METHOD} from '@/utils/request'





export async function getImage(imageId) {
  return request(IMAGE, METHOD.POST, {id: imageId})
}

export async function getImageList() {
  return request(IMAGE_LIST, METHOD.POST, {})
}


export async function addImage(image) {
  return request(IMAGE_ADD, METHOD.POST, image)
}

export async function delImage(imageId) {
  return request(IMAGE_DEL, METHOD.POST, {id:imageId})
}

export async function editImage(image) {
  return request(IMAGE_EDIT, METHOD.POST, image)
}

export async function getFiles(filesId) {
  return request(FILES, METHOD.POST, {id: filesId})
}

export async function getFilesList() {
  return request(FILES_LIST, METHOD.POST, {})
}

export async function getDataset(datasetId) {
  return request(DATASET, METHOD.POST, {id: datasetId})
}

export async function getDatasetList() {
  return request(DATASET_LIST, METHOD.POST, {})
}


export async function getProject(projectId) {
  return request(PROJECT, METHOD.POST, {id: projectId})
}

export async function getProjectList() {
  return request(PROJECT_LIST, METHOD.POST, {})
}

export async function addNodeTag(nodeTag) {
  return request(NODETAG_ADD, METHOD.POST, nodeTag)
}

export async function delNodeTag(tagId) {
  return request(NODETAG_DEL, METHOD.POST, {id: tagId})
}

export async function editNodeTag(nodeTag) {
  return request(NODETAG_EDIT, METHOD.POST, nodeTag)
}

export async function getNodeTagList() {
  return request(NODETAG_LIST, METHOD.POST, {})
}

export async function getResourcesList() {
  return request(RESOURCES_LIST, METHOD.POST, {})
}

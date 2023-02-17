import {IMAGE_LIST, IMAGE_ADD, IMAGE_DEL, IMAGE_EDIT} from './api'
import {FILES_LIST} from './api'
import {PROJECT_LIST} from './api'
import {NODETAG_LIST, RESOURCES_LIST} from './api'


import {request, METHOD} from '@/utils/request'



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

export async function getFilesList() {
  return request(FILES_LIST, METHOD.POST, {})
}

export async function getProjectList() {
  return request(PROJECT_LIST, METHOD.POST, {})
}

export async function getNodeTagList() {
  return request(NODETAG_LIST, METHOD.POST, {})
}

export async function getResourcesList() {
  return request(RESOURCES_LIST, METHOD.POST, {})
}

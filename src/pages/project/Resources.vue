<template>
  <a-card>
    <page-layout title='节点资源模板'>
      <a-button type="primary">创建</a-button>
      <a-button >刷新</a-button>
      <a-table :columns="resourcesColumns" :data-source="resourcesShow">
        <span slot="public" slot-scope="record">
          <a-icon v-if="record.IsPublic" type="check-circle" theme="twoTone" two-tone-color="#52c41a"/>
          <a-icon v-else type="close-circle" theme="twoTone" two-tone-color="#eb2f96"/>
        </span>
        <span slot="action" slot-scope="record">
          <router-link :to="'#'" :key="record.key">编辑</router-link>
          <a-divider type="vertical" />
          <router-link :to="'#'">删除</router-link>
        </span>
      </a-table>
    </page-layout>
  </a-card>
</template>

<script>
import {getResourcesList} from '@/services/sql'
import PageLayout from '@/layouts/PageLayout'

const resourcesColumns = [
  { title: 'ID', dataIndex: 'Id', key: 'id', width: 100,},
  { title: '值', dataIndex: 'Value', key: 'value', width: 210,},
  { title: '是否公开', scopedSlots: { customRender: 'public' }, width: 45,},
  { title: '操作', scopedSlots: { customRender: 'action' },width: 90,},
]

export default {
  name:"Resources",
  components:{PageLayout},
  data(){
    return {
      resourcesColumns,
      resourcesShow:[],
    }
  },
  methods:{
    loadResources(){
      getResourcesList().then(res => {
        this.resourcesShow = res.data.data
        for(let ind = 0, end = this.resourcesShow.length; ind < end; ind++){
          this.resourcesShow[ind].key = ind
          this.resourcesShow[ind].Value = JSON.stringify(this.resourcesShow[ind].Value)
        }
      })
    }
  },
  mounted(){
    this.loadResources()
  }
}

</script>
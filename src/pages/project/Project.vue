<template>
  <a-card>
    <page-layout title='项目'>
      <a-button type="primary">创建</a-button>
      <a-button >刷新</a-button>
      <a-table :columns="projectColumns" :data-source="projectShow">
        <span slot="time" slot-scope="record">
          <p style="font-size: 8px;">{{ record.CreateTime }}</p>
        </span>
        <span slot="usable" slot-scope="record">
          <a-icon v-if="record.Usable" type="check-circle" theme="twoTone" two-tone-color="#52c41a"/>
          <a-icon v-else type="close-circle" theme="twoTone" two-tone-color="#eb2f96"/>
        </span>
        <span slot="public" slot-scope="record">
          <a-icon v-if="record.IsPublic" type="check-circle" theme="twoTone" two-tone-color="#52c41a"/>
          <a-icon v-else type="close-circle" theme="twoTone" two-tone-color="#eb2f96"/>
        </span>
        <span slot="action" slot-scope="record">
          <router-link :to="'/business/project/detail/' + record.Id" :key="record.key">详情</router-link>
          <a-divider type="vertical" />
          <router-link :to="'#'">禁用</router-link>
          <a-divider type="vertical" />
          <router-link :to="'#'">删除</router-link>
        </span>
      </a-table>
    </page-layout>
  </a-card>
</template>

<script>
import {getProjectList} from '@/services/sql'
import PageLayout from '@/layouts/PageLayout'
import {UTCZ2UTC8} from '@/utils/time'

const projectColumns = [
  { title: 'ID', dataIndex: 'Id', key: 'id', width: 100,},
  { title: '名称', dataIndex: 'Name', key: 'name', width: 100,},
  { title: '备注', dataIndex: 'Describe', key: 'describe', width: 110,},
  { title: '拥有者', dataIndex: 'Owner', key: 'owner', width: 80,},
  { title: 'Fork', dataIndex: 'ForkFrom', key: 'forkfrom', width: 80,},
  { title: '创建时间', scopedSlots: { customRender: 'time' }, width: 130,},
  { title: '是否可用', scopedSlots: { customRender: 'usable' }, width: 45,},
  { title: '是否公开', scopedSlots: { customRender: 'public' }, width: 45,},
  { title: '操作', scopedSlots: { customRender: 'action' },width: 90,},
]

export default {
  name:"Project",
  components:{PageLayout},
  data(){
    return {
      projectColumns,
      projectShow:[],
    }
  },
  methods:{
    loadProjects(){
      getProjectList().then(res => {
        this.projectShow = res.data.data
        for(let ind = 0, end = this.projectShow.length; ind < end; ind++){
          this.projectShow[ind].key = ind
          this.projectShow[ind].CreateTime = UTCZ2UTC8(this.projectShow[ind].CreateTime)
        }
      })
    }
  },
  mounted(){
    this.loadProjects()
  }
}

</script>
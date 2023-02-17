<template>
  <a-card>
    <page-layout title='文件'>
      <a-button type="primary">创建</a-button>
      <a-button >刷新</a-button>
      <a-table :columns="filesColumns" :data-source="filesShow">
        <span slot="time" slot-scope="record">
          <p style="font-size: 8px;">created:<br/>{{ record.CreateTime }}</p>
          <p style="font-size: 8px;">updated:<br/>{{ record.UpdateTime }}</p>
        </span>
        <span slot="size" slot-scope="record">
          <p style="font-size:8px">{{ fileSize(record.Size) }}</p>
        </span>
        <span slot="action" slot-scope="record">
          <router-link :to="'#'" :key="record.key">删除</router-link>
        </span>
      </a-table>
    </page-layout>
  </a-card>
</template>

<script>
import {getFilesList} from '@/services/sql'
import PageLayout from '@/layouts/PageLayout'
import {UTCZ2UTC8} from '@/utils/time'
const filesColumns = [
  { title: 'ID', dataIndex: 'Id', key: 'id', width: 100,},
  { title: '名称', dataIndex: 'Name', key: 'name', width: 100,},
  { title: '位置', dataIndex: 'Path', key: 'path', width: 110,},
  { title: '创建者', dataIndex: 'Creator', key: 'creator', width: 80,},
  { title: '时间', scopedSlots: { customRender: 'time' }, width: 130,},
  { title: '大小', scopedSlots: { customRender: 'size' }, width: 45,},
  { title: '操作', scopedSlots: { customRender: 'action' },width: 80,},
]

export default {
  name:"Files",
  components:{PageLayout},
  data(){
    return {
      filesColumns,
      filesShow:[],
    }
  },
  methods:{
    loadFiless(){
      getFilesList().then(res => {
        this.filesShow = res.data.data
        for(let ind = 0, end = this.filesShow.length; ind < end; ind++){
          this.filesShow[ind].key = ind
          this.filesShow[ind].CreateTime = UTCZ2UTC8(this.filesShow[ind].CreateTime)
          this.filesShow[ind].UpdateTime = UTCZ2UTC8(this.filesShow[ind].UpdateTime)
        }
      })
    },
    fileSize(fileSize){
      let dw = ['B', 'K', 'M', 'G','T','P']
      let dw_ind = 0
      while(fileSize > 1024){
        fileSize = fileSize / 1024
        dw_ind++
      }
      return Math.floor(fileSize) + dw[dw_ind]
    }
  },
  mounted(){
    this.loadFiless()
  },
  computed:{
    
  }
}

</script>
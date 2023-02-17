<template>
  <a-card>
    <page-layout title='节点选择Tag'>
      <a-button type="primary">创建</a-button>
      <a-button >刷新</a-button>
      <a-table :columns="tagColumns" :data-source="tagShow">
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
          <router-link :to="'#'" :key="record.key">编辑</router-link>
          <a-divider type="vertical" />
          <router-link :to="'#'">删除</router-link>
        </span>
      </a-table>
    </page-layout>
  </a-card>
</template>

<script>
import {getNodeTagList} from '@/services/sql'
import PageLayout from '@/layouts/PageLayout'
import {UTCZ2UTC8} from '@/utils/time'
const tagColumns = [
  { title: 'ID', dataIndex: 'Id', key: 'id', width: 100,},
  { title: '键', dataIndex: 'Key', key: 'key', width: 100,},
  { title: '值', dataIndex: 'Value', key: 'value', width: 110,},
  { title: '是否公开', scopedSlots: { customRender: 'public' }, width: 45,},
  { title: '操作', scopedSlots: { customRender: 'action' },width: 90,},
]

export default {
  name:"Tag",
  components:{PageLayout},
  data(){
    return {
      tagColumns,
      tagShow:[],
    }
  },
  methods:{
    loadTags(){
      getNodeTagList().then(res => {
        this.tagShow = res.data.data
        for(let ind = 0, end = this.tagShow.length; ind < end; ind++){
          this.tagShow[ind].key = ind
          this.tagShow[ind].CreateTime = UTCZ2UTC8(this.tagShow[ind].CreateTime)
        }
      })
    }
  },
  mounted(){
    this.loadTags()
  }
}

</script>
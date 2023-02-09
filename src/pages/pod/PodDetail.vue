<template>
  <a-card>
    <page-layout :title="$route.params.id">
      <detail-list size="small" :col="2" slot="headerContent">
      <detail-list-item term="名称">{{ podShow.name }}</detail-list-item>
      <detail-list-item term="命名空间">{{ podShow.namespace }}</detail-list-item>
      <detail-list-item term="创建时间">{{ podShow.createTime }}</detail-list-item>
      <detail-list-item term="状态">{{ podShow.status }}</detail-list-item>
      <detail-list-item term="节点">{{ podShow.nodeName }}</detail-list-item>
      <detail-list-item term="Pod IP">{{ podShow.podIP }}</detail-list-item>
      </detail-list>
      <a-divider />
      <a-card>
        <h3>标签:</h3>
        <div style="float: left;" :key="label.key" v-for="label in podShow.labels">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ "" + label.key + ":" + label.value }}</span>
          </template>
          <a-tag style="overflow: hidden;max-width: 500px;" >{{ "" + label.key + ":" + label.value }}</a-tag>
        </a-tooltip>
        </div>
      </a-card>
      <a-card>
        <h3>注释:</h3>
        <div style="float: left;" :key="annotation.key" v-for="annotation in podShow.annotations">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ "" + annotation.key + ":" + annotation.value }}</span>
          </template>
          <a-tag style="overflow: hidden;max-width: 500px;" >{{ "" + annotation.key + ":" + annotation.value }}</a-tag>
        </a-tooltip>
        </div>
      </a-card>
      <a-card>
        <h3>状态:</h3>
        <a-table style="font-size: 8px;" :columns="conditionColumns" :data-source="podShow.conditions"></a-table>
      </a-card>
      <a-card>
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="容器">
            Content of Tab Pane 1
          </a-tab-pane>
          <a-tab-pane key="2" tab="事件" force-render>
            Content of Tab Pane 2
          </a-tab-pane>
          <a-tab-pane key="3" tab="创建者">
            Content of Tab Pane 3
          </a-tab-pane>
          <a-tab-pane key="4" tab="初始化容器">
            Content of Tab Pane 3
          </a-tab-pane>
          <a-tab-pane key="5" tab="存储">
            Content of Tab Pane 3
          </a-tab-pane>
          <a-tab-pane key="6" tab="日志">
            Content of Tab Pane 3
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </page-layout>
  </a-card>
</template>
<script>
import PageLayout from '@/layouts/PageLayout'
import DetailList from '@/components/tool/DetailList'
import {getPodByName} from '@/services/k8s'
const DetailListItem = DetailList.Item
export default {
  name: "PodDetail",
  components: {DetailListItem, DetailList, PageLayout},
  data(){
    return {
      conditionColumns:[
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          width: 110,
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 65,
        },
        {
          title: '最近更改',
          dataIndex: 'lastTransitionTime',
          key: 'lastTransitionTime',
          width: 120,
        },
        {
          title: '内容',
          dataIndex: 'reason',
          key: 'reason',
          width: 120,
        },
        {
          title: '信息',
          dataIndex: 'message',
          key: 'message',
          width: 120,
        }
      ],
      podShow:{
        name:""
      },
      podSave:{}
    }
  },
  methods:{
    async loadPod(){
      getPodByName(this.$route.query.namespace, this.$route.params.id).then(res => {
          this.podSave = res.data.data
					this.podShow.name = this.podSave.metadata.name
          this.podShow.namespace = this.podSave.metadata.namespace
					this.podShow.createTime = this.podSave.metadata.creationTimestamp
					this.podShow.status = this.podSave.status.phase
					this.podShow.nodeName = this.podSave.spec.nodeName
					this.podShow.podIP = this.podSave.status.podIP
          this.podShow.labels = []
					for (let k in this.podSave.metadata.labels) {
						this.podShow.labels.push({key:k,value:this.podSave.metadata.labels[k]})
					}
          this.podShow.annotations = []
					for (let k in this.podSave.metadata.annotations) {
						this.podShow.annotations.push({key:k,value:this.podSave.metadata.annotations[k]})
					}
          this.podShow.conditions = this.podSave.status.conditions
					let end = this.podShow.conditions.length
					for(let ind = 0; ind < end; ind++)this.podShow.conditions[ind].key = ind
      })
    },
    callback(key) {
      console.log(key);
    },
  },
  mounted(){
    this.loadPod()
  }
}

</script>
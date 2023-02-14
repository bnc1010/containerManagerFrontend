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
        <a-tabs default-active-key="6 " @change="changeTab">
          <a-tab-pane key="1" tab="容器">
            <a-table :columns="containerColumns" :data-source="containerShow">
              <div class="containerInfo" slot="expandedRowRender" slot-scope="record" style="margin: 0">
                <span v-if="record.imagePullPolicy.length > 0">
                  <div style="float: left;"><h4>镜像拉取策略</h4></div>
                  <div style="margin-left: 200px;"><h4>{{ record.imagePullPolicy }}</h4></div>
                </span>
                <span v-if="record.env.length > 0">
                  <div style="float: left;"><h4>环境变量</h4></div>
                  <div style="margin-left: 200px;">
                    <h4 :key="env.key" v-for="env in record.env">{{ env.key + ':' + env.value}}</h4>
                  </div>
                </span>
                <span v-if="record.requests.length > 0">
                  <div style="float: left;"><h4>所需资源</h4></div>
                  <div style="margin-left: 200px;"><h4>{{ record.requests }}</h4></div>
                </span>
                <span v-if="record.limits.length > 0">
                  <div style="float: left;"><h4>资源限制</h4></div>
                  <div style="margin-left: 200px;"><h4>{{ record.limits }}</h4></div>
                </span>
                <span v-if="record.command.length > 0">
                  <div style="float: left;"><h4>命令</h4></div>
                  <div style="margin-left: 200px;"><h4>{{ record.command }}</h4></div>
                </span>
              </div>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2" tab="事件">
            <a-table class="eventTable" :columns="eventColumns" :data-source="eventShow"></a-table>
          </a-tab-pane>
          <a-tab-pane key="3" tab="创建者">
            <a-table class="eventTable" :columns="ownerColumns" :data-source="podSave.metadata.ownerReferences"></a-table>
          </a-tab-pane>
          <a-tab-pane key="4" tab="初始化容器">
            暂无数据
          </a-tab-pane>
          <a-tab-pane key="5" tab="存储">
            <a-table :columns="volumeColumns" :data-source="volumeShow">
              <div slot="detail" slot-scope="record">
                <span :key="index" v-for="(value, item, index) in record.info">
                  <h4>{{ item + ":" +  value}}</h4>
                </span>
              </div>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="6" tab="日志">
            <div style="float: left;"><h3>容器:</h3></div>
            <a-select :default-value="logContainer" style="width: 120px;float: left;" @change="refreshLog">
              <a-select-option :key="container.key" v-for="container in containerShow"   :value="container.name">
                {{ container.name }}
              </a-select-option>
            </a-select>
            <div style="margin-left: 30px; float: left;"><h3>显示行数:</h3></div>
            <a-select :default-value="100" style="width: 120px;float: left;" @change="refreshLog">
              <a-select-option key="l50" value="1">50</a-select-option>
              <a-select-option key="l100" value="2">100</a-select-option>
              <a-select-option key="l200" value="3">200</a-select-option>
            </a-select>
            <a-button style="float: right; margin-right: 20px;" type="primary" @click="refreshLog">刷新</a-button>
            <div style="margin-top: 50px;min-height: 450px;max-height: 450px;background-color: #404040;color:#dedede;overflow-y:auto;">
              <pre style="word-break:break-all; white-space: pre-wrap; padding: 10px 20px;">{{ log }}</pre>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </page-layout>
  </a-card>
</template>
<script>
import PageLayout from '@/layouts/PageLayout'
import DetailList from '@/components/tool/DetailList'
import {getPodByName, getPodEvent, getContainerLog} from '@/services/k8s'
import {UTCZ2UTC8} from '@/utils/time'
const DetailListItem = DetailList.Item

const containerColumns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '镜像', dataIndex: 'image', key: 'image' },
  { title: '端口', dataIndex: 'ports', key: 'ports' },
];

const eventColumns = [
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '对象', dataIndex: 'objectName', key: 'objectName', width: 150 },
  { title: '信息', dataIndex: 'message', key: 'message', width: 300},
  { title: '内容', dataIndex: 'reason', key: 'reason' },
  { title: '时间', dataIndex: 'time', key: 'time', width: 150 },
];

const conditionColumns=[
  { title: '类型', dataIndex: 'type', key: 'type', width: 110,},
  { title: '状态', dataIndex: 'status', key: 'status', width: 65,},
  { title: '最近更改', dataIndex: 'lastTransitionTime', key: 'lastTransitionTime', width: 110,},
  { title: '内容', dataIndex: 'reason', key: 'reason', width: 120,},
  { title: '信息', dataIndex: 'message', key: 'message', width: 120,}
]

const ownerColumns=[
  { title: '名称', dataIndex: 'name', key: 'name', width: 110,},
  { title: '类型', dataIndex: 'kind', key: 'kind', width: 110,}
]

const volumeColumns=[
  { title: '名称', dataIndex: 'name', key: 'name', width: 150,},
  { title: '类型', dataIndex: 'type', key: 'type', width: 100,},
  { title: '详情', scopedSlots: { customRender: 'detail' }},
]

export default {
  name: "PodDetail",
  components: {DetailListItem, DetailList, PageLayout},
  data(){
    return {
      containerColumns,
      conditionColumns,
      eventColumns,
      ownerColumns,
      volumeColumns,
      podShow:{
        name:""
      },
      podSave:{metadata:{}},
      containerShow:[],
      eventShow:[],
      volumeShow:[],
      logContainer:"",
      lines:2,
      log:""
    }
  },
  methods:{
    async loadPod(){
      getPodByName(this.$route.query.namespace, this.$route.params.id).then(res => {
          this.podSave = res.data.data
					this.podShow.name = this.podSave.metadata.name
          this.podShow.namespace = this.podSave.metadata.namespace
					this.podShow.createTime = UTCZ2UTC8(this.podSave.metadata.creationTimestamp)
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
					for(let ind = 0; ind < end; ind++){
            this.podShow.conditions[ind].key = ind
            this.podShow.conditions[ind].lastTransitionTime = UTCZ2UTC8(this.podShow.conditions[ind].lastTransitionTime)
          }
          this.loadContainer(this.podSave.spec.containers)
          this.loadVolume(this.podSave.spec.volumes)
      })
    },
    async loadEvent(){
      await getPodEvent(this.$route.query.namespace, 'involvedObject.name='+this.$route.params.id).then(res => {
        let events = res.data.data.items
        this.eventShow = []
        for(let ind = 0, end = events.length; ind < end; ind++){
          this.eventShow.push({
            key:ind,
            type:events[ind].type,
            objectType:events[ind].involvedObject.kind,
            objectName:events[ind].involvedObject.name,
            message:events[ind].message,
            reason:events[ind].reason,
            time:UTCZ2UTC8(events[ind].eventTime ? events[ind].eventTime : events[ind].lastTimestamp)
          })
        }
      })
    },
    loadContainer(containers){
      let end = containers.length
      this.containerShow = []
      for(let ind = 0; ind < end; ind++){
        let portShow = ''
        if(containers[ind].ports)for(let p = 0,pEnd = containers[ind].ports.length; p < pEnd; p++)portShow += containers[ind].ports[p].protocol + " " + containers[ind].ports[p].containerPort + "\t"
        let requestShow = ''
        if(containers[ind].resources.requests)
        for(let k in containers[ind].resources.requests){
          requestShow += '' + k + " " + containers[ind].resources.requests[k] + '\t'
        }
        let limitShow = ''
        if(containers[ind].resources.limits)
        for(let k in containers[ind].resources.limits){
          limitShow += '' + k + " " + containers[ind].resources.limits[k] + '\t'
        }
        let envShow = []
        if(containers[ind].env)
        for(let e = 0, eEnd = containers[ind].env.length; e < eEnd; e++){
          envShow.push({key:containers[ind].env[e].name, value: (containers[ind].env[e].value ? containers[ind].env[e].value : "-")})
        }
        let commandShow = ''
        if(containers[ind].command)
        for(let c = 0, cEnd = containers[ind].command.length; c < cEnd; c++)commandShow += containers[ind].command[c] + ' '
        this.containerShow.push({
          key: ind,
          name: containers[ind].name,
          image: containers[ind].image,
          ports: portShow,
          imagePullPolicy: containers[ind].imagePullPolicy,
          limits: limitShow,
          requests: requestShow,
          command: commandShow,
          env: envShow
        })
      }
      this.logContainer = this.containerShow[0].name
    },
    loadVolume(volumes){
      for(let ind = 0, end = volumes.length; ind < end; ind++){
        let _type = 'unknow'
        for(let k in volumes[ind]){
          if(k != 'name'){_type = k; break}
        }
        this.volumeShow.push({
          name:volumes[ind].name,
          type:_type,
          info:volumes[ind][_type]
        })
      }
    },
    loadLog(){
      let lineCount = 100
      if(this.lines == 1)lineCount=50
      else if(this.lines == 3)lineCount=200
      getContainerLog(this.$route.query.namespace, this.$route.params.id, this.logContainer, lineCount).then(res => {
        this.log=res.data.data
      })
    },
    changeTab(key) {
      switch(key){
        case "1":{
          break
        }
        case "2":{
          this.loadEvent()
          break
        }
        case "3":{
          break
        }
        case "4":{
          break
        }
        case "5":{
          break
        }
        case "6":{
          this.loadLog()
          break
        }
      }
    },
    refreshLog(){
      this.loadLog()
    }
  },
  mounted(){
    this.loadPod()
  }
}

</script>

<style lang="less">
.containerInfo{
  span{
    margin-top: 25px;
  }
}

.eventTable{
  .ant-table-tbody{
    font-size: 8px;
  }
}
</style>
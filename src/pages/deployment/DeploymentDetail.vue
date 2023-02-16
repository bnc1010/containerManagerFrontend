<template>
  <a-card>
    <page-layout :title="$route.params.id">
      <detail-list size="small" :col="2" slot="headerContent">
      <detail-list-item term="名称">{{ deploymentShow.name }}</detail-list-item>
      <detail-list-item term="创建时间">{{ deploymentShow.createTime }}</detail-list-item>
      <detail-list-item term="命名空间">{{ deploymentShow.namespace }}</detail-list-item>
      <detail-list-item term="策略">{{ deploymentShow.strategy.type }}</detail-list-item>
      <detail-list-item term="滚动升级策略">
        超过期望的Pod数量:{{ deploymentShow.strategy.rollingUpdate.maxSurge }}<br/>
        不可用Pod最大数量:{{ deploymentShow.strategy.rollingUpdate.maxUnavailable }}
      </detail-list-item>
      
      </detail-list>
      <a-divider />
      <a-card>
        <h3>选择器:</h3>
        <div style="float: left;" :key="selector.key" v-for="selector in deploymentShow.selectors">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ "" + selector.key + ":" + selector.value }}</span>
          </template>
          <a-tag style="overflow: hidden;max-width: 500px;" >{{ "" + selector.key + ":" + selector.value }}</a-tag>
        </a-tooltip>
        </div>
      </a-card>
      <a-card>
        <h3>标签:</h3>
        <div style="float: left;" :key="label.key" v-for="label in deploymentShow.labels">
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
        <div style="float: left;" :key="annotation.key" v-for="annotation in deploymentShow.annotations">
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
        <span><p style="font-size: 8px;">就绪：{{ deploymentShow.readyReplicas }}/{{ deploymentShow.replicas }}个，已更新：{{ deploymentShow.updatedReplicas }}个，可用：{{ deploymentShow.availableReplicas }}个</p></span>
        <a-table style="font-size: 8px;" :columns="conditionColumns" :data-source="deploymentShow.conditions"></a-table>
      </a-card>
      <a-card>
        <a-tabs default-active-key="1" @change="changeTab">
          <a-tab-pane key="1" tab="容器组">
            <a-table :columns="podColumns" :data-source="podShow">
            <span slot="action" slot-scope="record">
              <router-link :to="'/pod/detail/' + record.name + '?namespace=' + record.namespace">详情</router-link>
            </span>
            <span slot="status" slot-scope="text,record" >
              <a-tooltip placement="right" overlayClassName="tooltip_150px">
                <template slot="title">
                  <p style="font-size: 8px;">
                  {{ record.showCondition }}
                  </p>
                </template>
                <div v-if="record.statusAllOk">
                  <div style="color: #52c41a;">{{ record.status  }}</div>
                  <!-- <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a"/> -->
                </div>
                <div v-else>
                  <div style="color: #FF7D40;">{{ record.status  }}</div>
                  <!-- <a-icon type="exclamation-circle" theme="twoTone" two-tone-color="#FF7D40" /> -->
                </div>
              </a-tooltip>
              </span>
              <span slot="labels" slot-scope="text,record">
                <div style="float: left;" :key="label.key" v-for="label in record.labels">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ "" + label.key + ":" + label.value }}</span>
                    </template>
                    <a-tag style="overflow: hidden;max-width: 60px;" >{{ "" + label.key + ":" + label.value }}</a-tag>
                  </a-tooltip>
                </div>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2" tab="访问方式">
            <a-table class="eventTable" :columns="serviceColumns" :data-source="serviceShow">
              <div slot="epIn" slot-scope="record">
                <span :key="index" v-for="(item, index) in record.endpointIn">
                  <p style="font: 8px;">{{ item }}</p>
                </span>
              </div>
              <div slot="epOut" slot-scope="record">
                <span :key="index" v-for="(item, index) in record.endpointOut">
                  <p style="font: 8px;">{{ item }}</p>
                </span>
              </div>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </page-layout>
  </a-card>
</template>
<script>
import PageLayout from '@/layouts/PageLayout'
import DetailList from '@/components/tool/DetailList'
import {getDeploymentByName, getDeploymentEvent, getPodsOfOneNamespace, getServicesfOneNamespace} from '@/services/k8s'
import {UTCZ2UTC8} from '@/utils/time'
const DetailListItem = DetailList.Item

const serviceColumns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '命名空间', dataIndex: 'namespace', key: 'namespace' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '集群IP', dataIndex: 'clusterIP', key: 'clusterIP' },
  { title: '内部端点', scopedSlots: { customRender: 'epIn' } },
  { title: '外部端点', scopedSlots: { customRender: 'epOut' } },
];

const podColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 110,},
  { title: '标签', scopedSlots: { customRender: 'labels' }, width: 60,},
  { title: '状态', scopedSlots: { customRender: 'status' }, width: 100,},
  { title: '重启次数', dataIndex: 'restartCount', key: 'restartCount', width: 60,},
  { title: 'Pod IP', dataIndex: 'podIP', key: 'podIP', width: 130,},
  { title: '节点', dataIndex: 'nodeName', key: 'nodeName', width: 120,},
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 120,},
  { title: '操作', scopedSlots: { customRender: 'action' },},
]

const conditionColumns=[
  { title: '类型', dataIndex: 'type', key: 'type', width: 110,},
  { title: '状态', dataIndex: 'status', key: 'status', width: 65,},
  { title: '最近更改', dataIndex: 'lastTransitionTime', key: 'lastTransitionTime', width: 110,},
  { title: '内容', dataIndex: 'reason', key: 'reason', width: 120,},
  { title: '信息', dataIndex: 'message', key: 'message', width: 120,}
]

export default {
  name: "DeploymentDetail",
  components: {DetailListItem, DetailList, PageLayout},
  data(){
    return {
      conditionColumns,
      podColumns,
      serviceColumns,
      deploymentShow:{strategy:{rollingUpdate:{}}},
      deploymentSave:{},
      eventShow:[],
      logContainer:"",
      lines:2,
      log:"",
      podShow:[],
      podShowBK:[],
      podSave:[],
      serviceShow:[]
    }
  },
  methods:{
    async loadDeployment(){
      await getDeploymentByName(this.$route.query.namespace, this.$route.params.id).then(res => {
          this.deploymentSave = res.data.data
					this.deploymentShow.name = this.deploymentSave.metadata.name
          this.deploymentShow.namespace = this.deploymentSave.metadata.namespace
					this.deploymentShow.createTime = UTCZ2UTC8(this.deploymentSave.metadata.creationTimestamp)
          this.deploymentShow.labels = []
          this.deploymentShow.selectors = []
          this.deploymentShow.selectorsMap = {}
          this.deploymentShow.availableReplicas = this.deploymentSave.status.availableReplicas
          this.deploymentShow.readyReplicas = this.deploymentSave.status.readyReplicas
          this.deploymentShow.replicas = this.deploymentSave.status.replicas
          this.deploymentShow.updatedReplicas = this.deploymentSave.status.updatedReplicas
          this.deploymentShow.strategy = this.deploymentSave.spec.strategy
					for (let k in this.deploymentSave.metadata.labels) {
						this.deploymentShow.labels.push({key:k,value:this.deploymentSave.metadata.labels[k]})
					}
          this.deploymentShow.annotations = []
					for (let k in this.deploymentSave.metadata.annotations) {
						this.deploymentShow.annotations.push({key:k,value:this.deploymentSave.metadata.annotations[k]})
					}
          this.deploymentShow.conditions = this.deploymentSave.status.conditions
					let end = this.deploymentShow.conditions.length
					for(let ind = 0; ind < end; ind++){
            this.deploymentShow.conditions[ind].key = ind
            this.deploymentShow.conditions[ind].lastTransitionTime = UTCZ2UTC8(this.deploymentShow.conditions[ind].lastTransitionTime)
          }
					for (let k in this.deploymentSave.spec.selector) {
            for (let j in this.deploymentSave.spec.selector[k]){
              this.deploymentShow.selectors.push({key:j,value:this.deploymentSave.spec.selector[k][j]})
              this.deploymentShow.selectorsMap[j]=this.deploymentSave.spec.selector[k][j]
            }
          }
          
          // this.loadContainer(this.deploymentSave.spec.containers)
          // this.loadVolume(this.deploymentSave.spec.volumes)
      })
      this.loadPod()
    },
    async loadEvent(){
      await getDeploymentEvent(this.$route.query.namespace, 'involvedObject.name='+this.$route.params.id).then(res => {
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
    loadPod(){
      let labelSelector = ""
      let isFirst = true
      for(let k in this.deploymentShow.selectors){
        if(!isFirst)labelSelector += ','
        else isFirst=false
        labelSelector += this.deploymentShow.selectors[k].key + '=' + this.deploymentShow.selectors[k].value
      }
      getPodsOfOneNamespace(this.deploymentShow.namespace, "", labelSelector).then(res => {
        this.podSave = res.data.data.items
        let end = this.podSave.length
        this.podShow = []
        for(let ind = 0; ind < end; ind++){
          let showLabel = [];
          for (let k in this.podSave[ind].metadata.labels) {
              showLabel.push({key:k, value:this.podSave[ind].metadata.labels[k]});
          }
          let showCondition = "";
          let k_end = this.podSave[ind].status.conditions.length
          let allOK = true;
          for (let k = 0; k < k_end; k++ ) {
            allOK &= "True" == this.podSave[ind].status.conditions[k].status;
            showCondition += "" + this.podSave[ind].status.conditions[k].type + ":" + this.podSave[ind].status.conditions[k].status + "\n"
          }
          let restartCount = 0
          k_end = this.podSave[ind].status.containerStatuses.length
          for(let k = 0; k < k_end; k++){
            restartCount = restartCount > this.podSave[ind].status.containerStatuses[k].restartCount ? restartCount : this.podSave[ind].status.containerStatuses[k].restartCount
          }
          this.podShow.push({
            key:ind,
            name: this.podSave[ind].metadata.name,
            labels:showLabel,
            status:this.podSave[ind].status.phase,
            podIP:this.podSave[ind].status.podIP,
            hostIP:this.podSave[ind].status.hostIP,
            showCondition:showCondition,
            restartCount:restartCount,
            nodeName:this.podSave[ind].spec.nodeName,
            createTime:UTCZ2UTC8(this.podSave[ind].metadata.creationTimestamp),
            statusAllOk:allOK,
            namespace:this.podSave[ind].metadata.namespace,
            cpu:[],
            mem:[],
            cpu_json:"[]",
            mem_json:"[]",
          })
          this.podShowBK = this.deepclone(this.podShow)
        }
      })
    },
    deepclone(ob){
      let json_bk = JSON.stringify(ob)
      return JSON.parse(json_bk)
    },
    loadService(){
      this.serviceShow = []
      getServicesfOneNamespace(this.deploymentShow.namespace, "", "").then(res => {
        let services = res.data.data.items
        for(let ind = 0, end = services.length; ind < end; ind++) {
          let isIn = false
          if(services[ind].spec.selector){
            isIn = true
            for(let k in services[ind].spec.selector){
              if(!(this.deploymentShow.selectorsMap[k] && this.deploymentShow.selectorsMap[k] == services[ind].spec.selector[k])){
                isIn = false
                break
              }
            }
          }
          if(isIn){
            let endpointOut = []
            let endpointIn  = []
            for(let _i = 0, iEnd = services[ind].spec.ports.length; _i < iEnd; _i++){
              if(services[ind].spec.ports[_i].nodePort){
                endpointOut.push(services[ind].metadata.name + ':' + services[ind].spec.ports[_i].nodePort + services[ind].spec.ports[_i].protocol + '=>' + services[ind].spec.ports[_i].targetPort)
              }
              if(services[ind].spec.ports[_i].port){
                endpointIn.push(services[ind].metadata.name + ':' + services[ind].spec.ports[_i].port + services[ind].spec.ports[_i].protocol + '=>' + services[ind].spec.ports[_i].targetPort)
              }
            }
            this.serviceShow.push({
              name:services[ind].metadata.name,
              namespace:services[ind].metadata.namespace,
              type:services[ind].spec.type,
              clusterIP:services[ind].spec.clusterIP,
              endpointOut:endpointOut,
              endpointIn:endpointIn
            }) 
          }
          
          
        }
        // console.log(this.serviceShow)
      })
    },
    changeTab(key) {
      switch(key){
        case "1":{
          this.loadPod()
          break
        }
        case "2":{
          this.loadService()
          break
        }
        case "3":{
          break
        }
      }
    },
    refreshLog(){
      this.loadLog()
    }
  },
  mounted(){
    this.loadDeployment()
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
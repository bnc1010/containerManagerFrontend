<template>
	<a-card>
  <page-layout :title="$route.params.id">
    <detail-list size="small" :col="2" slot="headerContent">
      <detail-list-item term="名称">{{ nodeShow.name }}</detail-list-item>
      <detail-list-item term="创建时间">{{ nodeShow.createTime }}</detail-list-item>
      <detail-list-item term="UID">{{ nodeShow.uid }}</detail-list-item>
      <detail-list-item term="容器组 CIDR">{{ nodeShow.cidr }}</detail-list-item>
      <detail-list-item term="提供者">{{ nodeShow.providerID }}</detail-list-item>
			<detail-list-item term="IP">{{ nodeShow.ip }}</detail-list-item>
			<a-divider />
			<detail-list-item term="系统镜像">{{ nodeShow.osImage }}</detail-list-item>
			<detail-list-item term="内核版本">{{ nodeShow.kernelVersion }}</detail-list-item>
			<detail-list-item term="kubelet版本">{{ nodeShow.kubeletVersion }}</detail-list-item>
			<detail-list-item term="kube-Proxy版本">{{ nodeShow.kubeProxyVersion }}</detail-list-item>
			<detail-list-item term="机器ID">{{ nodeShow.machineID }}</detail-list-item>
			<detail-list-item term="系统UUID">{{ nodeShow.systemUUID }}</detail-list-item>
			<detail-list-item term="启动ID">{{ nodeShow.bootID }}</detail-list-item>
			<detail-list-item term="容器运行时版本">{{ nodeShow.containerRuntimeVersion }}</detail-list-item>
			<detail-list-item term="操作系统">{{ nodeShow.operatingSystem }}</detail-list-item>
			<detail-list-item term="架构">{{ nodeShow.architecture }}</detail-list-item>
			
		</detail-list>

	<a-card>
		<h3>标签:</h3>
		<div style="float: left;" :key="label.key" v-for="label in nodeShow.labels">
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
		<div style="float: left;" :key="annotation.key" v-for="annotation in nodeShow.annotations">
		<a-tooltip placement="top">
			<template slot="title">
				<span>{{ "" + annotation.key + ":" + annotation.value }}</span>
			</template>
			<a-tag style="overflow: hidden;max-width: 500px;" >{{ "" + annotation.key + ":" + annotation.value }}</a-tag>
		</a-tooltip>
		</div>
	</a-card>
	<a-card>
		<h3>污点:</h3>
		<div style="float: left;" :key="taint.key" v-for="taint in nodeShow.taints">
		<a-tooltip placement="top">
			<template slot="title">
				<span>{{ "" + taint.key + ":" + taint.effect + " timeAdded:" + taint.timeAdded }}</span>
			</template>
			<a-tag style="overflow: hidden;max-width: 500px;" >{{ "" + taint.key + ":" + taint.effect }}</a-tag>
		</a-tooltip>
		</div>
	</a-card>
	<a-card>
		<h3>状态:</h3>
		<a-table style="font-size: 8px;" :columns="conditionColumns" :data-source="nodeShow.conditions"></a-table>
	</a-card>
	<a-card>
		<h3>容器组:</h3>
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
      <span slot="useage" slot-scope="record">
        <div style="height: 30px;"><MiniArea v-bind:sdata="record.cpu_json" :height="25" :width="100"></MiniArea></div>
        <div style="height: 30px;margin-top: 10px ;"><MiniArea v-bind:sdata="record.mem_json" :height="25" :width="100"></MiniArea></div>
      </span>
    </a-table>
	</a-card>
	</page-layout>
</a-card>
</template>
<script>
import {getNode, getPodsOfOneNode,  getPodCPU, getPodMemory} from '@/services/k8s'
import PageLayout from '@/layouts/PageLayout'
import DetailList from '@/components/tool/DetailList'
import {UTCZ2UTC8} from '@/utils/time'
import MiniArea from '@/components/chart/MiniArea.vue'
const DetailListItem = DetailList.Item
const podColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 110,},
  { title: '标签', scopedSlots: { customRender: 'labels' }, width: 60,},
  { title: '状态', scopedSlots: { customRender: 'status' }, width: 80,},
  { title: '重启次数', dataIndex: 'restartCount', key: 'restartCount', width: 50,},
  { title: 'Pod IP', dataIndex: 'podIP', key: 'podIP', width: 120,},
  { title: '节点', dataIndex: 'nodeName', key: 'nodeName', width: 120,},
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 120,},
  { title: '用量', scopedSlots: { customRender: 'useage' },  width: 150},
  { title: '操作', scopedSlots: { customRender: 'action' },},
]

const conditionColumns=[
	{ title: '类型', dataIndex: 'type', key: 'type', width: 110,},
	{ title: '状态', dataIndex: 'status', key: 'status', width: 65,},
	{ title: '最近心跳', dataIndex: 'lastHeartbeatTime', key: 'lastHeartbeatTime', width: 100,},
	{ title: '最近更改', dataIndex: 'lastTransitionTime', key: 'lastTransitionTime', width: 100,},
	{ title: '内容', dataIndex: 'reason', key: 'reason', width: 120,},
	{ title: '信息', dataIndex: 'message', key: 'message', width: 120,}
]

export default {
    name: 'NodeDetail',
		components: {DetailListItem, DetailList, PageLayout, MiniArea},
    data(){
			return {
				nodeSave:{},
				nodeShow:{
					name:"",
					creationTime:"",
					uid:"",
					cidr:"",
					providerID:"",
					ip:"",
					labels:[],
					annotations:[],
					taints:[],
					osImage:"",
					kernelVersion:"",
					kubeletVersion:"",
					kubeProxyVersion:"",
					machineID:"",
					systemUUID:"",
					bootID:"",
					containerRuntimeVersion:"",
					operatingSystem:"",
					architecture:"",
				},
				conditionColumns,
				podColumns,
				podShow:[],
				podSave:[],
			}
    },
    methods:{
			async loadNode(){
				let nodeName = this.$route.params.id
				await getNode(nodeName).then(res => {
					this.nodeSave = res.data.data
					this.nodeShow.name = this.nodeSave.metadata.name
					this.nodeShow.createTime = UTCZ2UTC8(this.nodeSave.metadata.creationTimestamp)
					this.nodeShow.uid = this.nodeSave.metadata.uid
					this.nodeShow.cidr = this.nodeSave.spec.podCIDR
					this.nodeShow.providerID = this.nodeSave.spec.providerID
					this.nodeShow.osImage = this.nodeSave.status.nodeInfo.osImage
					this.nodeShow.kernelVersion = this.nodeSave.status.nodeInfo.kernelVersion
					this.nodeShow.kubeletVersion = this.nodeSave.status.nodeInfo.kubeletVersion
					this.nodeShow.kubeProxyVersion = this.nodeSave.status.nodeInfo.kubeProxyVersion
					this.nodeShow.machineID = this.nodeSave.status.nodeInfo.machineID
					this.nodeShow.systemUUID = this.nodeSave.status.nodeInfo.systemUUID
					this.nodeShow.bootID = this.nodeSave.status.nodeInfo.bootID
					this.nodeShow.containerRuntimeVersion = this.nodeSave.status.nodeInfo.containerRuntimeVersion
					this.nodeShow.operatingSystem = this.nodeSave.status.nodeInfo.operatingSystem
					this.nodeShow.architecture = this.nodeSave.status.nodeInfo.architecture

					let ip = {
						ExternalIP: "null",
						InternalIP: "null",
						Hostname: "null"
					};
					if (this.nodeSave.status.addresses[0])
							ip[this.nodeSave.status.addresses[0].type] = this.nodeSave.status.addresses[0].address;
					if (this.nodeSave.status.addresses[1])
							ip[this.nodeSave.status.addresses[1].type] = this.nodeSave.status.addresses[1].address;
					if (this.nodeSave.status.addresses[2])
							ip[this.nodeSave.status.addresses[2].type] = this.nodeSave.status.addresses[2].address;
					this.nodeShow.ip = 'ExternalIP:' + ip['ExternalIP'] + '/InternalIP:' + ip['InternalIP'] + '/Hostname:' + ip['Hostname']
					this.nodeShow.labels = []
					for (let k in this.nodeSave.metadata.labels) {
						this.nodeShow.labels.push({key:k,value:this.nodeSave.metadata.labels[k]})
					}
					this.nodeShow.annotations = []
					for (let k in this.nodeSave.metadata.annotations) {
						this.nodeShow.annotations.push({key:k,value:this.nodeSave.metadata.annotations[k]})
					}
					if(this.nodeSave.spec.taints)this.nodeShow.taints=this.nodeSave.spec.taints
					this.nodeShow.conditions = this.nodeSave.status.conditions
					let end = this.nodeShow.conditions.length
					for(let ind = 0; ind < end; ind++){
						this.nodeShow.conditions[ind].key = ind
						this.nodeShow.conditions[ind].lastHeartbeatTime = UTCZ2UTC8(this.nodeShow.conditions[ind].lastHeartbeatTime)
						this.nodeShow.conditions[ind].lastTransitionTime = UTCZ2UTC8(this.nodeShow.conditions[ind].lastTransitionTime)
					}
				})
			},
			async loadPodsOfTheNodes() {
				let fieldSelector = "spec.nodeName=" + this.$route.params.id
				await getPodsOfOneNode("", fieldSelector).then(res => {
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
					}
				})
			},
			async loadPodMetrics(){
				for(let ind = 0, end = this.podShow.length; ind < end; ind++){
					await getPodCPU(this.podShow[ind].namespace, this.podShow[ind].name).then(res => {
						let mlegth = res.data.data.metrics.length
						for(let _i = 0, _ed = mlegth > 20 ? 0 : 20 - mlegth; _i < _ed; _i++ )this.podShow[ind].cpu.push(0.0)
						for(let _i = mlegth > 20 ? mlegth - 20 : 0; _i < mlegth; _i ++)this.podShow[ind].cpu.push((res.data.data.metrics[_i].value / 1000).toFixed(2))
					})
					await getPodMemory(this.podShow[ind].namespace, this.podShow[ind].name).then(res => {
						let mlegth = res.data.data.metrics.length
						for(let _i = 0, _ed = mlegth > 20 ? 0 : 20 - mlegth; _i < _ed; _i++ )this.podShow[ind].mem.push(0.0)
						for(let _i = mlegth > 20 ? mlegth - 20 : 0; _i < mlegth; _i ++)this.podShow[ind].mem.push( (res.data.data.metrics[_i].value / (1024 * 1024)).toFixed(2))
					})
					this.podShow[ind].cpu_json = JSON.stringify(this.podShow[ind].cpu)
					this.podShow[ind].mem_json = JSON.stringify(this.podShow[ind].mem)
					// console.log(this.podShow[ind].cpu_json, this.podShow[ind].mem_json)
				}
			},
			async firstLoad(){
				await this.loadNode()
				await this.loadPodsOfTheNodes()
				this.loadPodMetrics()
			}
    },
		mounted(){
			this.firstLoad()
		}
}
</script>
<style lang="less">
.ant-table{
	font-size: 8px;
}
</style>

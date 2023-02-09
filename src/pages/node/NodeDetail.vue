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
		<!-- <a-table style="font-size: 8px;" :columns="conditionColumns" :data-source="nodeShow.conditions"></a-table> -->
	</a-card>
	</page-layout>
</a-card>
</template>
<script>
import {getNode, getPodsOfOneNode} from '@/services/k8s'
import PageLayout from '@/layouts/PageLayout'
import DetailList from '@/components/tool/DetailList'
const DetailListItem = DetailList.Item
export default {
    name: 'NodeDetail',
		components: {DetailListItem, DetailList, PageLayout},
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
						title: '最近心跳',
						dataIndex: 'lastHeartbeatTime',
						key: 'lastHeartbeatTime',
						width: 120,
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
				podColumns:[]
			}
    },
    methods:{
			loadNode(){
				let nodeName = this.$route.params.id
				getNode(nodeName).then(res => {
					this.nodeSave = res.data.data
					this.nodeShow.name = this.nodeSave.metadata.name
					this.nodeShow.createTime = this.nodeSave.metadata.creationTimestamp
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
					for(let ind = 0; ind < end; ind++)this.nodeShow.conditions[ind].key = ind
				})
			},
			loadPodsOfTheNodes() {
				let fieldSelector = "spec.nodeName=" + this.$route.params.id
				getPodsOfOneNode("", fieldSelector).then(res => {
					console.log(res.data)
				})
			}
    },
		mounted(){
			this.loadNode()
			this.loadPodsOfTheNodes()
		}
}
</script>
<style lang="less">
.ant-table{
	font-size: 8px;
}
</style>

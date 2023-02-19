<template>
<a-card>
  <page-layout title='Deployment'>
    <div style="height: 32px;">
      <div style="width:100px;float: left;"><h3>namespace:</h3></div>
      <a-select :default-value="namespace" style="width: 120px;float: left;" @change="namespaceChange">
        <a-select-option :key="ns" v-for="ns in namespaceAll"   :value="ns">
          {{ ns }}
        </a-select-option>
      </a-select>
      <div style="margin-left: 100px;float: left;">
        <a-input style="width: 140px;float: left;" v-model="searchContent" placeholder="请输入搜索内容" />
        <a-button type="primary" @click="searchDeployment">
          <a-icon type="search" />
        </a-button>
      </div>
    </div>
    <a-divider />
    <a-table :columns="deploymentColumns" :data-source="deploymentShow">
      <span slot="action" slot-scope="record">
        <router-link :to="'/k8s/deployment/detail/' + record.name + '?namespace=' + record.namespace">详情</router-link>
      </span>
      <span slot="labels" slot-scope="text,record">
        <div style="float: left;" :key="label.key" v-for="label in record.labels">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ "" + label.key + ":" + label.value }}</span>
            </template>
            <a-tag style="overflow: hidden;max-width: 150px;" >{{ "" + label.key + ":" + label.value }}</a-tag>
          </a-tooltip>
        </div>
      </span>
      <span slot="image" slot-scope="text,record">
        <div :key="img.key" v-for="img in record.image">
          <p style="font-size: 8px;">{{ img }}</p>
        </div>
      </span>
    </a-table>
  </page-layout>
</a-card>
</template>
<script>
const deploymentColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 110,},
  { title: '命名空间', dataIndex: 'namespace', key: 'namespace', width: 80,},
  { title: '标签', scopedSlots: { customRender: 'labels' }, width: 160,},
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 120,},
  { title: '容器组数量', dataIndex: 'replicas', key: 'replicas', width: 60,},
  { title: '镜像', scopedSlots: { customRender: 'image' }, width: 280,},
  { title: '操作', scopedSlots: { customRender: 'action' },},
]
import {getDeploymentsOfOneNamespace, getNamespaceList} from '@/services/k8s'
import PageLayout from '@/layouts/PageLayout'
import {UTCZ2UTC8} from '@/utils/time'
export default {
  name:"Deployment",
  components:{PageLayout},
  data(){
    return{
      deploymentColumns,
      namespace:"default",
      namespaceAll:[],
      deploymentShow:[],
      deploymentShowBK:[],
      deploymentSave:[],
      searchContent:"",
    }
  },
  methods:{
    async firstLoad(){
      await this.loadNamespceList()
      await this.loadDeployment()
    },
    async loadDeployment(){
      await getDeploymentsOfOneNamespace(this.namespace).then(res => {
        console.log(res.data.data)
        this.deploymentSave = res.data.data.items
        this.deploymentShow = []
        for(let ind = 0, end = this.deploymentSave.length; ind < end; ind++){
          let showLabel = [];
          for (let k in this.deploymentSave[ind].metadata.labels) {
              showLabel.push({key:k, value:this.deploymentSave[ind].metadata.labels[k]});
          }
          let image = []
          if (this.deploymentSave[ind].spec.template.spec) {
            for (let k = 0, kEnd = this.deploymentSave[ind].spec.template.spec.containers.length; k < kEnd; k++) {
              image.push(this.deploymentSave[ind].spec.template.spec.containers[k].image)
            }
          }
          this.deploymentShow.push({
            key:ind,
            image:image,
            name: this.deploymentSave[ind].metadata.name,
            labels:showLabel,
            replicas: this.deploymentSave[ind].status.readyReplicas + "/" + this.deploymentSave[ind].status.replicas,
            createTime:UTCZ2UTC8(this.deploymentSave[ind].metadata.creationTimestamp),
            namespace:this.deploymentSave[ind].metadata.namespace,
          })
          this.deploymentShowBK = this.deepclone(this.deploymentShow)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    async loadNamespceList(){
      await getNamespaceList().then(res => {
        let namespaceList = res.data.data.items
        let end = namespaceList.length
        this.namespaceAll = []
        for(let ind = 0; ind < end; ind++) {
          this.namespaceAll.push(namespaceList[ind].metadata.name)
        }
        // console.log(this.namespaceAll)
      })
    },
    async namespaceChange(value){
      this.namespace=value
      await this.loadDeployment()
    },
    searchChange(value){
      this.searchBy = value
    },
    searchDeployment(){
      this.deploymentShow = []
      let end = this.deploymentShowBK.length
      for(let ind = 0; ind < end; ind++){
        if(this.deploymentShowBK[ind].name.indexOf(this.searchContent) != -1){
          this.deploymentShow.push(this.deepclone(this.deploymentShowBK[ind]))
        }
      }
    },
    deepclone(ob){
      let json_bk = JSON.stringify(ob)
      return JSON.parse(json_bk)
    },
  },
  mounted(){
    this.firstLoad()
  }
}

</script>

<style lang="less">
.tooltip_150px{
  width: 150px;
  max-width: 150px !important;
}

</style>
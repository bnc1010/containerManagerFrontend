<template>
<a-card>
  <page-layout title='容器组'>
    <div style="height: 32px;">
      <div style="width:100px;float: left;"><h3>namespace:</h3></div>
      <a-select :default-value="namespace" style="width: 120px;float: left;" @change="namespaceChange">
        <a-select-option :key="ns" v-for="ns in namespaceAll"   :value="ns">
          {{ ns }}
        </a-select-option>
      </a-select>
      <div style="margin-left: 100px;float: left;">
        <a-select :default-value="0" style="width: 90px;float: left;" @change="searchChange">
          <a-select-option :key="search.ind" v-for="search in searchTypes"   :value="search.ind">
            {{ search.name }}
          </a-select-option>
        </a-select>
        <a-input style="width: 140px;float: left;" v-model="searchContent" placeholder="请输入搜索内容" />
        <a-button type="primary" @click="searchPod">
          <a-icon type="search" />
        </a-button>
      </div>
    </div>
    <a-divider />
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
  </page-layout>
</a-card>
</template>


<script>
const podColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 110,},
  { title: '标签', scopedSlots: { customRender: 'labels' }, width: 60,},
  { title: '状态', scopedSlots: { customRender: 'status' }, width: 100,},
  { title: '重启次数', dataIndex: 'restartCount', key: 'restartCount', width: 60,},
  { title: 'Pod IP', dataIndex: 'podIP', key: 'podIP', width: 130,},
  { title: '节点', dataIndex: 'nodeName', key: 'nodeName', width: 120,},
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 120,},
  { title: '用量', scopedSlots: { customRender: 'useage' },  width: 150},
  { title: '操作', scopedSlots: { customRender: 'action' },},
]
import {getPodsOfOneNamespace, getNamespaceList, getPodCPU, getPodMemory} from '@/services/k8s'
import PageLayout from '@/layouts/PageLayout'
import {UTCZ2UTC8} from '@/utils/time'
import MiniArea from '@/components/chart/MiniArea.vue'
export default {
  name:"Pod",
  components:{PageLayout, MiniArea},
  data(){
    return{
      podColumns,
      namespace:"default",
      namespaceAll:[],
      podShow:[],
      podShowBK:[],
      podSave:[],
      searchTypes:[{name:"名称",ind:0},{name:"节点",ind:1},{name:"Host IP",ind:2},{name:"Pod IP",ind:3},{name:"标签",ind:4}],
      searchBy:0,
      searchContent:"",
    }
  },
  methods:{
    async firstLoad(){
      await this.loadNamespceList()
      await this.loadPod()
      this.loadPodMetrics()
    },
    async loadPod(){
      await getPodsOfOneNamespace(this.namespace, "", "").then(res => {
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
      await this.loadPod()
      await this.loadPodMetrics()
    },
    searchChange(value){
      this.searchBy = value
    },
    searchPod(){
      this.podShow = []
      let end = this.podShowBK.length
      switch(this.searchBy){
        case 0:{
          for(let ind = 0; ind < end; ind++){
            if(this.podShowBK[ind].name.indexOf(this.searchContent) != -1){
              this.podShow.push(this.deepclone(this.podShowBK[ind]))
            }
          }
          break
        }
        case 1:{
          for(let ind = 0; ind < end; ind++){
            if(this.podShowBK[ind].nodeName.indexOf(this.searchContent) != -1){
              this.podShow.push(this.deepclone(this.podShowBK[ind]))
            }
          }
          break
        }
        case 2:{
          for(let ind = 0; ind < end; ind++){
            if(this.podShowBK[ind].hostIP.indexOf(this.searchContent) != -1){
              this.podShow.push(this.deepclone(this.podShowBK[ind]))
            }
          }
          break
        }
        case 3:{
          for(let ind = 0; ind < end; ind++){
            if(this.podShowBK[ind].podIP.indexOf(this.searchContent) != -1){
              this.podShow.push(this.deepclone(this.podShowBK[ind]))
            }
          }
          break
        }
        case 4:{
          for(let ind = 0; ind < end; ind++){
            for(let labelind=0,lend=this.podShowBK[ind].labels.length; labelind < lend; labelind++)
              if(this.podShowBK[ind].labels[labelind].key.indexOf(this.searchContent) != -1 || this.podShowBK[ind].labels[labelind].value.indexOf(this.searchContent) != -1){
                this.podShow.push(this.deepclone(this.podShowBK[ind]))
                break
              }
          }
          break
        }
      }
      this.loadPodMetrics()
    },
    deepclone(ob){
      let json_bk = JSON.stringify(ob)
      return JSON.parse(json_bk)
    },
    async loadPodMetrics(){
      for(let ind = 0, end = this.podShow.length; ind < end; ind++){
        await getPodCPU(this.namespace, this.podShow[ind].name).then(res => {
          let mlegth = res.data.data.metrics.length
          for(let _i = 0, _ed = mlegth > 20 ? 0 : 20 - mlegth; _i < _ed; _i++ )this.podShow[ind].cpu.push(0.0)
          for(let _i = mlegth > 20 ? mlegth - 20 : 0; _i < mlegth; _i ++)this.podShow[ind].cpu.push((res.data.data.metrics[_i].value / 1000).toFixed(2))
        })
        await getPodMemory(this.namespace, this.podShow[ind].name).then(res => {
          let mlegth = res.data.data.metrics.length
          for(let _i = 0, _ed = mlegth > 20 ? 0 : 20 - mlegth; _i < _ed; _i++ )this.podShow[ind].mem.push(0.0)
          for(let _i = mlegth > 20 ? mlegth - 20 : 0; _i < mlegth; _i ++)this.podShow[ind].mem.push( (res.data.data.metrics[_i].value / (1024 * 1024)).toFixed(2))
        })
        this.podShow[ind].cpu_json = JSON.stringify(this.podShow[ind].cpu)
        this.podShow[ind].mem_json = JSON.stringify(this.podShow[ind].mem)
        // console.log(this.podShow[ind].cpu_json, this.podShow[ind].mem_json)
      }
    }
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
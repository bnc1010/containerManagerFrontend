<template>

<page-layout :title="$route.params.id">
    <detail-list size="small" :col="2" slot="headerContent">
      <detail-list-item term="ID">{{ projectShow.Id }}</detail-list-item>
      <detail-list-item term="名称">{{ projectShow.Name }}</detail-list-item>
      <detail-list-item term="创建时间">{{ projectShow.CreateTime }}</detail-list-item>
      <detail-list-item term="备注">{{ projectShow.Describe }}</detail-list-item>
      <detail-list-item term="ForkFrom">{{ projectShow.ForkFrom }}</detail-list-item>
      <detail-list-item term="是否公开">{{ projectShow.IsPublic }}</detail-list-item>
      <detail-list-item term="拥有者">{{ projectShow.Owner }}</detail-list-item>
			<detail-list-item term="是否可用">{{ projectShow.Usable }}</detail-list-item>
			<a-divider />
      <a-card>
        <h3>镜像:</h3>
        <a-table style="font-size: 8px;" :columns="imageColumns" :data-source="imagesShow">
          <span slot="usable" slot-scope="record">
            <a-icon v-if="record.Usable" type="check-circle" theme="twoTone" two-tone-color="#52c41a"/>
            <a-icon v-else type="close-circle" theme="twoTone" two-tone-color="#eb2f96"/>
          </span>
          <span slot="gpu" slot-scope="record">
            <a-icon v-if="record.UseGPU" type="check-circle" theme="twoTone" two-tone-color="#52c41a"/>
            <a-icon v-else type="close-circle" theme="twoTone" two-tone-color="#eb2f96"/>
          </span>
          <span slot="ports" slot-scope="record">
            <p style="font-size:8px" :key="index" v-for="(item,index) in record.Ports">{{ item.protocol + item.port }}</p>
          </span>
        </a-table>
      </a-card>
      <a-card>
        <h3>文件:</h3>
        <a-table style="font-size: 8px;" :columns="fdColumns" :data-source="filesShow">
          <span slot="time" slot-scope="record">
            <p style="font-size: 8px;">created:<br/>{{ record.CreateTime }}</p>
            <p style="font-size: 8px;">updated:<br/>{{ record.UpdateTime }}</p>
          </span>
          <span slot="size" slot-scope="record">
            <p style="font-size:8px">{{ record.Size }}</p>
          </span>
        </a-table>
      </a-card>
      <a-card>
        <h3>数据集:</h3>
        <a-table style="font-size: 8px;" :columns="fdColumns" :data-source="datasetShow">
          <span slot="time" slot-scope="record">
            <p style="font-size: 8px;">created:<br/>{{ record.CreateTime }}</p>
            <p style="font-size: 8px;">updated:<br/>{{ record.UpdateTime }}</p>
          </span>
          <span slot="size" slot-scope="record">
            <p style="font-size:8px">{{ record.Size }}</p>
          </span>
        </a-table>
      </a-card>
      <a-card>
        <h3>资源限制:</h3>
        <pre style="overflow:scroll;max-height:500px;white-space: pre-wrap;word-wrap: break-word;" >
          {{ projectShow.Resources }}
        </pre>
      </a-card>
		</detail-list>
  </page-layout>
</template>

<script>
import {getProject, getImage, getFiles, getDataset} from '@/services/sql'
import PageLayout from '@/layouts/PageLayout'
import DetailList from '@/components/tool/DetailList'
import {UTCZ2UTC8} from '@/utils/time'
import {fileSize} from '@/utils/util'
const DetailListItem = DetailList.Item
const imageColumns = [
  { title: 'ID', dataIndex: 'Id', key: 'id', width: 100,},
  { title: '名称', dataIndex: 'Name', key: 'name', width: 100,},
  { title: 'pull', dataIndex: 'PullName', key: 'pullname', width: 110,},
  { title: '是否可用', scopedSlots: { customRender: 'usable' }, width: 45,},
  { title: 'GPU', scopedSlots: { customRender: 'gpu' }, width: 45,},
  { title: '端口', scopedSlots: { customRender: 'ports' }, width: 90,},
]

const fdColumns = [
  { title: 'ID', dataIndex: 'Id', key: 'id', width: 100,},
  { title: '名称', dataIndex: 'Name', key: 'name', width: 100,},
  { title: '挂载点', dataIndex: 'Mount', key: 'mount', width: 110,},
  { title: '目录位置', dataIndex: 'Path', key: 'path', width: 110,},
  { title: '时间', scopedSlots: { customRender: 'time' }, width: 130,},
  { title: '大小', scopedSlots: { customRender: 'size' }, width: 45,},
]

export default {
  name: "ProjectDetail",
  components: {DetailListItem, DetailList, PageLayout},
  data(){
    return {
      imageColumns,
      fdColumns,
      projectShow:{},
      imagesShow:[],
      filesShow:[],
      datasetShow:[]
    }
  },
  methods:{
    async firstLoad(){
      await this.loadProject()
      await this.loadImage()
      await this.loadFiles()
      await this.loadDataset()
    },
    async loadProject(){
      await getProject(this.$route.params.id).then(res => {
        this.projectShow = res.data.data
        this.projectShow.CreateTime = UTCZ2UTC8(this.projectShow.CreateTime)
      })
    },
    async loadImage(){
      this.imagesShow = []
      for(let ind = 0, end = this.projectShow.Images.length; ind < end; ind++){
        await getImage(this.projectShow.Images[ind]).then(res => {
          let _image = res.data.data
          this.imagesShow.push({
            key: ind,
            Id: _image.Id,
            Name: _image.Name,
            PullName: _image.PullName,
            Usable: _image.Usable,
            UseGPU: _image.UseGPU,
            Ports: _image.Ports
          })
        })
      }
    },
    async loadFiles(){
      this.filesShow = []
      for(let k in this.projectShow.Files){
        await getFiles(k).then(res => {
          let _files = res.data.data
          this.filesShow.push({
            key: k,
            Id: _files.Id,
            Name: _files.Name,
            Path: _files.Path,
            Mount: this.projectShow.Files[k],
            Size: fileSize(_files.Size),
            CreateTime: UTCZ2UTC8(_files.CreateTime),
            UpdateTime: UTCZ2UTC8(_files.UpdateTime)
          })
        })
      }    
    },
    async loadDataset(){
      this.datasetShow = []
      for(let k in this.projectShow.Datasets){
        await getDataset(k).then(res => {
          let _dataset = res.data.data
          this.datasetShow.push({
            key: k,
            Id: _dataset.Id,
            Name: _dataset.Name,
            Path: _dataset.Path,
            Mount: this.projectShow.Datasets[k],
            Size: fileSize(_dataset.Size),
            CreateTime: UTCZ2UTC8(_dataset.CreateTime),
            UpdateTime: UTCZ2UTC8(_dataset.UpdateTime)
          })
        })
      }
    },
  },
  mounted(){
    this.firstLoad()
  },
}
</script>
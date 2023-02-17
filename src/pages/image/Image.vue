<template>
  <a-card>
    <page-layout title='镜像'>
      <a-button type="primary" @click="showModal">创建</a-button>
      <a-table :columns="imageColumns" :data-source="imageShow">
        <span slot="time" slot-scope="record">
          <p style="font-size: 8px;">created:<br/>{{ record.CreateTime }}</p>
          <p style="font-size: 8px;">updated:<br/>{{ record.UpdateTime }}</p>
        </span>
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
        <span slot="action" slot-scope="record">
          <router-link :to="'#'" @click.native="showModal(record.key)">编辑</router-link>
          <a-divider type="vertical" />
          <a-popconfirm
            title="是否删除此镜像？"
            ok-text="确认"
            cancel-text="取消"
            @confirm="delSubmit(record.Id)"
          >
            <router-link :to="'#'">删除</router-link>
          </a-popconfirm>

          
        </span>
        
      </a-table>
    </page-layout>
    <a-modal
      :title="editBox.title"
      :visible="editBox.visible"
      :confirm-loading="editBox.confirmLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :width="700"
    >
    <a-form-model labelAlign="left" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="镜像名称">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="拉取路径">
        <a-input v-model="form.pullName" />
      </a-form-model-item>
      <a-form-model-item label="描述信息">
        <a-input v-model="form.describe" />
      </a-form-model-item>
      <a-form-model-item label="是否可用">
        <a-radio-group name="radioGroup" :default-value="form.usable" @change="usableChange">
          <a-radio :value="true">
            可用
          </a-radio>
          <a-radio :value="false">
            禁用
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="使用GPU">
        <a-radio-group name="radioGroup" :default-value="form.usegpu" @change="usegpuChange">
          <a-radio :value="true">
            是
          </a-radio>
          <a-radio :value="false">
            否
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="端口">
        <div :key="index" v-for="(port, index) in form.ports">
          <a-form-model layout="inline" >
            <a-form-model-item>
              <a-input v-model="port.port" placeholder="端口"></a-input>
            </a-form-model-item>
            <a-form-model-item>
              <a-input v-model="port.protocol" placeholder="协议"></a-input>
            </a-form-model-item>
          </a-form-model>
        </div>
        <a-button type="primary" shape="circle" icon="plus" @click="addPort" />
      </a-form-model-item>
    </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import {getImageList, addImage, delImage, editImage} from '@/services/sql'
import PageLayout from '@/layouts/PageLayout'
import {UTCZ2UTC8} from '@/utils/time'
import { isNumber } from 'lodash'
const imageColumns = [
  { title: 'ID', dataIndex: 'Id', key: 'id', width: 100,},
  { title: '名称', dataIndex: 'Name', key: 'name', width: 100,},
  { title: '备注', dataIndex: 'Describe', key: 'describe', width: 110,},
  { title: 'pull', dataIndex: 'PullName', key: 'pullname', width: 110,},
  { title: '创建者', dataIndex: 'Creator', key: 'creator', width: 80,},
  { title: '时间', scopedSlots: { customRender: 'time' }, width: 130,},
  { title: '是否可用', scopedSlots: { customRender: 'usable' }, width: 45,},
  { title: 'GPU', scopedSlots: { customRender: 'gpu' }, width: 45,},
  { title: '端口', scopedSlots: { customRender: 'ports' }, width: 90,},
  { title: '操作', scopedSlots: { customRender: 'action' },width: 80,},
]

export default {
  name:"Images",
  components:{PageLayout},
  data(){
    return {
      imageColumns,
      imageShow:[],
      labelCol: { span: 4 },
      wrapperCol: { span: 16, },
      isAdd: false,
      form: {
        id: '',
        name: '',
        describe: '',
        pullName:'',
        usable:true,
        usegpu:false,
        ports:[]
      },
      editBox:{
        title: 'Model',
        visible: false,
        confirmLoading: false,
      }
    }
  },
  methods:{
    loadImages(){
      getImageList().then(res => {
        this.imageShow = res.data.data
        for(let ind = 0, end = this.imageShow.length; ind < end; ind++){
          this.imageShow[ind].key = ind
          this.imageShow[ind].CreateTime = UTCZ2UTC8(this.imageShow[ind].CreateTime)
          this.imageShow[ind].UpdateTime = UTCZ2UTC8(this.imageShow[ind].UpdateTime)
        }
      })
    },
    onSubmit() {
      console.log('submit!', this.form);
    },
    showModal(e) {
      if (isNumber(e)){
        this.isAdd          = false
        let imageChose      = this.deepclone(this.imageShow[e])
        this.editBox.title  = imageChose.Id + '-' + this.imageShow[e].Name
        this.form.id        = imageChose.Id
        this.form.name      = imageChose.Name
        this.form.ports     = imageChose.Ports
        this.form.usable    = imageChose.Usable
        this.form.usegpu    = imageChose.UseGPU
        this.form.pullName  = imageChose.PullName
        this.form.describe  = imageChose.Describe
      }
      else{
        this.isAdd = true
        this.editBox.title  = '新增'
        this.form = {id:'',name:'',describe:'',pullName:'',usable:true,usegpu:false,ports:[]}
      }
      this.editBox.visible= true;
    },
    handleOk() {
      this.ModalText = 'The modal will be closed after two seconds';
      this.editBox.confirmLoading = true;
      setTimeout(() => {
        this.editBox.visible = false;
        this.editBox.confirmLoading = false;
      }, 2000);
    },
    handleCancel() {
      this.editBox.visible = false
      this.editBox.confirmLoading = false
      this.form = {id:'',name:'',describe:'',pullName:'',usable:true,usegpu:false,ports:[]}
    },
    usableChange(e){
      this.form.usable = e.target.value
    },
    usegpuChange(e){
      this.form.usegpu = e.target.value
    },
    addPort() {
      this.form.ports.push({port:'', protocol:''})
    },
    async editSubmit(){
      let sta = false
      await editImage(this.form).then(res => {
        console.log(res.data)
        sta = true
      })
      return sta
    },
    async addSubmit() {
      let sta = false
      await addImage(this.form).then(res => {
        console.log(res.data)
        sta = true
      })
      return sta
    },
    async handleSubmit(){
      this.editBox.confirmLoading = true
      let _prots = []
      for(let ind = 0, end = this.form.ports.length; ind < end; ind++){
        if(this.form.ports[ind].port != '' && this.form.ports[ind].protocol != '')
        _prots.push(this.form.ports[ind])
      }
      this.form.ports = _prots
      let submitSta = false
      if(this.isAdd){
        submitSta = await this.addSubmit()
      }
      else{
        submitSta = await this.editSubmit()
      }
      this.editBox.confirmLoading = false
      if(submitSta){
        this.openNotificationWithIcon('success', '操作成功', '')
      }
      else {
        this.openNotificationWithIcon('error', '操作失败', '')
      }
      this.loadImages()
    },
    openNotificationWithIcon(type, msg, description) {
      this.$notification[type]({message: msg,description:description});
    },
    async delSubmit(imageId){
      await delImage(imageId).then(() => {
        this.openNotificationWithIcon('success', '删除成功', '')
      }).catch(() =>{
        this.openNotificationWithIcon('error', '删除失败', '')
      })
      this.loadImages()
    },
    deepclone(ob){
      let json_bk = JSON.stringify(ob)
      return JSON.parse(json_bk)
    },
  },
  mounted(){
    this.loadImages()
  }
}

</script>
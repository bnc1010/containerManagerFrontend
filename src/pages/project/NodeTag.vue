<template>
  <a-card>
    <page-layout title='节点选择Tag'>
      <a-button type="primary" @click="showModal">创建</a-button>
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
          <router-link :to="'#'" @click.native="showModal(record.key)">编辑</router-link>
          <a-divider type="vertical" />
          <a-popconfirm
            title="是否删除此Tag？"
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
    <a-form-model labelAlign="left" :model="form" :label-col="editBox.labelCol" :wrapper-col="editBox.wrapperCol">
      <a-form-model-item label="键">
        <a-input v-model="form.key" />
      </a-form-model-item>
      <a-form-model-item label="值">
        <a-input v-model="form.value" />
      </a-form-model-item>
      <a-form-model-item label="是否公开">
        <a-radio-group name="radioGroup" :default-value="form.isPublic" @change="isPublicChange">
          <a-radio :value="true">
            是
          </a-radio>
          <a-radio :value="false">
            否
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import {getNodeTagList, addNodeTag, editNodeTag, delNodeTag} from '@/services/sql'
import PageLayout from '@/layouts/PageLayout'
import { isNumber } from 'lodash'
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
      editBox:{
        title: 'Model',
        visible: false,
        confirmLoading: false,
        labelCol: { span: 3 },
        wrapperCol: { span: 10, },
      },
      form:{
        id: '',
        key:'',
        value:'',
        isPublic:true
      },
      isAdd: false,
    }
  },
  methods:{
    async loadTags(){
      await getNodeTagList().then(res => {
        this.tagShow = res.data.data
        for(let ind = 0, end = this.tagShow.length; ind < end; ind++){
          this.tagShow[ind].key = ind
        }
      })
    },
    async addSubmit(){
      let sta = false
      await addNodeTag(this.form).then(() => {
        // console.log(res.data)
        sta = true
      })
      return sta 
    },
    async editSubmit(){
      let sta = false
      await editNodeTag(this.form).then(() => {
        // console.log(res.data)
        sta = true
      })
      return sta 
    },
    async handleSubmit(){
      this.editBox.confirmLoading = true
      let sta = false
      sta = this.isAdd ? await this.addSubmit() : await this.editSubmit()
      this.editBox.confirmLoading = false
      if(sta){
        this.openNotificationWithIcon('success', '操作成功', '')
        await this.loadTags()
      }
      else {
        this.openNotificationWithIcon('error', '操作失败', '')
      }
    },
    handleCancel(){
      this.form = {id:'', key:'',value:'',isPublic:true}
      this.editBox.visible = false
    },
    showModal(e) {
      console.log(e)
      if (isNumber(e)){
        this.isAdd          = false
        let tagChose        = this.deepclone(this.tagShow[e])
        this.editBox.title  = tagChose.Id
        this.form.id        = tagChose.Id
        this.form.key       = tagChose.Key
        this.form.value     = tagChose.Value
        this.form.isPublic  = tagChose.IsPublic
      }
      else{
        this.isAdd = true
        this.editBox.title  = '新增'
        this.form = {id:'', key:'',value:'',isPublic:true}
      }
      this.editBox.visible= true;
    },
    isPublicChange(e){
      this.form.isPublic = e.target.value
    },
    openNotificationWithIcon(type, msg, description) {
      this.$notification[type]({message: msg,description:description});
    },
    deepclone(ob){
      let json_bk = JSON.stringify(ob)
      return JSON.parse(json_bk)
    },
    async delSubmit(tagId){
      console.log(tagId)
      await delNodeTag(tagId).then(() => {
        this.openNotificationWithIcon('success', '删除成功', '')
      }).catch(() =>{
        this.openNotificationWithIcon('error', '删除失败', '')
      })
      this.loadTags()
    },
  },
  mounted(){
    this.loadTags()
  }
}

</script>
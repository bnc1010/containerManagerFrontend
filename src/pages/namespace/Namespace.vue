<template>
  <a-card>
    <a-button type="primary">创建</a-button>
    <a-button >刷新</a-button>
    <a-table :columns="columns" :data-source="namespaceShowList">
      <span slot="action" slot-scope="status">
        <a :id="status">Delete</a>
      </span>
    </a-table>
  </a-card>
</template>
<script>
import {getNamespaceList} from '@/services/k8s'
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'CreateTime',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
    },
  ];
  
  export default {
    data() {
      return {
        columns,
        namespaceShowList: []
      };
    },
    methods:{
        loadNamespceList(){
          getNamespaceList().then(res => {
            let namespaceList = res.data.data.items
            let end = namespaceList.length
            this.namespaceShowList = []
            for(let ind = 0; ind < end; ind++) {
              this.namespaceShowList.push({name:namespaceList[ind].metadata.name, createTime:namespaceList[ind].metadata.creationTimestamp,status:namespaceList[ind].status.phase})
            }
            console.log(this.namespaceShowList)
          })
        }
    },
    mounted(){
      this.loadNamespceList()
    }
  };
  </script>
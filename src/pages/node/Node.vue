<template>
  <a-card>
    <page-layout>
    <a-table :columns="columns" :data-source="nodeShowList">
      <span slot="action" slot-scope="record">
        <router-link :to="'/node/detail/' + record.name">detail</router-link>
      </span>
      <span slot="status" slot-scope="text,record" >
        <a-tooltip placement="right" overlayClassName="tooltip_200px">
          <template slot="title">
            <p style="font-size: 8px;">
            {{ record.status }}
            </p>
          </template>
          <div v-if="record.allStatusOk">
            <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a"/>
          </div>
          <div v-else>
            <a-icon type="close-circle" theme="twoTone" two-tone-color="#eb2f96" />
          </div>
        </a-tooltip>
      </span>
      <span slot="labels" slot-scope="text,record">
        <a-tooltip placement="left" overlayClassName="tooltip_500px">
          <template slot="title">
            <p style="font-size: 8px;">
            {{ record.labels }}
            </p>
          </template>
          <a-icon type="tags" />
        </a-tooltip>
      </span>
    </a-table>
  </page-layout>
  </a-card>
</template>
<script>
import {getNodeList} from '@/services/k8s'
import PageLayout from '@/layouts/PageLayout'
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: 'Ip',
      dataIndex: 'ip',
      key: 'ip',
      width: 220,
    },
    {
      title: 'CreateTime',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
    },
    {
      title: 'Status',
      scopedSlots: { customRender: 'status' },
      width: 80,
    },
    {
      title: 'Tags',
      scopedSlots: { customRender: 'labels' },
      width: 80,
    },
    {
      title: 'Action',
      scopedSlots: { customRender: 'action' },
    },
  ];
  
export default {
    name: 'Node',
    components: {PageLayout},
    data() {
        return {
            columns,
            nodeShowList: [],
            nodeSaveList: [],
        };
    },
    methods: {
        loadNodeList() {
            getNodeList().then(res => {
                // console.log(res.data);
                let nodeList = res.data.data.items;
                this.nodeSaveList = nodeList;
                let end = nodeList.length;
                this.nodeShowList = [];
                for (let ind = 0; ind < end; ind++) {
                    let ip = {
                        ExternalIP: "null",
                        InternalIP: "null",
                        Hostname: "null"
                    };
                    // console.log(nodeList[ind].status.addresses);
                    if (nodeList[ind].status.addresses[0])
                        ip[nodeList[ind].status.addresses[0].type] = nodeList[ind].status.addresses[0].address;
                    if (nodeList[ind].status.addresses[1])
                        ip[nodeList[ind].status.addresses[1].type] = nodeList[ind].status.addresses[1].address;
                    if (nodeList[ind].status.addresses[2])
                        ip[nodeList[ind].status.addresses[2].type] = nodeList[ind].status.addresses[2].address;
                    let showLabel = "";
                    for (let k in nodeList[ind].metadata.labels) {
                        showLabel += k + ":" + nodeList[ind].metadata.labels[k] + "\n";
                    }
                    let showCondition = "";
                    end = nodeList[ind].status.conditions.length;
                    let allOK = true;
                    for (let k = 0; k < end; k++) {
                        allOK &= (nodeList[ind].status.conditions[k].type == "Ready" ? "True" : "False") == nodeList[ind].status.conditions[k].status;
                        showCondition += nodeList[ind].status.conditions[k].type + ":" + nodeList[ind].status.conditions[k].status + "\n";
                    }
                    let node = {
                        key: ind,
                        name: nodeList[ind].metadata.name,
                        ip: ip["ExternalIP"] + "/" + ip["InternalIP"],
                        createTime: nodeList[ind].metadata.creationTimestamp,
                        status: showCondition,
                        allStatusOk: allOK,
                        labels: showLabel
                    };
                    this.nodeShowList.push(node);
                }
                console.log(this.nodeShowList);
            });
        }
    },
    mounted() {
        this.loadNodeList();
    }
};
</script>

<style lang="less">
.tooltip_500px{
  width: 500px;
  max-width: 500px !important;
}

.tooltip_200px{
  width: 200px;
  max-width: 200px !important;
}
</style>
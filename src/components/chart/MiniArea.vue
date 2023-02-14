<template>
  <div class="mini-chart" :style="'{max-width:' + width + 'px;width:' + width +'px}'">
    <div class="chart-content" :style="{height: 46}">
      <v-chart :force-fit="true" :height="height" :data="getData" :padding="[36, 5, 18, 5]">
        <v-tooltip :showTitle="false"/>
        <v-line position="time*value" :size="1" color="time" adjust="stack" />
        <v-area position="time*value" />
      </v-chart>
    </div>
  </div>
</template>

<script>

const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y
  })
]

const scale = [
  { dataKey: 'time', min: 0}, 
  { dataKey: 'value', title: '值', min: 0}
]

export default {
  props:{
    sdata:{
      type:String,
      default:"[]"
    },
    height:{
      default:100
    },
    width:{
      default:200
    }
  },
  name: 'MiniArea',
  data () {
    return {
      scale,
      tooltip,
      rData:[]
    }
  },
  computed:{
    getData(){
      let data = JSON.parse(this.sdata)
      let rData = []
      for(let ind = 0, end = data.length; ind < end; ind ++){
        rData.push({time:ind, value:data[ind]})
      }
      return rData
    }
  },
  // watch:{
  //   sdata:function(newVal,oldVal){
  //       // console.log("异步输出"+newVal, oldVal)
  //   }
  // }
}
</script>

<style scoped>
  .mini-chart {
    position: relative;
    width: 100%
  }
  .mini-chart .chart-content{
    position: absolute;
    bottom: -28px;
    width: 100%;
  }
</style>

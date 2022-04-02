<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    
    xAxisList: {
      type: Array,
      default: []
    },
    charList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch:{
    charList(newv,oldv){
       this.initChart()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['客户数', '拜访数', ],
          z:5,
          bottom:"10px"
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ["华东办","华北办","华南办","台湾办","跨境业务","烟台木村"],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '客户数',
          type: 'bar',
          // stack: 'vistors',
          barWidth: '40px',
          data: this.charList[0] ||[],
          animationDuration
        }, 
        // {
        //   name: 'pageB',
        //   type: 'bar',
        //   // stack: 'vistors',
        //   barWidth: '40px',
        //   data: [8, 52, 200, 334, 390, 330, 220],
        //   animationDuration
        // }, 
        {
          name: '拜访数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '40px',
          data: this.charList[1] ||[],
          animationDuration
        }
        ]
      })
    }
  },
  
 
}
</script>

<template>
  <div class="dashboard-editor-container">
    <div class="title">欢迎使用引鹿</div>
    <div class="home-logo">
      <p class="sub-title">引领纺织服装产业数字化及智能化升级，实现产供销高效协同</p>
      <img src="http://luyou-platform.oss-cn-qingdao.aliyuncs.com/images/home.png" />
    </div>
    <p class="site-info">Copyright @ 2019-2022 TextilesFuture. All Rights Reserved</p>
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
  },
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  position: relative;
  margin: 24px;
  padding: 21px 16px;
  background-color: #fff;
  position: relative;
  // height: 98%;
  border-radius: 8px;
  .title {
    font-size: 16px;
    color: #242424;
    font-weight: bold;
  }
  .home-logo {
    text-align: center;
    padding-bottom: 80px;
    .sub-title {
      font-size: 24px;
      color: #5e5e5e;
      margin: 80px 0 46px 0;
    }
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  .site-info {
    position: fixed;
    left: 50%;
    bottom: 5px;
    width: 320px;
    text-align: center;
    margin-left: -60px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

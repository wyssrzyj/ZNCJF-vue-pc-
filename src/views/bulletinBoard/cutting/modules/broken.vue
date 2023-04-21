<!--
 * @Author: lyj
 * @Date: 2022-08-31 13:11:11
 * @LastEditTime: 2023-04-21 09:36:52
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="broken-eChart">
    <div v-if="state.type" class="gannt-img">
      <img :src="zw" alt="" />
    </div>
    <div :id="eChart" :class="!state.type ? 'chart' : 'chart-no'" class="eChart"></div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, reactive } from 'vue'
  import * as echarts from 'echarts'

  import { echartsOpt } from './broken'
  import zw from './img/zw.png'
  import { isEmpty } from 'lodash'

  const eChart: any = ref('eChartBroken' + Date.now() + Math.random()) //生成id 防止切换路由不渲染
  const state: any = reactive({
    type: false,
    data: {
      name: ['06:00', '10:00', '14:00', '18:00', '22::00', '02:00', '06:00'],
      data: [40, 80, 60, 70, 100, 60, 20]
    } //今日达成率
  })

  // 甘特图
  const ganttGet = () => {
    let myChart = echarts.init(document.getElementById(eChart.value))
    myChart.clear()
    myChart.setOption(echartsOpt)
  }

  const init = (e: any) => {
    if (!isEmpty(e.data)) {
      state.type = false
    } else {
      state.type = true
    }

    let _ref = document.getElementById(eChart.value)
    let myChart = _ref ? echarts.getInstanceByDom(_ref) : undefined
    if (myChart !== undefined) {
      echartsOpt.xAxis.data = e.name
      echartsOpt.series[0].data = e.data
      //只有获取到dom后才执行
      myChart.clear() //清空数据重新赋值
      myChart.setOption(echartsOpt)
    }
  }

  onMounted(() => {
    ganttGet()
    init(state.data)
  })
</script>
<style lang="less" scoped>
  .eChart {
    transform: translate(-3.5vw, 0);
    width: 58vw;
    height: 35vh;
  }
  .broken-eChart {
    width: 50vw;
    height: 35vh;
    position: relative;
  }

  .home-title {
    transform: translate(38px, 20px);
  }
  .home-title-left {
    width: 4px;
    height: 20px;
    background: #039af9;
    float: left;
    margin-left: 5px;
    margin-right: 5px;
  }
  .gannt-img {
    position: absolute;
    left: 10vw;
    top: 40px;
    img {
      width: 20vw;
      height: 170px;
    }
  }
  .chart {
    opacity: 1;
  }
  .chart-no {
    opacity: 0;
  }
</style>

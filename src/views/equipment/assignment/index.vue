<script lang="ts" setup>
  import { isEmpty } from 'lodash'
  import * as echarts from 'echarts'
  import './index.less'
  import { echartsOpt } from './config.js'
  import { onMounted, reactive, getCurrentInstance, ref } from 'vue'
  const { proxy }: any = getCurrentInstance()

  const page = ref(1)
  const limit = ref(10)
  const eChart: any = ref('eChart' + Date.now() + Math.random()) //生成id 防止切换路由不渲染

  const state: any = reactive({
    total: 0,
    type: 1,
    equipmentPlanningTaskParam: {
      time: proxy.$dayjs(new Date()).format('YYYY-MM-DD'),
      deviceName: '',
      startTime: proxy.$dayjs(`${proxy.$dayjs(new Date()).format('YYYY-MM-DD')} 06:00`).valueOf(),
      endTime: proxy.$dayjs(`${proxy.$dayjs(new Date()).format('YYYY-MM-DD')} 22:00`).valueOf()
    },
    taskProgressParam: {
      styleCode: '',
      produceOrderCode: ''
    },
    taskStep: {
      title: '',
      type: 0,
      overviewVOList: [],
      finishList: []
    },
    taskStepName: ['铺布任务', '贴标任务', '裁剪任务'],
    tableData: []
  })

  // 甘特图
  const ganttGet = () => {
    proxy.$baseService.get('/jack-ics-api/index/deviceTask', { ...state.equipmentPlanningTaskParam }).then((res: any) => {
      if (res.code === 0) {
        let myChart = echarts.init(document.getElementById(eChart.value))
        myChart.clear() //清空数据缓存 重新加载
        let colorsIndex = 0
        let echartsServerData: any = []
        let colors = ['#CCEED0', '#C6E8EF', '#B9D7FF', '#ABC8E6', '#EDE0F7']
        let device = res.data.map((item: any) => item.resourceName)
        let title: any = [] //左侧标题
        // let data: any = [] //右侧数据

        device.forEach((item: any) => {
          title.unshift(item)
        })
        if (!isEmpty(res.data)) {
          res.data.map((item: any, i: any) => {
            // console.log(i);   
            colorsIndex === 5 ? (colorsIndex = 0) : colorsIndex++
              if(i<5){
                 if (!isEmpty(item.taskList)) {
              return item.taskList.forEach((itemClid: any, k: any) => {
                echartsServerData.push({
                  itemStyle: { normal: { color: colors[colorsIndex] } }, //条形颜色
                  name: item.deviceName,
                  value: [i, proxy.$dayjs(itemClid.planStartTime).format('YYYY-MM-DD HH:mm'), proxy.$dayjs(itemClid.planEndTime).format('YYYY-MM-DD HH:mm')],
                  time: `${proxy.$dayjs(itemClid.planStartTime).format('HH:mm')}~${proxy.$dayjs(itemClid.planEndTime).format('HH:mm')}`,
                  produceOrderCode: itemClid.produceOrderCode,
                  styleCode: itemClid.styleCode,
                  styleName: itemClid.styleName
                })
                
                 
                 
              })
            }

              }
           
          })
        }
        //数据顺序反转
        let lengths = echartsServerData[echartsServerData.length - 1].value[0] //最后一位数的value值
        echartsServerData.map((item: any, index: any) => {
          item.value[0] = lengths - item.value[0]
        })

      
        echartsOpt.gantt.xAxis.min = state.equipmentPlanningTaskParam.startTime
        echartsOpt.gantt.xAxis.max = state.equipmentPlanningTaskParam.endTime
        echartsOpt.gantt.yAxis.data = title

        myChart.setOption(echartsOpt.gantt)
        window.onresize = () => {
          myChart.resize()
        }
      }
    })
  }

  // 生产任务订单查询
  const getPageList = () => {
    proxy.$baseService.get('/jack-ics-api/index/bedTask', { ...state.taskProgressParam }).then((res: any) => {
      if (!isEmpty(res.data)) {
        state.total = res.data.total
        //添加任务状态
        let list = res.data.list
        if (!isEmpty(list)) {
          list.map((item: any) => {
            if (item.finishList) {
              item.finishList = item.finishList.split(',')

              if (item.finishList.includes('1')) {
                item.cloth = true
              }
              if (item.finishList.includes('2')) {
                item.labeling = true
              }
              if (item.finishList.includes('3')) {
                item.cropping = true
              }
            }
          })
        }
        state.tableData = list
      }
    })
  }
  // 根据时间查询甘特图数据
  const handleTime = () => {
    state.equipmentPlanningTaskParam.startTime = proxy.$dayjs(`${state.equipmentPlanningTaskParam.time} 00:00`).valueOf() || ''
    state.equipmentPlanningTaskParam.endTime = proxy.$dayjs(`${state.equipmentPlanningTaskParam.time} 23:59`).valueOf() || ''
    ganttGet()
  }

  onMounted(() => {
    ganttGet()
    getPageList()
  })

  const setType = (e: any) => {
    state.type = e
  }
</script>

<template>
  <div class="home">
    <div class="homeContainer">
      <div v-show="state.type === 1" class="homeTops">
        <div class="title">
          <div class="txt">设备计划任务</div>
        </div>

        <div class="form">
          <el-form ref="rightFormRef" :model="state.equipmentPlanningTaskParam" :inline="true" label-width="auto">
            <el-form-item label="时间范围:" prop="sn">
              <el-date-picker v-model="state.equipmentPlanningTaskParam.time" :clearable="false" value-format="YYYY-MM-DD" type="date" @change="handleTime" />
            </el-form-item>
            <el-form-item label="设备名称:" prop="name">
              <el-input v-model="state.equipmentPlanningTaskParam.deviceName" placeholder="请输入" clearable @change="ganttGet" />
            </el-form-item>
          </el-form>
        </div>
        <div :id="eChart" class="home-eChart" style="width: 90%; height: 90%"></div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .cell {
    padding: 0 !important;
  }
</style>

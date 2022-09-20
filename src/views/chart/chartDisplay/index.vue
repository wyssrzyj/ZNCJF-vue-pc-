<script lang="ts" setup>
  import ImgModular from '@/components/imgModular/index.vue'

  import './index.less'
  import * as echarts from 'echarts'
  import { echartsOpt } from './config.js'
  import { onMounted, reactive, getCurrentInstance } from 'vue'
  const { proxy }: any = getCurrentInstance()

  import { isEmpty } from 'lodash'

  const state: any = reactive({
    equipmentPlanningTaskParam: {
      time: '',
      deviceName: '',
      startTime: '1662000928000',
      endTime: '1663210528000'
    },
    taskProgressParam: {
      styleCode: '',
      produceOrderCode: ''
    },
    taskStep: {
      title: '',
      overviewVOList: [],
      finishList: []
    },
    taskStepName: ['铺布任务', '贴标任务', '裁剪任务'],
    tableData: []
  })

  // 甘特图
  const ganttGet = () => {
    proxy.$baseService.get('/jack-ics-api/index/deviceTask', { ...state.equipmentPlanningTaskParam }).then((res: any) => {
      if (!isEmpty(res.data)) {
        let colorsIndex = 0
        let echartsServerData = []
        let colors = ['#CCEED0', '#C6E8EF', '#B9D7FF', '#ABC8E6', '#EDE0F7']
        let device = res.data.map((item: any) => item.deviceName)
        res.data.map((item: any, i: any) => {
          colorsIndex === 5 ? (colorsIndex = 0) : colorsIndex++
          return item.taskList.forEach((itemClid: any, k: any) => {
            echartsServerData.push({
              itemStyle: { normal: { color: colors[colorsIndex] } }, //条形颜色
              name: item.deviceName,
              value: [i, proxy.$dayjs(itemClid.planStartTime).format('YYYY-MM-DD HH:mm'), proxy.$dayjs(itemClid.planEndTime).format('YYYY-MM-DD HH:mm'), itemClid.taskCode]
              // taskCode: itemClid.taskCode
            })
          })
        })
        let myChart = echarts.init(document.querySelector('#chart') as HTMLElement)
        echartsOpt.gantt.yAxis.data = device
        echartsOpt.gantt.series[0].data = echartsServerData
        myChart.setOption(echartsOpt.gantt)
        window.onresize = () => {
          myChart.resize()
        }
      }
    })
  }

  // 生产任务订单查询
  const getPageList = () => {
    proxy.$baseService.get('/jack-ics-api/bedPlan/pageList', { ...state.taskProgressParam }).then((res: any) => {
      if (!isEmpty(res.data)) {
        state.tableData = res.data.list
      }
    })
  }

  // 获取表格点击的是哪一行
  const handleCurrentChange = (val: any) => {
    state.taskStep.title = val.produceOrderCode
    bedTask(val.id)
  }

  // 床次计划的任务进度
  const bedTask = (bedPlanId: string | number) => {
    proxy.$baseService.get('/jack-ics-api/index/bedTask', { bedPlanId: bedPlanId }).then((res: any) => {
      if (!isEmpty(res.data)) {
        state.taskStep.overviewVOList = res.data.overviewVOList
        state.taskStep.finishList = res.data.finishList
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
</script>

<template>
  <div class="chartContainer">
    <div class="tops">
      <div class="title">
        <div class="txt">设备计划任务</div>
        <div class="form">
          <el-form ref="rightFormRef" :model="state.equipmentPlanningTaskParam" :inline="true" label-width="auto">
            <el-form-item label="时间范围:" prop="sn">
              <!--              <el-input v-model="state.equipmentPlanningTaskParam.time" placeholder="请输入" clearable />-->
              <el-date-picker v-model="state.equipmentPlanningTaskParam.time" value-format="YYYY-MM-DD" type="date" clearable @change="handleTime" />
            </el-form-item>
            <el-form-item label="设备名称:" prop="name">
              <el-input v-model="state.equipmentPlanningTaskParam.deviceName" placeholder="请输入" clearable @change="ganttGet" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div id="chart" style="width: 100%; height: 320px"></div>
    </div>
    <div class="chartBottom">
      <div class="chartLeft">
        <div class="title">
          <div class="txt">任务进度查询</div>
          <div class="form">
            <el-form ref="rightFormRef" :model="state.taskProgressParam" :inline="true" label-width="auto">
              <el-form-item label="生产订单:" prop="sn">
                <el-input v-model="state.taskProgressParam.produceOrderCode" placeholder="请输入" clearable @change="getPageList" />
              </el-form-item>
              <el-form-item label="款式编号:" prop="name">
                <el-input v-model="state.taskProgressParam.styleCode" placeholder="请输入" clearable @change="getPageList" />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="table">
          <el-table ref="singleTableRef" height="300" :data="state.tableData" highlight-current-row style="width: 100%" @current-change="handleCurrentChange">
            <el-table-column property="produceOrderCode" label="生产订单" />
            <el-table-column property="bedPlanNo" label="床次计划号" />
            <el-table-column label="款式照片">
              <template #default="scope">
                <ImgModular :img="scope.row.styleImage" />
              </template>
            </el-table-column>
            <el-table-column property="styleName" label="款式名称" />
            <el-table-column property="styleCode" label="款式编号" />
            <el-table-column property="styleBedNo" label="款式床次号" />
            <el-table-column property="customName" label="客户名称" />
          </el-table>
        </div>
      </div>
      <div class="chartRight">
        <img v-if="state.taskStep.overviewVOList.length === 0" src="@/assets/images/layCloth/isNull.png" alt="" />
        <div v-if="state.taskStep.overviewVOList.length !== 0" class="order-title">生产订单号：{{ state.taskStep.title }}</div>
        <div v-if="state.taskStep.overviewVOList.length !== 0" class="order-list">
          <div class="box">
            <div class="setup">
              <p>1</p>
            </div>
            <div class="content">床次计划</div>
          </div>
          <div v-for="(item, i) in state.taskStep.overviewVOList" :key="i" :class="['box', state.taskStep.overviewVOList[i] !== state.taskStep.finishList[i] ? 'active' : '']">
            <div class="setup">
              <p>{{ i + 2 }}</p>
            </div>
            <div class="content">{{ state.taskStepName[item - 1] }}</div>
          </div>
          <div :class="['box', state.taskStep.overviewVOList.length !== state.taskStep.finishList.length ? 'active' : '']">
            <div class="setup">
              <p>5</p>
            </div>
            <div class="content">完成</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

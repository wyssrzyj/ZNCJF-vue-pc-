<script lang="ts" setup>
  import { isEmpty } from 'lodash'
  import * as echarts from 'echarts'
  import ImgModular from './imgModular.vue'
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
        // var  myChart=document.getElementById(`#${main}`)
        // myChart.dispose();
        // myChart.setOption({}, true)//清空数据缓存 重新加载
        myChart.clear() //清空数据缓存 重新加载
        // eChart.setOption(echartsOpt, true)
        // if (!isEmpty(res.data)) {
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

  // 床次计划的任务进度
  // const bedTask = (v: any) => {
  //   let bedPlanId = v.id

  //   proxy.$baseService.get('/jack-ics-api/index/bedTask', { bedPlanId: bedPlanId }).then((res: any) => {
  //     if (!isEmpty(res.data)) {
  //       state.taskStep.overviewVOList = res.data.overviewVOList
  //       state.taskStep.finishList = res.data.finishList
  //     }
  //   })
  // }

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

  const handleSizeChange = (val: number) => {
    let data = { ...state.taskProgressParam, page: page.value, limit: limit.value }
    state.taskProgressParam = data
    getPageList()
  }
  const handleCurrent = (val: number) => {
    let data = { ...state.taskProgressParam, page: page.value, limit: limit.value }
    state.taskProgressParam = data
    getPageList()
  }
</script>

<template>
  <div class="home">
    <div class="homeBtn">
      <el-button :type="state.type === 1 ? 'primary' : null" @click="setType(1)">任务进度</el-button>
      <el-button class="tasks" :type="state.type === 2 ? 'primary' : null" @click="setType(2)">床次进度</el-button>
    </div>
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
      <div v-show="state.type === 2" class="chartBottom">
        <div class="chartLeft">
          <div class="title">
            <div class="txt">任务进度查询</div>
          </div>
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
          <div class="table">
            <el-table
              ref="singleTableRef"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              :data="state.tableData"
              :height="550"
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column property="produceOrderCode" label="生产订单" />
              <el-table-column property="bedPlanNo" label="床次" />
              <el-table-column label="款式照片">
                <template #default="scope">
                  <ImgModular :img="scope.row.styleImage" />
                </template>
              </el-table-column>
              <el-table-column property="styleName" label="款式名称" />
              <el-table-column property="styleCode" label="款式编号" />
              <el-table-column property="styleBedNo" label="床次" />
              <el-table-column property="customName" label="客户名称" />

              <el-table-column property="customName" label="床次计划">
                <template #default="scope">
                  <div class="tableContainer">
                    <div class="check-customName">
                      <div class="innerCircle"></div>
                    </div>
                    <div :class="scope.row.cloth === true ? 'progress-customName' : 'progress-customName-no'"></div>
                  </div>
                  <!-- <div v-if="scope.row" class="homeTable-correct">
                    <el-icon><Select /></el-icon>
                  </div> -->
                </template>
              </el-table-column>
              <el-table-column property="cloth" label="铺布任务">
                <template #default="scope">
                  <div class="tableContainer">
                    <div :class="scope.row.cloth === true ? 'progress' : 'progress-no'"></div>
                    <div :class="scope.row.cloth === true ? 'check' : 'unchecked'">
                      <div v-if="scope.row.cloth === true" class="innerCircle"></div>
                    </div>
                    <div :class="scope.row.labeling === true || scope.row.cropping === true ? 'progress' : 'progress-no'"></div>
                  </div>
                  <!-- <div v-if="scope.row.cloth === true" class="homeTable-correct">
                    <el-icon><Select /></el-icon>
                  </div> -->
                </template>
              </el-table-column>
              <el-table-column property="labeling" label="贴标任务">
                <template #default="scope">
                  <div class="tableContainer">
                    <div :class="scope.row.labeling === true || scope.row.cropping === true ? 'progress' : 'progress-no'"></div>
                    <div :class="scope.row.labeling === true ? 'check' : 'unchecked'">
                      <div v-if="scope.row.labeling === true" class="innerCircle"></div>
                    </div>
                    <div :class="scope.row.cropping === true || scope.row.cropping === true ? 'progress' : 'progress-no'"></div>
                  </div>
                  <!-- <div v-if="scope.row.labeling === true" class="homeTable-correct">
                    <el-icon><Select /></el-icon>
                  </div> -->
                </template>
              </el-table-column>
              <el-table-column property="cropping" label="裁剪任务">
                <template #default="scope">
                  <div class="tableContainer">
                    <div :class="scope.row.cropping === true ? 'progress-cropping' : 'progress-cropping-no'"></div>
                    <div :class="scope.row.cropping === true ? 'check-cropping' : 'check-cropping-no'">
                      <div v-if="scope.row.cropping === true" class="innerCircle"></div>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <div class="homePagination">
              <el-pagination
                v-model:currentPage="page"
                v-model:page-size="limit"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="state.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrent"
              />
            </div>
          </div>
        </div>
        <!-- 暂时隐藏 2022-10-18 -->
        <!-- <div class="chartRight">
          <img v-if="state.taskStep.overviewVOList.length === 0" src="@/assets/images/isNull.png" alt="" />
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
            <div :class="['box', state.taskStep.type !== 4 ? 'active' : '']">
              <div class="setup">
                <p>5</p>
              </div>
              <div class="content">完成</div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .cell {
    padding: 0 !important;
  }
</style>

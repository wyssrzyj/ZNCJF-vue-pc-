<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-03-15 08:39:51
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="rightTable">
    <div v-if="props.title !== '全部'" class="rightTable-top">
      请选择工艺：
      <el-select v-model="state.technology.value" placeholder="请选择" filterable :disabled="state.technology.type" @change="setTechnologyValue">
        <el-option v-for="item in state.technology.data" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <div class="cutApart"></div>
    </div>

    <el-table :data="state.tableData" border style="width: 100%" height="245">
      <el-table-column prop="color" label="工序" align="center">
        <template #default="{ row }">
          <div :class="row.style"></div>
          <div class="table-txt">{{ row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="layers" align="center">
        <template #header>
          <span> <span class="required">*</span>设备</span>
        </template>
        <template #default="{ row }">
          <el-select v-model="row.cropping" placeholder="请选择" filterable :disabled="setDisabled(row)" @change="setSelect(row)">
            <el-option v-for="item in row.croppingData" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="setTime" align="center" width="400px">
        <template #header>
          <span> <span class="required">*</span>计划时间</span>
        </template>
        <template #default="{ row }">
          <el-date-picker
            v-model="row.time"
            :disabled="setDisabled(row)"
            format="MM-DD HH:mm"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="(e:any)=>setTime(e,row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-button v-if="props.title === '已分派'" :disabled="state.buttonType" class="schedulingSettings-btn" type="primary" @click="btn">确定修改</el-button>

    <div v-if="props.title === '已分派'">
      <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" title="是否取消分派?" @confirm="cancel">
        <template #reference>
          <el-button :disabled="state.buttonType" class="schedulingSettings-btn" type="warning">取消分派</el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, onMounted, getCurrentInstance, watch } from 'vue'
  import moment from 'moment'
  import { ElMessage } from 'element-plus'
  import { isEmpty, cloneDeep } from 'lodash'

  import { rightTable } from './conifgs'
  const { proxy } = getCurrentInstance() as any
  const props = defineProps<{
    title: any
    data: any
    operation: any
  }>()

  const state: any = reactive({
    type: 1,
    tableData: rightTable.tableData,
    //公式
    technology: {
      type: true,
      value: '',
      data: []
    },
    cropping: [],
    buttonType: true,
    demoType: false
  })

  //获取设备下拉数据
  const getResource = (type: any, id?: any) => {
    let data: any = {}

    if (type === 1) {
      data.type = 1
      data.technologyId = state.technology.value
    } else {
      data.type = type
      data.spreadDeviceId = id
      data.technologyId = state.technology.value
    }
    proxy.$baseService.get('/jack-ics-api/formulaContainer/getSchedulingResource', { ...data }).then((res: any) => {
      if (!isEmpty(res.data)) {
        let list: any = []
        res.data.forEach((item: any) => {
          list.push({
            label: item.name,
            value: item.id
          })
        })
        if (type === 1) {
          state.tableData[0].croppingData = list
        }
        if (type === 2) {
          state.tableData[1].croppingData = list
        }
        if (type === 3) {
          state.tableData[2].croppingData = list
        }
      }
    })
  }

  //获取公艺
  const getTechnology = (id: any) => {
    proxy.$baseService.get('/jack-ics-api/technology/listTechnologyAndProcess', { bedPlanId: id }).then((res: any) => {
      if (!isEmpty(res.data)) {
        res.data.map((item: any) => {
          item.label = item.name
          item.value = item.id
        })
        state.technology.data = res.data
      }
    })
  }
  //数据清空
  const emptyData = () => {
    state.technology.value = ''
    let data = cloneDeep(state.tableData)
    data.map((item: any) => {
      item.cropping = ''
      item.time = ''
      item.initType = true
      item.type = true
    })
    state.tableData = data

    state.technology.type = true
  }

  // 【切换数据重置】
  watch(
    () => props.title,
    item => {
      if (item === '已分派') {
        emptyData()
      }
    },
    { deep: true }
  )


  //按钮、工艺是否可用
  const setButtonType = (item: any) => {
    //只有已审核可用
    if (item.gannt) {
      let type = item.gannt.statu
      const  data  =cloneDeep(state.tableData) 
      if (type === 2) {
        state.buttonType = false
        state.technology.type=false
        //设备 时间状态 是否可用
        data.map((v: any) => {
          if (v.initType !== true) {
            v.type = false
          }
        })
      } else {
        state.buttonType = true
        state.technology.type=true
        data.map((v: any) => {
          v.type = true
        })

      }
      state.tableData=data
    }
  }
    //表格回显
  const init = (e: any) => {
    let id = e.bedPlanId
    proxy.$baseService.get('/jack-ics-api/spreadTask/getTime', { bedPlanId: id }).then((res: any) => {
      if (res.code === 0) {
     
        let data = res.data
        state.technology.value = data.technologyId //工艺回显

        // spreadTaskTime 铺布，pasteTaskTime 贴标，cutTaskTime 裁剪
        let arr = [{ name: 'spreadTaskTime' }, { name: 'pasteTaskTime' }, { name: 'cutTaskTime' }]
        arr.forEach((item, index) => {
          if (!isEmpty(data[item.name])) {
            //下拉回显
            if (item.name === 'spreadTaskTime') {
              let id = data.spreadTaskTime.resourceId //设备id
              getResource(1)
              getResource(2, id)
              getResource(3, id)
            }
            //回显
            let time = [moment(data[item.name].planStartTime), moment(data[item.name].planEndTime)]
            let resourceId = data[item.name].resourceId
            state.tableData[index].time = time
            state.tableData[index].cropping = resourceId
            state.tableData[index].initType = false //接口是否允许使用
          }
        })
        
        //是否可用
        setButtonType(e)

        if (e.type === false) {
          state.tableData.map((item: any) => {
            if (!item.initType) {
              item.clothType = false
            }
          })
        }
      }
    })
  }
  // 【是否选中】
  watch(
    () => props.data,
    item => {
      //获取公艺
      if (item.id) {
        getTechnology(item.id)
      }
      //清空数据
      if (item.init === 'init') {
        let data = cloneDeep(state.tableData)
        data.map((item: any) => {
          item.cropping = ''
          item.time = ''
          item.clothType = true
        })
        state.technology.value = ''
        state.tableData = data
      }

      //工艺状态【床次多选后右表格不可操作】
      state.technology.type = item.type


      //设备 时间状态 是否可用
      state.tableData.map((v: any) => {
        v.type = item.type
      })

      //回显数据
      if (item.bedPlanId) {
        init(item)
      }
    },
    { deep: true, immediate: true }
  )

  //选择公式【1】
  const setTechnologyValue = (e: any) => {
    //铺布设置可用
    if (e) {
      state.tableData[0].type = false
      state.tableData[0].clothType = false
    }
    //initType都设置可用
    state.tableData.map((item: any) => {
      item.initType = false
    })

    // type=2 贴标是动态的
    let data = state.technology.data.filter((item: any) => item.id === e)
    //根据接口判断设置不可用
    if (data[0].enableFlag === 0) {
      state.tableData[1].initType = true
    }
    getResource(1)
    //保存工艺id
    state.tableData[0].technologyId=e
    //传递
     props.operation('assignment', state.tableData)
  }

  //选择设备【2】
  const setSelect = (row: any) => {
    if (row.title === '铺布') {
      getResource(2, row.cropping)
      getResource(3, row.cropping)
      // 铺布操作后都可用
      state.tableData.map((item: any) => {
        item.clothType = false
      })
    }

    // 选中的哪一项【用于和甘特图显示例子】
    state.tableData.map((item: any) => {
      item.clickType = row.title
    })

    props.operation('assignment', state.tableData)
  }
  //是否禁用
  const setDisabled = (row: any) => {
    if (row.type === true || row.initType === true || row.clothType === true) {
      return true
    } else {
      return false
    }
  }

  // 生产任务订单查询
  const getPageList = () => {}
  onMounted(() => {
    getPageList()
  })
  const setTime = (time: any, row: any) => {
    // 选中的哪一项【用于和甘特图显示例子】
    state.tableData.map((item: any) => {
      item.clickType = row.title
    })

    props.operation('assignment', state.tableData)
  }

  const btn = () => {
    // revise
    let data = cloneDeep(state.tableData)
    //铺布
    let spreadTaskSta = moment(data[0].time[0]).valueOf()
    let spreadTaskEnd = moment(data[0].time[1]).valueOf()
    let spreadTaskId = data[0].cropping
    //贴标
    let pasteTaskId = data[1].cropping
    let pasteTaskSta: any = ''
    let pasteTaskEnd: any = ''
    if (pasteTaskId !== '') {
      pasteTaskSta = moment(data[1].time[0]).valueOf()
      pasteTaskEnd = moment(data[1].time[1]).valueOf()
    }
    //裁剪
    let cutTaskStar = moment(data[2].time[0]).valueOf()
    let cutTaskEnd = moment(data[2].time[1]).valueOf()
    let cutTaskId = data[2].cropping

    let arr: any = {
      bedPalnTaskTimeDTO: {
        //铺布
        spreadTaskTime: {
          planEndTime: spreadTaskEnd,
          planStartTime: spreadTaskSta,
          resourceId: spreadTaskId
        },
        //贴标
        pasteTaskTime: {
          planEndTime: pasteTaskEnd,
          planStartTime: pasteTaskSta,
          resourceId: pasteTaskId
        },
        //裁剪
        cutTaskTime: {
          planEndTime: cutTaskEnd,
          planStartTime: cutTaskStar,
          resourceId: cutTaskId
        }
      },
      bedPlanId: props.data.bedPlanId //测试id
    }

    proxy.$baseService.post('/jack-ics-api/productionScheduling/update', { ...arr }).then((res: any) => {
      if (res.code === 0) {
        ElMessage({
          message: '操作成功',
          type: 'success'
        })
        props.operation('revise')
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  const cancel = () => {
    proxy.$baseService.post('/jack-ics-api/productionScheduling/cancel', { id: props.data.gannt.id }).then((res: any) => {
      if (res.code === 0) {
        ElMessage({
          message: '操作成功',
          type: 'success'
        })
        props.operation('cancel')
      }
    })
  }
</script>
<style lang="less" scoped>
  .rightTable {
    width: 33vw;
    float: right;
  }
  .cloth {
    width: 16px;
    height: 28px;
    background: #566ed6;
    transform: translate(25px, 10px);
  }

  .labelling {
    width: 16px;
    height: 28px;
    background: #56aed6;
    transform: translate(25px, 10px);
  }
  .cropping {
    width: 16px;
    height: 28px;
    background: #56d6be;
    transform: translate(25px, 10px);
  }

  .table-txt {
    transform: translate(5px, -16px);
  }
  .schedulingSettings-btn {
    float: right;
    margin-top: 10px;
    margin-right: 10px;
  }
  .rightTable-top {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .cutApart {
    width: 100%;
    height: 2px;
    background: #eee;
    margin-top: 10px;
  }
  .required {
    color: red;
    font-size: 15px;
    margin-right: 10px;
  }
</style>

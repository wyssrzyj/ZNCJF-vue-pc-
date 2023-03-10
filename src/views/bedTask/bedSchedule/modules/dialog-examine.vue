<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-03-01 17:07:51
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>
    <el-table :data="state.tableData" border style="width: 100%">
      <el-table-column prop="color" label="工序" align="center">
        <template #default="{ row }">
          <div :class="row.style"></div>
          <div class="table-txt">{{ row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="layers" label="设备" align="center">
        <template #default="{ row }">
          <el-select v-model="row.cropping" placeholder="请选择" filterable>
            <el-option v-for="item in state.cropping" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="setTime" label="计划开始时间" align="center" width="400px">
        <template #default="{ row }">
          <el-date-picker v-model="row.time" :change="setTime" format="MM-DD HH:mm" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" />
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="equipmentBottom"></div>
  <div class="equipmentFoot">
    <el-button @click="resetForm(ruleFormRef)"> {{ state.type === false ? '取消' : '关闭' }}</el-button>
    <el-button type="primary" class="preservation" @click="btn">确认</el-button>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
  import moment from 'moment'

  import './index.less'
  import { isEmpty } from 'lodash'

  const ruleFormRef = ref<any>()
  const { proxy } = getCurrentInstance() as any
  const props = defineProps<{
    dialogType: boolean
    close: any
    row: any
  }>()

  const state: any = reactive({
    tableData: [
      {
        title: '铺布',
        style: 'cloth',
        time: '', //组件需要的格式
        cropping: ""
      },
      {
        title: '贴标',
        style: 'labelling',
        time: '',
        cropping: ""
      },
      {
        title: '裁剪',
        time: '',
        style: 'cropping',
        cropping: ""
      }
    ],
    cropping: []
  })
  const init = () => {
    proxy.$baseService.get('jack-ics-api/formulaContainer/getResource').then((res: any) => {
      if (!isEmpty(res.data)) {
        let list: any = []
        res.data.forEach((item: any) => {
          list.push({
            label: item.name,
            value: item.id
          })
        })
        state.cropping = list
      }
    })
  }
  init()

  // 生产任务订单查询
  const getPageList = () => {}
  onMounted(() => {
    getPageList()
  })
  const setTime = (e: any) => {}
  const btn = () => {
    //铺布
    let spreadTaskSta = moment(state.tableData[0].time[0]).valueOf()
    let spreadTaskEnd = moment(state.tableData[0].time[1]).valueOf()
    let spreadTaskId = state.tableData[0].cropping
    //贴标
    let pasteTaskSta = moment(state.tableData[1].time[0]).valueOf()
    let pasteTaskEnd = moment(state.tableData[1].time[1]).valueOf()
    let pasteTaskId = state.tableData[1].cropping
    //裁剪
    let cutTaskStar = moment(state.tableData[2].time[0]).valueOf()
    let cutTaskEnd = moment(state.tableData[2].time[1]).valueOf()
    let cutTaskId = state.tableData[2].cropping

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
      bedPlanId: props.row.id
    }
    proxy.$baseService.post('/jack-ics-api/spreadTask/save', { ...arr }).then((res: any) => {
      if(res.data===0){
       props.close('cancel')
      }
    })
  }
  // 取消
  const resetForm = (formEl: any) => {
    props.close('cancel')
  }
</script>
<style lang="less" scoped>

   /deep/ .el-input__inner {
        text-align: left !important; //输入框左对齐
      }

      .equipment{
    display: flex;
    flex-direction:column;
    // height: 450px;
    padding-bottom: 20px;
    overflow:auto
    // align-items: center;


  }

    .equipment-proportionsLeft {
      // width: 10px;
      font-size: 15px;
      position: absolute;
      top: -29px;
      right: 79px;
      color: rgb(69, 167, 231);
      cursor: pointer;
    }
    .defaultParam {
      width: 200px;
      height: 100px;
      overflow-y: scroll;
    }
    .relationOperaterList {
      transform: translateX(13px);
    }
    .equipment-left{
      width: 150px;
    }
    .equipmentBottom{
      height: 50px;
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
</style>

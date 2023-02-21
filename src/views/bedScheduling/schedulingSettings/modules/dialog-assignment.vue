<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-02-21 09:15:47
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>
    <el-checkbox v-model="state.checked1" label="" size="large" />
    裁床间隔时间不得大于
    <el-input-number v-model="state.number" class="fabricWeightInput" :min="0" :controls="false" />
    分钟
  </div>
  <br />
  <div class="assignment-title">
    <div class="assignment-top"></div>
    床次排序
  </div>
  <div class="dialogFoot">
    <el-button @click="resetForm('cancel')"> 取消</el-button>
    <el-button type="primary" class="preservation" @click="resetForm('preservation')">确认分派</el-button>
  </div>

  <br />

  <div>
    <el-table
      ref="singleTableRef"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      :data="state.tableData"
      :height="350"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column property="index" label="序号" />
      <el-table-column property="produceOrderCode" label="款号" />
      <el-table-column property="bedPlanNo" label="床次" />
      <el-table-column property="styleName" label="面料" />
      <el-table-column property="styleCode" label="件数">
        <template #default="{ row }">
          <div class="assignment-styleCode">{{ row.styleCode }}</div>
        </template>
      </el-table-column>
      <el-table-column property="styleBedNo" label="缝制上线日期" />
      <el-table-column property="styleBedNo" label="分派状态" />
      <el-table-column property="styleBedNo" label="操作" width="180">
        <template #default>
          <div class="operation">
            <div><img src="@/components/icon/top1.png" alt="" /></div>
            <div><img src="@/components/icon/top2.png" alt="" /></div>
            <div><img src="@/components/icon/bottom1.png" alt="" /></div>
            <div><img src="@/components/icon/bottom2.png" alt="" /></div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
    <div class="schedulingSettings-bottom">

    </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import './index.less'
  const props = defineProps<{
    close: any
    row: any
  }>()

  // const { proxy } = getCurrentInstance() as any
  // const props = defineProps<{
  // }>()

  const state: any = reactive({
    tableData: [],
    number: '',
    checked1: false
  })

  const init = () => {
    // if (props.row) {
    //   proxy.$baseService.get('/jack-ics-api/fabric/get', { id: props.row.id }).then((res: any) => {
    //   })
    // }
    let demoList: any = [
      {
        id: '1596011219208826882',
        styleImage: '',
        styleCode: '1125',
        styleName: '25号梭织',
        produceOrderCode: '68553',
        customName: '',
        bedPlanNo: 'BP-202211250899',
        styleBedNo: '1',
        fabricCode: 'S002',
        fabricName: '梭织面料',
        fabricColor: '黑，绿',
        overViewList: '1,2,3',
        finishList: null,
        nextTaskType: null
      },
      {
        id: '1597037922970431489',
        styleImage: '',
        styleCode: '1128',
        styleName: '测试28',
        produceOrderCode: '2828',
        customName: '',
        bedPlanNo: 'BP-202211280900',
        styleBedNo: '1',
        fabricCode: 'S002',
        fabricName: '梭织面料',
        fabricColor: '黑，绿',
        overViewList: '1,2,3',
        finishList: '1',
        nextTaskType: null
      },
      {
        id: '1597038926554132481',
        styleImage: '',
        styleCode: '1128-1-2',
        styleName: '测试28-1-2',
        produceOrderCode: '2828-2',
        customName: '',
        bedPlanNo: 'BP-202211280901',
        styleBedNo: '1',
        fabricCode: 'S002',
        fabricName: '梭织面料',
        fabricColor: '黑，绿',
        overViewList: '1,2,3',
        finishList: '1,2',
        nextTaskType: 2
      },
      {
        id: '1597038926554132481',
        styleImage: '',
        styleCode: '1128-1-2',
        styleName: '测试28-1-2',
        produceOrderCode: '2828-2',
        customName: '',
        bedPlanNo: 'BP-202211280901',
        styleBedNo: '1',
        fabricCode: 'S002',
        fabricName: '梭织面料',
        fabricColor: '黑，绿',
        overViewList: '1,2,3',
        finishList: '1,2',
        nextTaskType: 2
      },
      {
        id: '1597038926554132481',
        styleImage: '',
        styleCode: '1128-1-2',
        styleName: '测试28-1-2',
        produceOrderCode: '2828-2',
        customName: '',
        bedPlanNo: 'BP-202211280901',
        styleBedNo: '1',
        fabricCode: 'S002',
        fabricName: '梭织面料',
        fabricColor: '黑，绿',
        overViewList: '1,2,3',
        finishList: '1,2',
        nextTaskType: 2
      },
      {
        id: '1597038926554132481',
        styleImage: '',
        styleCode: '1128-1-2',
        styleName: '测试28-1-2',
        produceOrderCode: '2828-2',
        customName: '',
        bedPlanNo: 'BP-202211280901',
        styleBedNo: '1',
        fabricCode: 'S002',
        fabricName: '梭织面料',
        fabricColor: '黑，绿',
        overViewList: '1,2,3',
        finishList: '1,2',
        nextTaskType: 2
      }
    ]
    demoList.map((item: any, index: any) => {
      item.index = index + 1
    })
    state.tableData = demoList
  }

  init()
  // 取消
  const resetForm = (type: any) => {
    if (type === 'preservation') {
      // console.log("确认.")
    }
    props.close(type)
  }
</script>
<style lang="less" scoped>
  // /deep/ .el-input__inner {
  //   text-align: left !important; //输入框左对齐
  // }
  .assignment-top {
    width: 5px;
    height: 20px;
    background: #409eff;
    margin-right: 10px;
  }
  .assignment-title {
    display: flex;
  }
  .assignment-styleCode {
    color: #409eff;
  }
  .fabricWeightInput {
    width: 80px;
    height: 30px;
  }
  .dialogFoot {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 52px;
    background: #fff;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.302);
    z-index: 99;
  }
  .spreadTemplateId {
    transform: translate(25px, 0px);
  }
  .operation {
    cursor: pointer;
    width: 150px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .schedulingSettings-bottom{
    height: 40px;
  }
</style>

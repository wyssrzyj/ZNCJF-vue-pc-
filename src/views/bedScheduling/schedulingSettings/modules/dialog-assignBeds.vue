<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-02-22 11:02:48
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>
    <div class="beds-top">
   <div class="beds-top-title"> 款号查询：</div>
  <el-input v-model="state.form.value" placeholder="请输入款号" clearable />
    </div>
  </div>
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
    </el-table>
  </div>

  <div class="schedulingSettings-bottom"></div>
    <div class="dialogFoot">
    <el-button @click="resetForm('cancel')"> 取消</el-button>
    <el-button type="primary" class="preservation" @click="resetForm('preservation')">确认分派床次</el-button>
  </div>



</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import './index.less'
  const props = defineProps<{
    close: any
    row: any
  }>()



  const state: any = reactive({
    tableData: [],
    form:{
      value:"",
    }
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
  // 已分派场次关闭
 const close = (type: string) => {
    if (type == 'preservation') {
      state.assignmentType = false
    } else {
      state.assignmentType = false
    }
  }
</script>
<style lang="less" scoped>
  // /deep/ .el-input__inner {
  //   text-align: left !important; //输入框左对齐
  // }
    .beds-top{
      width: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
    }
  
  .schedulingSettings-bottom {
    height: 40px;
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
  .beds-top-title{
    width: 100px;
  }
</style>

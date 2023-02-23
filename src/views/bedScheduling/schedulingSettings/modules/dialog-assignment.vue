<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-02-22 17:22:07
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <!-- 参数设置 -->
  <div class="assignment">
    <div>
      <div class="assignment-title">
        <div class="assignment-top"></div>
        规则参数设置
      </div>

      <div class="assignment-work">
        <div class="assignment-work-left">
          <el-checkbox v-model="state.form.work" label="" size="large" />
          允许加班
        </div>
        <div class="assignment-work-right">
          <div v-show="state.form.work">
            最大加班时间
            <el-input-number v-model="state.form.workValue" class="fabricWeightInput" :min="0" :controls="false" />
            小时
          </div>
        </div>
      </div>
      <div class="assignment-work-bottom">
        <div class="assignment-work-left">
          <el-checkbox v-model="state.form.cutting" label="" size="large" />
          裁床时间间隔限制
        </div>
        <div class="assignment-work-right">
          <div v-show="state.form.cutting" class="assignment-work-right">
            小于
            <el-input-number v-model="state.form.cuttingValue" class="fabricWeightInput" :min="0" :controls="false" />
            小时
          </div>
        </div>
      </div>
    </div>
    <div class="optimizeSettings">
      <div class="assignment-title">
        <div class="assignment-top"></div>
        优化参数设置
      </div>

      <div class="assignment-work">
        <div class="assignment-work-left">
          <el-checkbox v-model="state.form.algorithm" label="" size="large" />
          启用裁剪工时算法
        </div>
      </div>
      <div class="assignment-work-bottom">
        <div class="assignment-work-left">
          <el-checkbox v-model="state.form.equipment" label="" size="large" />
          优先使用设备工作
        </div>
      </div>
    </div>
  </div>
  <br />

  <el-button class="assigned" type="primary" @click="state.assignmentType = true">+已分派床次</el-button>
  <!-- 表格 -->
  <div class="assignment-title">
    <div class="assignment-top"></div>
    床次排序
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
        <template #default="scope">
          <div class="operation">
            <div><img src="@/components/icon/top1.png" alt="" @click="setSort(scope.$index, 'toTop')" /></div>
            <div><img src="@/components/icon/top2.png" alt="" @click="setSort(scope.$index, 'top')"/></div>
            <div><img src="@/components/icon/bottom1.png" alt="" @click="setSort(scope.$index, 'toBottom')"/></div>
            <div><img src="@/components/icon/bottom2.png" alt=""  @click="setSort(scope.$index, 'bottom')"/></div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="schedulingSettings-bottom"></div>
  <div class="dialogFoot">
    <el-button @click="resetForm('cancel')"> 取消</el-button>
    <el-button type="primary" class="preservation" @click="resetForm('preservation')">确认分派</el-button>
  </div>

  <!-- 弹窗 -->
  <el-dialog v-if="state.assignmentType" v-model="state.assignmentType" :draggable="false" :close-on-click-modal="false" title="已分派床次" width="850px">
    <assignBeds :row="[]" :close="close" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { cloneDeep } from 'lodash'

  import assignBeds from './dialog-assignBeds.vue'

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
    assignmentType: false, //已分派床次
    form: {
      work: false,
      workValue: '',
      cutting: false,
      cuttingValue: '',
      algorithm: false,
      equipment: false
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
        produceOrderCode: '1',
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
        produceOrderCode: '2',
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
        produceOrderCode: '3',
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
        produceOrderCode: '4',
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
 const setIndex = (list:any) => {
      list.map((item: any, index: any) => {
      item.index = index + 1
    })
    state.tableData = list
  }
  //顺序操作
  const setSort = (index: any, type: any) => {
    let list = cloneDeep(state.tableData)
    //置顶
    if (type === 'toTop') {
      if (index === 0) return
      let tempArr = list.splice(index, 1)
      list.unshift(tempArr[0])
      setIndex(list)
    }
    //向上
     if (type === 'top') {
       if (index === 0) return
      let item=list[index]
      list.splice(index, 1,) 
      list.splice(index-1, 0,item) 
      setIndex(list)
    }
    //置底
    if (type === 'toBottom') {
      if (index === list.length - 1) return
      let tempArr = list.splice(index, 1) 
      list.push(tempArr[0])
      setIndex(list)
    }
    //向下
     if (type === 'bottom') {
      let item=list[index]
      list.splice(index, 1,) 
      list.splice(index+1, 0,item) 
      setIndex(list)
    }

  }

  const swap = (arr: any, CurrentIndex: number, MoveIndex: number) => {
    arr[CurrentIndex] = arr.splice(MoveIndex, 1, arr[CurrentIndex])[0]
  }

  const dec = (index: number, arr: any) => {
    if (index === arr.length - 1) {
      return
    }
    swap(arr, index, index + 1)
  }

  const inc = (index: number, arr: any) => {
    if (index === 0) return
    swap(arr, index, index - 1)
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
  .schedulingSettings-bottom {
    height: 40px;
  }
  .assignment {
    display: flex;
  }
  .assignment-work {
    display: flex;
  }
  .assignment-work-bottom {
    display: flex;
    margin-top: 10px;
  }
  .assignment-work-left {
    width: 150px;
  }
  .assignment-work-right {
    margin-left: 55px;
  }
  .optimizeSettings {
    margin-left: 100px;
  }
  .assigned {
    float: right;
    transform: translateY(-10px);
  }
  .assignment-work-right {
    width: 200px;
  }
</style>

<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-01-29 17:16:40
 * @Description: 
 * @LastEditors: lyj
-->
<template>
<div class="table">
            <el-table :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }"  ref="singleTableRef" :data="state.tableData" :height="350" highlight-current-row style="width: 100%" >
              <el-table-column property="produceOrderCode" label="床次" />
              <el-table-column property="bedPlanNo" label="面料" />
              <el-table-column property="styleName" label="主料/辅料" />
              <el-table-column property="styleCode" label="计划层数" />
              <el-table-column property="styleBedNo" label="计划件数" />

              <el-table-column property="customName" label="排唛比例" >
                <template #default>
                <img :src="edit" alt="" class="schedulingSettings-edit">
              </template>

              </el-table-column>
              <el-table-column property="customName" label="计划开始时间" />
              <el-table-column property="customName" label="计划结束时间" />
              <el-table-column property="customName" label="铺布任务">
                <template #default="scope" >
                  <div class="tableContainer">
                    <div class="check-customName">
                      <div class="innerCircle"></div>
                    </div>
                    <div :class="scope.row.cloth === true?'progress-customName':'progress-customName-no'"></div>
                  </div>
                  <!-- <div v-if="scope.row" class="homeTable-correct">
                    <el-icon><Select /></el-icon>
                  </div> -->
                </template>
              </el-table-column>
              <el-table-column property="cloth" label="贴标任务">
                <template #default="scope">
                   <div class="tableContainer">
                    <div :class="scope.row.cloth === true?'progress':'progress-no'"></div>
                    <div :class="scope.row.cloth === true?'check':'unchecked'">
                      <div v-if="scope.row.cloth === true" class="innerCircle"></div>
                    </div>
                    <div :class="scope.row.labeling === true||scope.row.cropping === true?'progress':'progress-no'"></div>
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column property="labeling" label="贴标任务">
                <template #default="scope">
                   <div class="tableContainer">
                    <div :class="scope.row.labeling === true||scope.row.cropping === true?'progress':'progress-no' "></div>
                    <div :class="scope.row.labeling === true?'check':'unchecked'">
                      <div v-if="scope.row.labeling === true" class="innerCircle"></div>
                    </div>
                    <div :class="scope.row.cropping === true||scope.row.cropping === true?'progress':'progress-no'"></div>
                  </div>
                
                </template>
              </el-table-column> -->
              <el-table-column property="labeling" label="裁剪任务">
                <template #default="scope">
                   <div class="tableContainer">
                    <div :class="scope.row.labeling === true?'progress-cropping':'progress-cropping-no'"></div>
                    <div :class="scope.row.labeling === true?'check-cropping':'check-cropping-no'">
                      <div v-if="scope.row.labeling === true" class="innerCircle"></div>
                    </div>
                  </div>
                
                </template>
              </el-table-column>
            </el-table>
          </div>

 
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance ,onMounted} from 'vue'
  import { isEmpty  } from 'lodash'
  import edit from '@/components/icon/edit.png'

  const { proxy } = getCurrentInstance() as any
  // const props = defineProps<{
  // }>()


  const state: any = reactive({
    tableData: [],
  })

  // 生产任务订单查询
  const getPageList = () => {
    proxy.$baseService.get('/jack-ics-api/index/bedTask').then((res: any) => {
      let demoList=[
  {
    "id": "1596011219208826882",
    "styleImage": "",
    "styleCode": "1125",
    "styleName": "25号梭织",
    "produceOrderCode": "68553",
    "customName": "",
    "bedPlanNo": "BP-202211250899",
    "styleBedNo": "1",
    "fabricCode": "S002",
    "fabricName": "梭织面料",
    "fabricColor": "黑，绿",
    "overViewList": "1,2,3",
    "finishList": null,
    "nextTaskType": null
  },
  {
    "id": "1597037922970431489",
    "styleImage": "",
    "styleCode": "1128",
    "styleName": "测试28",
    "produceOrderCode": "2828",
    "customName": "",
    "bedPlanNo": "BP-202211280900",
    "styleBedNo": "1",
    "fabricCode": "S002",
    "fabricName": "梭织面料",
    "fabricColor": "黑，绿",
    "overViewList": "1,2,3",
    "finishList": "1",
    "nextTaskType": null
  },
  {
    "id": "1597038926554132481",
    "styleImage": "",
    "styleCode": "1128-1-2",
    "styleName": "测试28-1-2",
    "produceOrderCode": "2828-2",
    "customName": "",
    "bedPlanNo": "BP-202211280901",
    "styleBedNo": "1",
    "fabricCode": "S002",
    "fabricName": "梭织面料",
    "fabricColor": "黑，绿",
    "overViewList": "1,2,3",
    "finishList": "1,2",
    "nextTaskType": 2
  },
  {
    "id": "1597038926554132481",
    "styleImage": "",
    "styleCode": "1128-1-2",
    "styleName": "测试28-1-2",
    "produceOrderCode": "2828-2",
    "customName": "",
    "bedPlanNo": "BP-202211280901",
    "styleBedNo": "1",
    "fabricCode": "S002",
    "fabricName": "梭织面料",
    "fabricColor": "黑，绿",
    "overViewList": "1,2,3",
    "finishList": "1,2",
    "nextTaskType": 2
  },
  {
    "id": "1597038926554132481",
    "styleImage": "",
    "styleCode": "1128-1-2",
    "styleName": "测试28-1-2",
    "produceOrderCode": "2828-2",
    "customName": "",
    "bedPlanNo": "BP-202211280901",
    "styleBedNo": "1",
    "fabricCode": "S002",
    "fabricName": "梭织面料",
    "fabricColor": "黑，绿",
    "overViewList": "1,2,3",
    "finishList": "1,2",
    "nextTaskType": 2
  },
    {
    "id": "1597038926554132481",
    "styleImage": "",
    "styleCode": "1128-1-2",
    "styleName": "测试28-1-2",
    "produceOrderCode": "2828-2",
    "customName": "",
    "bedPlanNo": "BP-202211280901",
    "styleBedNo": "1",
    "fabricCode": "S002",
    "fabricName": "梭织面料",
    "fabricColor": "黑，绿",
    "overViewList": "1,2,3",
    "finishList": "1,2",
    "nextTaskType": 2
  },
  
]
      if (!isEmpty(res.data)) {
        // state.total = res.data.total
        state.total = demoList
        //添加任务状态
        // let list = res.data.list
        let list = demoList
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
              //
              // if (item.finishList.includes('3')) {
              //   item.cropping = true
              // }
            }
          })
        }
        state.tableData = list
      }
    })
  }
 onMounted(() => {
    getPageList()
  })
 
 
</script>
<style lang="less" scoped>
  /deep/ .el-input__inner {
    text-align: left !important; //输入框左对齐
  }
.table{
    width: 66vw;
}
  .innerCircle{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #0abadc;
  
}

  .tableContainer{
  display: flex;
  position: relative;
  height: 30px;
}

//铺布、贴标
.progress{
    width: 50%;
    height: 10px;
    background: #0abadc;
    transform: translate(0px, 6px);
      background-image: linear-gradient(#039af99e, #fff,#039af99e);
}
.progress-no{
    width: 50%;
    height: 10px;
    background: #ddd;
    transform: translate(0px, 6px);
}
// 床次计划
.check-customName{
  margin-left: 44%;
  width: 22px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #409eff;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  z-index: 99;
  overflow: hidden;
  transform: translate(2px, 0px);

}
.progress-customName{
  width: 50%;
  height: 10px;
  background: #0abadc;
  background-image: linear-gradient(#039af99e, #fff,#039af99e);
  transform: translate(0px, 6px);
}
.progress-customName-no{
  width: 50%;
  height: 10px;
  background: #ddd;
  transform: translate(0px, 6px);
}

// 裁剪任务
.progress-cropping{
   width: 60px;
  height: 10px;
  background: #0abadc;
   background-image: linear-gradient(#039af99e, #fff,#039af99e);
  transform: translate(0px, 6px);
}
.progress-cropping-no{
   width: 60px;
  height: 10px;
  background: #ddd;
  transform: translate(0px, 6px);
}
.check-cropping{
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #409eff;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  transform: translate(-2px, 0px);
}
.check-cropping-no{
  width: 20px;
  height: 20px;
  border-radius: 50%;
    border: 4px solid #bbc1c7;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  transform: translate(-2px, 0px);
}

</style>

<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-04-12 14:54:15
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="leftTable" :style="{ width:state.width + 'vw' }">
    <el-table class="schedulingSettingsTable"
     border
     :data="state.tableData"
      show-summary
       style="width: 100%" 
       height="200"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }">
      <el-table-column prop="color" label="颜色" align="center" fixed />
      <!-- 动态尺码  -->
      <el-table-column v-for="(item, i) in state.size" :key="i" width="100" :prop="item.number" align="center">
        <template #header>
          <div class="tableHeader">
            <span>{{ item.number }}</span>
          </div>
        </template>
        <template #default="{ row }">
          <span>{{ row[item.number] }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="bedSum" label="小计" align="center" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, onMounted,  watch } from 'vue'
  import { isEmpty } from 'lodash'

  const props = defineProps<{
    data: any,
    width?:any
  }>()
  const state: any = reactive({
    width:65   ,
    tableData: [],
    size: [], //动态尺码
    shelfList: [], //尺码数据
    type: false,
  })

  //处理尺码格式问题
  const setSize = (size: any) => {
    let sizeData: any = []
    if (!isEmpty(size)) {
      size.forEach((item: any, index: any) => {
        try {
          if (item.size) {
            sizeData.push({ number: item.size, indexId: index })
          }
        } catch (error) {}
      })
    }
    state.size = sizeData
  }

  //处理显示尺码字段
  const conversion = (data: any[], size: any, value: any) => {
    //处理显示尺码字段
    const obj: any = {}
    data.map((e: any) => {
      //键名=建值
      obj[e[size]] = e[value]
    })
    return obj
  }

  const setTableData = (data: any) => {
    let list: any = []
    if (!isEmpty(data)) {
      data.forEach((item: any) => {
        if (!isEmpty(item.sizeAndAmountList)) {
          list.push({ ...item, ...conversion(item.sizeAndAmountList, 'size', 'levelClothSum') })
        }
      })
    }

    return list
  }
  const totalBedTimes = (v: any) => {
    let sum = 0
    if (!isEmpty(state.size)) {
      state.size.forEach((item: any) => {
        if (v[item.number] > 0) {
          sum += v[item.number]
        }
      })
    }
    return sum
  }

   const setSpreadClothLevel = (data: any) => {
    if (!isEmpty(data)) {
      data.map((v: any) => {
        //获取小计
        v.bedSum =  totalBedTimes(v)
      })


    }
    return data
  }

  const init = (e: any) => {
      if (!isEmpty(e)) {
        //动态尺码
        let sizeList: any =e.sizeList
        if(!isEmpty(sizeList)){
        setSize(sizeList)
        }
        // 格式处理
        let list = setTableData(e.shelfList)
       let bedSumData = setSpreadClothLevel(list)

        state.tableData = bedSumData
      }
  }
  // 生产任务订单查询
  const getPageList = () => {}
  onMounted(() => {
    getPageList()
  })

  watch(
    () => props.data,
    item => {
      init(item)
      state.width=props.width
    }
    // ,{deep:true}
    ,{deep:true,immediate: true}
  )
  
</script>
<style lang="less" scoped>
  .leftTable {
    float: left;
  }
  .leftTable-top{
    line-height: 20px;
    margin-top: 23px;
    margin-bottom: 10px;
  }
   .leftTable-top-no{
    height: 65px;
  }
  .cutApart{
    width: 100%;
    height: 2px;
    background: #eee;
    margin-top: 10px;
}
  .leftTable-top-title{
    transform: translate(0, -8px) ;
  }
  .schedulingSettingsTable{
   /deep/ .el-table__footer-wrapper tbody td.el-table__cell{
        background-color: #fff !important ;
  }
  }
  
</style>

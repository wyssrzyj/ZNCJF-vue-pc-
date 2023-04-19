<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-04-19 11:00:57
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="leftTable">
    <el-table class="schedulingSettingsTable"
     border
     :data="state.tableData"
       style="width: 100%" 
       height="200"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }">
      <el-table-column prop="zh" label="扎号" align="center"  />
      <el-table-column prop="color" label="颜色" align="center"  />
      <el-table-column prop="size" label="尺码" align="center"  />
      <el-table-column prop="sum" label="件数" align="center"  />
      <el-table-column  label="流水" align="center"  >
          <template #default="{ row }">
          <div class="water">
            <div class="water-left">{{row.lsSet}}</div>
            <div class="water-right">{{row.lsEnd}}</div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="color" label="操作" align="center"  >
          <template #default="{ row }">
            <div class="operate">
            <div class="operate-left" @click="btn(1,null)">+</div>
            <div class="operate-right" @click="btn(2,row)">-</div>
          </div>
        </template>
      </el-table-column>-->
    </el-table> 
  </div>
</template>

<script lang="ts" setup>
  import { reactive, onMounted,  watch } from 'vue'
  import { isEmpty } from 'lodash'

  const props = defineProps<{
    data: any
  }>()
  const state: any = reactive({
    tableData: [],
    size: [], //动态尺码
    shelfList: [], //尺码数据
    type: false
  })





  const init = (e: any) => {
    // [ {zh:"1",id:1,color:"红色",size:"x",sum:"15",lsSet:"1",lsEnd:"15"}]
      if(!isEmpty(e)){
    state.tableData = e
    }else{
    state.tableData =[]
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
    }
    ,{deep:true,immediate: true}
  )

 
</script>
<style lang="less" scoped>
  .leftTable {
    width: 60vw  ;
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
  .water{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .water-left{
    width: 30px;
    height: 30px;
    background: #eeeeee75;
    text-align: center;
    line-height: 30px;
   
  }
    .water-right{
    width: 30px;
    height: 30px;
    color: #dcdfe6;
    background: #bfbfbf;
    text-align: center;
    line-height: 30px;

  }
  .operate{
      display: flex;
    justify-content: space-around;
    align-items: center;
  }
    .operate-left{
      cursor: pointer;
    width: 30px;
    height: 30px;
    border: 1px solid #c0c4cc;
    text-align: center;
    line-height: 30px;
  }
   .operate-right{
    cursor: pointer;
    width: 30px;
    height: 30px;
    border: 1px solid #c0c4cc;
    text-align: center;
    line-height: 30px;

  }
</style>

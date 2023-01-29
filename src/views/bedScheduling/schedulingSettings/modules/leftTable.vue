<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-01-29 17:18:18
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="leftTable">
          <el-table :data="state.tableData" border show-summary style="width: 100%" height="340">
    <el-table-column prop="color" label="颜色"  align="center"/>
    <el-table-column prop="layers" label="层数"  align="center"/>
    <el-table-column prop="x"  label="x" align="center"/>
    <el-table-column prop="m"  label="m" align="center"/>
    <el-table-column prop="l"  label="l" align="center"/>
    <el-table-column prop="number"  label="件数"  align="center"/>
  </el-table>
  </div>

</template>

<script lang="ts" setup>
  import { reactive ,onMounted} from 'vue'
  // import type { TableColumnCtx } from 'element-plus'
  // const { proxy } = getCurrentInstance() as any
  // const props = defineProps<{
  // }>()
  const state: any = reactive({
    tableData: [
  {
    color: '红色',
    layers: '1',
    x: '234',
    m: '3.2',
    l: 10,
    number:100,
  },
   {
    color: '绿色',
    layers: '2',
    x: '234',
    m: '3.2',
    l: 10,
    number:200,

  },
   {
    color: '蓝色',
    layers: '3',
    x: '234',
    m: '3.2',
    l: 10,
    number:300,

  },
    {
    color: '红色',
    layers: '1',
    x: '234',
    m: '3.2',
    l: 10,
    number:100,
  },
   {
    color: '绿色',
    layers: '2',
    x: '234',
    m: '3.2',
    l: 10,
    number:200,

  },
   {
    color: '蓝色',
    layers: '3',
    x: '234',
    m: '3.2',
    l: 10,
    number:300,

  },
    {
    color: '红色',
    layers: '1',
    x: '234',
    m: '3.2',
    l: 10,
    number:100,
  },
   {
    color: '绿色',
    layers: '2',
    x: '234',
    m: '3.2',
    l: 10,
    number:200,

  },
   {
    color: '蓝色',
    layers: '3',
    x: '234',
    m: '3.2',
    l: 10,
    number:300,

  },
  
],
  })

  // 生产任务订单查询
  const getPageList = () => {
    
 
  }
 onMounted(() => {
    getPageList()
  })
</script>
<style lang="less" scoped>
.leftTable{
  width: 34vw;
  float: left;
}

</style>

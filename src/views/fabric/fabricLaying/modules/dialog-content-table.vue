<!--
 * @Author: lyj
 * @Date: 2022-08-25 12:48:07
 * @LastEditTime: 2022-09-06 18:21:19
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div>
    <div class="bottomTableTitle">布斗速度</div>
    <el-table :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" :data="state.tableData" border>
      <el-table-column prop="date" label="段速" width="60" />
      <el-table-column v-for="(item, i) in state.data" :key="i" :label="item.name" width="60">
        <template #default="scope">
          <el-input-number v-model="scope.row[item.model]" :disabled="props.type" class="fabricLayingInput" :controls="false" :precision="1" :step="0.1" @change="handleChange" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  import { customTableData } from './conifgs.ts'
  import './index.less'

  const { tableMiddleData, tableData } = customTableData

  const props = defineProps<{
    onChang: any
    bottomTable: any
    type: any
  }>()

  const state = reactive({
    tableData: tableData,
    data: tableMiddleData
  })

  // 初始
  const init = () => {
    state.tableData = props.bottomTable
  }
  init()
  // 数据 更新
  watch(
    () => props.bottomTable,
    item => {
      state.tableData = item
    }
  )

  const handleChange = () => {
    props.onChang(state.tableData)
  }
</script>

<style></style>

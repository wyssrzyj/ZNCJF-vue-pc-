<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-08-23 14:05:44
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-table
    ref="table"
    :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }"
    :data="state.tableData"
    height="100%"
    stripe
    style="width: 100%"
    @selection-change="handleSelectionChange"
    @select="dialogCheck"
  >
    <el-table-column v-for="item in state.tableColumns" :key="item.dataIndex" :prop="item.dataIndex" :label="item.title" :fixed="item.fixed">
      <template #default="scope">
        <div v-if="item.dataIndex === 'size'">
          <el-input
            v-model="scope.row.size"
            placeholder="请输入尺码"
            @change="
              e => {
                handleChange(e, scope.row, 'size')
              }
            "
          />
        </div>
        <div v-if="item.dataIndex === 'monolayer'">
          <el-input-number
            v-model="scope.row.monolayer"
            :min="1"
            controls-position="right"
            placeholder="请输入入"
            @change="
              e => {
                handleChange(e, scope.row, 'monolayer')
              }
            "
          />
        </div>
      </template>
    </el-table-column>

    <!-- <el-table-column label="操作" width="180">
      <template #default="scope">
        <el-icon v-if="scope.$index === 0" class="filledIcon" :size="30" @click="increase"><ZoomIn /></el-icon>
        <el-icon v-if="scope.$index !== 0" class="filledIcon" :size="30" @click="reduce(scope.row)"><Remove /></el-icon>
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script lang="ts" setup>
  import { reactive, onMounted } from 'vue'
  import { tableColumns } from './conifgs'
  import './index.css'
  import { isEmpty } from 'lodash'

  const emit = defineEmits(['getData'])
  const backData = (e: any) => {
    emit('getData', e)
  }
  const props = defineProps<{
    data: any
  }>()
  const state = reactive({
    data: props.data,
    tableColumns: tableColumns,
    tableData: []
  })

  const init = () => {
    // 先判断接口是否有数据

    // 有

    // 没有
    const fabricColor = props.data.fabricColor
    if (fabricColor) {
      let data = fabricColor.split('，')
      if (!isEmpty(data)) {
        let res: any = []
        data.forEach((item: any, index: any) => {
          res.push({
            unique: index,
            color: item,
            size: '',
            monolayer: 1,
            layingNumber: props.data.layingNumber,
            total: 0
          })
        })
        res.map((item: any) => {
          item.total = item.monolayer * item.layingNumber
        })

        state.tableData = res
        backData(res)
      }
    }
  }

  //数字输入框处理
  const handleChange = (e: any, row: any, type: any) => {
    if (type === 'monolayer') {
      row.total = row.layingNumber * e
    }
    backData(state.tableData)
  }
  onMounted(() => {
    init()
  })
</script>

<style></style>

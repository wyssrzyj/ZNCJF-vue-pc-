<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-10-06 15:09:57
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-table
    ref="table"
    height="500"
    style="width: 100%"
    :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }"
    :data="state.tableData"
    border
    stripe
    @selection-change="handleSelectionChange"
  >
    <el-table-column v-for="item in state.tableColumns" :key="item.dataIndex" :prop="item.dataIndex" :label="item.title" :fixed="item.fixed" />

    <el-table-column fixed="right" label="操作" width="120">
      <template #default="{ row }">
        <el-button :disabled="disable(false)" link type="primary" size="small" @click="selectedChange(row)">选择</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance, watch } from 'vue'
  import { specData } from './conifgs'

  import './index.less'
  import { isEmpty } from 'lodash'
  const { proxy } = getCurrentInstance()

  const table: any = ref()

  const props = defineProps<{
    type: any
    select: any
    form: any
  }>()
  const state: any = reactive({
    selectioned: {},
    dialogTableVisible: false,
    tableColumns: specData,
    tableData: []
  })
  //格式处理
  const setDataFormat = (list: any) => {
    if (!isEmpty(list)) {
      list.map((item: any) => {
        if (!isEmpty(item.taskDeviceList)) {
          item.taskDeviceList.forEach((v:any) => {
            if (v.type === 1) {
              item.id=v.id
              item.sn = v.sn//用于选择返回给父级的数据

              item.equipmentSn = v.sn
              item.equipmentSn = v.sn
              item.equipmentName = v.name
            }
            if (v.type === 2) {
              item.labelingSn = v.sn
              item.labelingName = v.name
            }
            if (v.type === 3) {
              item.cuttingSn = v.sn
              item.cuttingName = v.name
            }
          })
        }
      })
    }

    state.tableData = list
  }
  const init = () => {
    //数据回显
    proxy.$baseService.get('/jack-ics-api/device/taskDevice').then((res: any) => {
      setDataFormat(res.data.list)
    })
  }

  init()

  watch(
    () => props.form,
    item => {
      proxy.$baseService.get('/jack-ics-api/device/pageList', item).then((res: any) => {
        setDataFormat(res.data.list)
      })
    }
  )

  //选中项传递给父级
  const selectedChange = (e: any) => {
    props.select(e)
  }
  // 是否可用
  const disable = (type: any) => {
    return props.type === true ? true : type
  }
</script>

<style>
</style>

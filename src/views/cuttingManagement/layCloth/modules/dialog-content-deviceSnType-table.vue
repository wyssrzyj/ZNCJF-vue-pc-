<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-09-13 13:45:16
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
    <el-table-column v-for="item in state.tableColumns" :key="item.dataIndex" :prop="item.dataIndex" :label="item.title" :fixed="item.fixed" >
      <template #default="{ row }">
        <div v-if="item.dataIndex !== 'img'">
          <span>{{ row[item.dataIndex] }}</span>
        </div>
        <div v-if="item.dataIndex === 'img'">
          <ImgModular :img="row.img" />
        </div>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="操作" width="120">
      <template #default="{ row }">
        <el-button  :disabled="disable(false)" link type="primary" size="small" @click="selectedChange(row)">选择</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance ,watch} from 'vue'
  import { specData } from './conifgs'
  import ImgModular from '@/components/imgModular/index.vue'

  import './index.less'
  const { proxy } = getCurrentInstance()

  const table: any = ref()

  const props = defineProps<{
    type:any
    select: any
    form: any

  }>()
  const state: any = reactive({
    selectioned: {},
    dialogTableVisible: false,
    tableColumns: specData,
    tableData: []
  })

  const init = () => {
    //数据回显
    proxy.$baseService.get('/jack-ics-api/device/pageList').then((res: any) => {
      state.tableData = res.data.list
    })
  }

  init()

    watch(
    () => props.form,
    item => {
      proxy.$baseService.get('/jack-ics-api/device/pageList', item).then((res: any) => {
        state.tableData = res.data.list
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
  .el-table__header-wrapper .el-checkbox {
    display: none;
  }
</style>

<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-09-22 22:12:30
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
    <el-table-column v-for="item in state.tableColumns" :key="item.dataIndex" :prop="item.dataIndex" :label="item.title" :fixed="item.fixed" width="120">
      <template #default="{ row }">
        <div v-if="item.dataIndex !== 'styleImage' && item.dataIndex !== 'statu'">
          <span>{{ row[item.dataIndex] }}</span>
        </div>
        <div v-if="item.dataIndex === 'styleImage'">
          <ImgModular :img="row.styleImage" />
        </div>
        <div v-if="item.dataIndex === 'statu'">
          <el-tag v-if="row.statu" class="ml-2" :type="tagType.get(row.statu)"> {{ mapType.get(row.statu) }}</el-tag>
        </div>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="操作" width="120">
      <template #default="{ row }">
        <el-button :disabled="disable(false)" link type="primary" size="small" @click="selectedChange(row)">选择</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:currentPage="page"
    v-model:page-size="limit"
    :page-sizes="[10, 20, 50, 100]"
    :small="small"
    :disabled="disabled"
    :background="background"
    layout="total, sizes, prev, pager, next, jumper"
    :total="state.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance, watch } from 'vue'
  import { tagType, mapType } from '@/components/conifgs.ts'

  import ImgModular from '@/components/imgModular/index.vue'

  import { tableColumns } from './conifgs'
  import './index.less'
  const { proxy } = getCurrentInstance()

  const page = ref(1)
  const limit = ref(10)

  const table: any = ref()

  const props = defineProps<{
    select: any
    form: any
    type: any
  }>()
  const state: any = reactive({
    forms: {},
    total: 0,
    selectioned: {},
    dialogTableVisible: false,
    tableColumns: tableColumns,
    tableData: []
  })

  const setList = (data?: any) => {
    let arr = { ...data, statu: '1' }
    proxy.$baseService.get('/jack-ics-api/bedPlan/pageList', arr).then((res: any) => {
      state.total = res.data.total
      state.tableData = res.data.list
    })
  }

  const init = () => {
    //数据回显
    setList()
  }

  init()

  watch(
    () => props.form,
    item => {
      state.forms = item
      setList(item)
    }
  )

  // 是否可用
  const disable = (type: any) => {
    return props.type === true ? true : type
  }

  const handleSizeChange = (val: number) => {
    let data = { ...state.forms, page: page.value, limit: limit.value }
    setList(data)
  }
  const handleCurrentChange = (val: number) => {
    let data = { ...state.forms, page: page.value, limit: limit.value }
    setList(data)
  }

  //选中项传递给父级
  const selectedChange = (e: any) => {
    //详情数据
    proxy.$baseService.get('/jack-ics-api/bedPlan/get', { id: e.id }).then((res: any) => {
      props.select(res.data)
    })
  }
</script>

<style>
  .el-table__header-wrapper .el-checkbox {
    display: none;
  }
</style>

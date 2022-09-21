<!--
 * @Author: lyj
 * @Date: 2022-08-31 13:11:11
 * @LastEditTime: 2022-09-21 12:59:12
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @on-add-update-handle="handleAddOrUpdate" @row-dblclick="handleRowDbclick">
    <template #queryFormItem>
      <el-form-item label="面料编号" prop="sn">
        <el-input v-model="state.queryFormData.sn" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="面料名称" prop="name">
        <el-input v-model="state.queryFormData.name" placeholder="请输入" clearable />
      </el-form-item>
    </template>

    <template #operationExtBtn>
      <el-button type="primary" style="order: 3" @click="handleClick(false, '新增铺布', {})">新增</el-button>
    </template>

    <template #imageUrl="{ row }">
      <ImgModular :img="row.imageUrl" />
    </template>

    <template #fabricType="{ row }">
      <span> {{ fabric.get(row.fabricType) }}</span>
    </template>
    <template #fabricWeight="{ row }">
      <span> {{ row.fabricWeightMin }}~{{ row.forwardSpeedMax }}</span>
    </template>
    <template #uniformTightness="{ row }">
      <span> {{ row.uniformTightnessMin }}~{{ row.uniformTightnessMax }}</span>
    </template>
    <template #forwardSpeed="{ row }">
      <span> {{ row.forwardSpeedMin }}~{{ row.forwardSpeedMax }}</span>
    </template>
    <template #backSpeed="{ row }">
      <span> {{ row.backSpeedMin }}~{{ row.backSpeedMax }}</span>
    </template>
    <template #relationFabricName="{ row }">
      <span> {{ row.relationFabricName }}</span>
    </template>

    <template #actionExtBtn="{ row }">
      <el-button link type="primary" style="order: 3" @click="handleClick(true, '查看铺布', row)">查看</el-button>
      <el-button link type="primary" style="order: 3" @click="handleClick(false, '编辑铺布', row)">编辑</el-button>
    </template>

    <el-dialog v-model="state.dialogTableVisible" :close-on-click-modal="false" :title="state.dialogTitle" width="1250px">
      <DialogContent v-if="state.dialogTableVisible" :row="state.data.row" :close="close" :dialog-type="state.dialogType" />
    </el-dialog>
  </njp-table-config>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { fabric } from '@/components/conifgs.ts'

  import ImgModular from '@/components/imgModular/index.vue'

  import DialogContent from './modules/dialog-content.vue'

  // const { proxy }: any = getCurrentInstance()

  const styleLibListEl = ref()
  const state = reactive({
    dialogType: true,
    dialogTableVisible: false,
    dialogTitle: '',
    data: {
      row: {}
    },

    queryFormData: {
      sn: '',
      name: ''
    },

    dialogVisible: false,
    title: '上传',
    fileList: [],
    rowData: { type: '' },
    limit: 6
  })

  const handleAddOrUpdate = (row: any) => {
    //根据有无row判断点击新增或编辑按钮
  }

  const refreshTable = () => {
    styleLibListEl.value.refreshTable()
  }

  //新增、编辑、查看
  const handleClick = (e: any, type: any, row: any) => {
    state.data.row = row
    state.dialogTitle = type
    state.dialogType = e
    state.dialogTableVisible = true
  }

  //关闭 弹窗

  const close = (type: string) => {
    state.data.row = {}
    if (type == 'preservation') {
      state.dialogTableVisible = false
      refreshTable()
    } else {
      state.dialogTableVisible = false
    }
  }
</script>

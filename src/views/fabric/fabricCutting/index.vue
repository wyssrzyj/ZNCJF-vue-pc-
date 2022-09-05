<!--
 * @Author: lyj
 * @Date: 2022-08-31 13:11:11
 * @LastEditTime: 2022-09-04 16:41:26
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
      <el-button type="primary" style="order: 3" @click="handleClick(false, '新增面料')">新增</el-button>
    </template>

    <template #img="{ row }">
      <ImgModular :img="row.img" />
    </template>

    <template #type="{ row }">
      {{ mapType.get(row.type) }}
    </template>

    <template #actionExtBtn="{ row }">
      <el-button link type="primary" style="order: 3" @click="handleClick(true, '查看面料管理', row)">查看</el-button>
      <el-button link type="primary" style="order: 3" @click="handleClick(false, '编辑面料管理', row)">编辑</el-button>
    </template>

    <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :close-on-click-modal="false" :title="state.dialogTitle" width="1200px">
      <DialogContent :row="state.data.row" :close="close" :dialog-type="state.dialogType" />
    </el-dialog>
  </njp-table-config>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance, ref } from 'vue'
  import ImgModular from '@/components/imgModular/index.vue'
  // import DialogContent from './dialogContent/index.vue'
  import DialogContent from './modules/dialog-content.vue'
  // import DialogContent from './modules/dialog-content.vue'

  let mapType = new Map()
  mapType.set(1, '针织面料')
  mapType.set(2, '梭织面料')
  const { proxy }: any = getCurrentInstance()

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
    if (type == 'preservation') {
      state.dialogTableVisible = false
      refreshTable()
    } else {
      state.dialogTableVisible = false
    }
  }
</script>

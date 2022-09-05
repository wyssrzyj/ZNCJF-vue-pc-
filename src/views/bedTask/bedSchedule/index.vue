<template>
  床次
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @on-add-update-handle="handleAddOrUpdate">
    <template #queryFormItem>
      <el-form-item label="生产订单" prop="produceOrderCode">
        <el-input v-model="state.queryFormData.produceOrderCode" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="床次计划号" prop="bedPlanNo">
        <el-input v-model="state.queryFormData.bedPlanNo" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="款式编号" prop="styleCode">
        <el-input v-model="state.queryFormData.styleCode" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="statu">
        <el-select v-model="state.queryFormData.statu" clearable filterable>
          <el-option v-for="item in state.statu" :key="item.name" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
    </template>

    <template #operationExtBtn>
      <el-button type="primary" style="order: 1" @click="handleUploadStyle">批量导入款式</el-button>
      <el-button type="primary" style="order: 2" @click="handleUploadFile">批量导入文件</el-button>
      <el-button type="primary" style="order: 3" @click="handleClick(false, '新增床次计划')">新增</el-button>
    </template>

    <template #styleImage="{ row }">
      <ImgModular :img="row.styleImage" />
    </template>
    <template #statu="{ row }">
      {{ mapType.get(row.statu) }}
    </template>

    <template #actionExtBtn="{ row }">
      <el-button link type="primary" style="order: 3" @click="handleClick(true, '查看设备', row)">查看</el-button>
      <el-button link type="primary" style="order: 3" @click="handleClick(false, '编辑设备', row)">编辑</el-button>
    </template>

    <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :title="state.dialogTitle" width="1000px">
      <DialogContent :row="state.row" :close="close" :dialog-type="state.dialogType" />
    </el-dialog>
  </njp-table-config>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import ImgModular from '@/components/imgModular/index.vue'

  import DialogContent from './modules/dialog-content.vue'

  let mapType = new Map()
  mapType.set(1, '未审核')
  mapType.set(2, '已审核')
  mapType.set(3, '进行中')
  mapType.set(4, '已完成')

  const dialogUploadFileEl = ref()
  const dialogUploadStyleEl = ref()
  const styleLibListEl = ref()

  const state: any = reactive({
    row: {},
    dialogType: true,
    dialogTableVisible: false,
    dialogTitle: '查看床次计划',
    statu: [
      { name: '未审核', value: '1' },
      { name: '已审核', value: '2' },
      { name: '进行中', value: '3' },
      { name: '已完成', value: '4' }
    ],

    queryFormData: {
      produceOrderCode: '',
      bedPlanNo: '',
      styleCode: '',
      statu: ''
    },

    dialogVisible: false,
    title: '上传',
    fileList: [],
    rowData: {},
    limit: 6
  })

  const handleAddOrUpdate = (row: any) => {
    //根据有无row判断点击新增或编辑按钮
  }

  const handleUploadStyle = () => {
    dialogUploadStyleEl.value.showDialog({
      action: '/njp-dsr-api/dsr/dsrstyle/importStyleBatch'
    })
  }

  const handleUploadFile = () => {
    dialogUploadFileEl.value.showDialog()
  }

  const refreshTable = () => {
    styleLibListEl.value.refreshTable()
  }

  //新增、编辑、查看
  const handleClick = (e: any, type: any, row: any) => {
    state.row = row
    state.dialogTitle = type
    state.dialogType = e
    state.dialogTableVisible = true
  }

  //关闭 弹窗
  const close = () => {
    state.dialogTableVisible = false
    refreshTable()
  }
</script>

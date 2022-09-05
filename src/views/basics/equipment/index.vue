<template>
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @on-add-update-handle="handleAddOrUpdate" @row-dblclick="handleRowDbclick">
    <template #queryFormItem>
      <el-form-item label="设备型号" prop="spec">
        <el-input v-model="state.queryFormData.spec" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="设备编号" prop="sn">
        <el-input v-model="state.queryFormData.sn" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="state.queryFormData.name" placeholder="请输入" clearable />
      </el-form-item>
    </template>

    <template #operationExtBtn>
      <el-button type="primary" style="order: 3" @click="handleClick(false, '新增设备', {})">新增</el-button>
      <el-button type="primary" style="order: 1" @click="handleUploadStyle">批量导入款式</el-button>
      <el-button type="primary" style="order: 2" @click="handleUploadFile">批量导入文件</el-button>
    </template>

    <template #img="{ row }">
      <ImgModular :img="row.img" />
    </template>

    <template #type="{ row }">
      <span> {{ equipment.get(row.type.toString()) }}</span>
    </template>

    <template #defaultParam="{ row }">
      <div class="defaultParam" @click="setDefaultParam(row)">{{ row.defaultParam }}</div>
      <!-- <el-icon class="proportionsLeft" :size="30"><Edit /></el-icon> -->
    </template>

    <template #actionExtBtn="{ row }">
      <el-button link type="primary" style="order: 3" @click="handleClick(true, '查看设备', row)">查看</el-button>
      <el-button link type="primary" style="order: 3" @click="handleClick(false, '编辑设备', row)">编辑</el-button>
    </template>
  </njp-table-config>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :close-on-click-modal="false" :title="state.dialogTitle" width="1000px">
    <DialogContent :row="state.data.row" :close="close" :dialog-type="state.dialogType" />
  </el-dialog>
  <!-- 表格修改 -->
  <el-dialog v-if="state.defaultParam.defaultParamType" v-model="state.defaultParam.defaultParamType" :close-on-click-modal="false" :title="state.defaultParam.Title" width="1000px">
    <DefaultParam :list="{}" :row="state.defaultParam.row" :type="false" :operation="operation" :form="state.defaultParam.form" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance, ref } from 'vue'
  import { equipment } from '@/components/conifgs.ts'
  import ImgModular from '@/components/imgModular/index.vue'

  import DialogContent from './modules/dialog-content.vue'
  import DefaultParam from './modules/dialog-forms.vue'

  const { proxy }: any = getCurrentInstance()
  const dialogUploadFileEl = ref()
  const dialogUploadStyleEl = ref()
  const styleLibListEl = ref()

  const state = reactive({
    dialogType: true,
    dialogTableVisible: false,
    dialogTitle: '查看床次计划',

    //默认参数弹窗
    defaultParam: {
      defaultParamType: false,
      row: {},
      Title: '铺布建议参数',
      form: { type: '1' }
    },

    // 查询数据
    queryFormData: {
      spec: '',
      sn: '',
      name: ''
    },
    data: {
      row: {}
    },

    dialogVisible: false,
    title: '上传',
    fileList: [],
    rowData: {},
    limit: 6
  })

  //刷新数据
  const refreshTable = () => {
    styleLibListEl.value.refreshTable()
  }

  const handleAddOrUpdate = (row: any) => {
    //根据有无row判断点击新增或编辑按钮
  }

  const handleRowDbclick = (row: any) => {
    toViewFun(row, 'opinionList')
  }

  const toViewFun = (row: any, type: any) => {
    proxy.$routerToView({
      path: `/style/create-style/view-create-style`,
      query: {
        _mt: `款式详情`,
        id: row.id,
        season: row.season,
        stage: row.stage,
        styleNo: row.styleNo,
        gender: row.gender,
        brand: row.brand,
        productType: row.productType,
        typeValue: type
      }
    })
  }

  const handleUploadStyle = () => {
    dialogUploadStyleEl.value.showDialog({
      action: '/njp-dsr-api/dsr/dsrstyle/importStyleBatch'
    })
  }

  const handleUploadFile = () => {
    dialogUploadFileEl.value.showDialog()
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

  // 修改默认参数
  const setDefaultParam = (row: any) => {
    state.defaultParam.row = row

    let type = row.type.toString()
    state.defaultParam.form.type = type

    if (type === '1') {
      state.defaultParam.Title = '铺布建议参数'
    }
    if (type === '3') {
      state.defaultParam.Title = '裁剪建议参数'
    }
    state.defaultParam.defaultParamType = true
  }

  //关闭弹窗-【默认参数】
  const operation = (e: any) => {
    if (e.type === 'cancel') {
      state.defaultParam.defaultParamType = false
    }
    if (e.type === 'confirm') {
      refreshTable()
      state.defaultParam.defaultParamType = false
    }
  }
</script>
<style>
  .defaultParam {
    cursor: pointer;
  }
</style>

<template>
  设备
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @on-add-update-handle="handleAddOrUpdate" @row-dblclick="handleRowDbclick">
    <template #queryFormItem>
      <el-form-item label="设备型号" prop="equipmentModel">
        <el-input v-model="state.queryFormData.equipmentModel" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="设备编号" prop="sn">
        <el-input v-model="state.queryFormData.sn" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input v-model="state.queryFormData.equipmentName" placeholder="请输入" clearable />
      </el-form-item>
    </template>

    <template #operationExtBtn>
      <el-button type="primary" style="order: 3" @click="handleClick(false, '新增设备', {})">新增</el-button>
      <el-button type="primary" style="order: 1" @click="handleUploadStyle">批量导入款式</el-button>
      <el-button type="primary" style="order: 2" @click="handleUploadFile">批量导入文件</el-button>
      <el-button type="danger" style="order: 3" @click="mov">删除</el-button>
    </template>

    <template #img="{ row }">
      <img :src="row.img" alt="主图" style="width: 75px; height: 75px" />
    </template>

    <template #type="{ row }">
      <span> {{ equipment.get(row.type.toString()) }}</span>
    </template>

    <template #defaultParam="{ row }">
      <div class="defaultParam" @click="setDefaultParam(row)">{{ row.defaultParam }}</div>
    </template>

    <template #actionExtBtn="{ row }">
      <el-button link type="primary" style="order: 3" @click="handleClick(true, '查看设备', row)">查看</el-button>
      <el-button link type="primary" style="order: 3" @click="handleClick(false, '编辑设备', row)">编辑</el-button>
    </template>
  </njp-table-config>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :title="state.dialogTitle" width="1000px">
    <DialogContent :row="state.data.row" :close="close" :dialog-type="state.dialogType" />
  </el-dialog>
  <!-- //默认参数 -->

  <el-dialog v-if="state.defaultParam.defaultParamType" v-model="state.defaultParam.defaultParamType" :title="state.defaultParamTitle" width="1000px">
    <PopModule :operation="operation" :type="state.defaultParam.type" :form="state.defaultParam.form" :list="state.defaultParam.list" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance, ref } from 'vue'
  // import { ElMessage } from 'element-plus'
  import DialogContent from './dialogContent/index.vue'
  import PopModule from './popModule/index.vue'
  import { equipment } from '@/components/conifgs.ts'

  const { proxy }: any = getCurrentInstance()
  const dialogUploadFileEl = ref()
  const dialogUploadStyleEl = ref()
  const styleLibListEl = ref()

  const state = reactive({
    dialogType: true,
    dialogTableVisible: false,
    dialogTitle: '查看床次计划',
    //默认参数
    defaultParam: {
      defaultParamType: false,
      defaultParamTitle: '铺布建议参数',
      form: { type: '3' },
      type: false,
      list: {}
    },

    // 查询数据
    queryFormData: {
      equipmentModel: '',
      sn: '',
      equipmentName: ''
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

  // const selectChange = (row: any) => {
  //   proxy.$baseService.put('/njp-dsr-api/dsr/dsrstyle/update', row).then(res => {
  //     if (res.code !== 0) return ElMessage.error(res.msg)
  //     refreshTable()
  //   })
  // }

  const handleRowDbclick = (row: any) => {
    toViewFun(row, 'opinionList')
  }

  // const toView = (row: any, type: any) => {
  //   toViewFun(row, type)
  // }

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

  //去打印通知单详情
  // const toViewSample = (row: any) => {
  //   proxy.$routerToView({
  //     path: `/style/create-sample/view-create-sample`,
  //     query: {
  //       _mt: `打样单详情`,
  //       styleNo: row.styleNo,
  //       stage: row.stage
  //     }
  //   })
  // }

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
  const mov = () => {
    // console.log('删除')
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
    // console.log(row.defaultParam)
    state.defaultParam.defaultParamType = true
  }
  const operation = (type: any, data: any) => {
    state.defaultParam.defaultParamType = false
    // console.log(type)
  }
</script>
<style>
  .defaultParam {
    cursor: pointer;
  }
</style>

<template>
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @on-add-update-handle="handleAddOrUpdate">
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
      <el-button type="primary" style="order: 3" @click="importMethod">导入</el-button>
      <!-- <el-button type="primary" style="order: 1" @click="handleUploadStyle"> 导入 </el-button> -->
      <!-- <el-button type="primary" style="order: 2" @click="handleUploadFile"> 批量导入文件 </el-button> -->
    </template>

    <template #img="{ row }">
      <ImgModular :img="row.img" />
    </template>

    <template #type="{ row }">
      <span> {{ row.type ? equipment.get(row.type.toString()) : null }}</span>
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

  <el-dialog :draggable="false" v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :close-on-click-modal="false" :title="state.dialogTitle" width="850px">
    <DialogContent :row="state.data.row" :close="close" :dialog-type="state.dialogType" />
  </el-dialog>
  <!-- 表格修改 -->
  <el-dialog :close-on-click-modal="false" :draggable="false" v-if="state.defaultParam.defaultParamType" v-model="state.defaultParam.defaultParamType"  :title="state.defaultParam.Title" width="500px">
    <DefaultParam :list="{}" :row="state.defaultParam.row" :type="false" :operation="operation" :form="state.defaultParam.form" />
  </el-dialog>
  <!-- 导出  -->
  <el-dialog :draggable="false" v-if="state.export.importType" v-model="state.export.importType" :close-on-click-modal="false" title="导入" width="400px">
    <ImportDialog :export="state.export" :get-list="getList"  :confirm="confirm"/>
    <template #footer>
      <el-button style="order: 3" @click="exportEvents(false)">取消</el-button>
      <el-button type="primary" style="order: 3" @click="exportEvents(true)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance, ref } from 'vue'
  import { ElMessage } from 'element-plus'

  import { equipment } from '@/components/conifgs.ts'
  import ImgModular from '@/components/imgModular/index.vue'
  import ImportDialog from '@/components/dialog-import-table/index.vue'

  import DialogContent from './modules/dialog-content.vue'
  import DefaultParam from './modules/dialog-forms.vue'
  import { exportData } from './modules/conifgs.ts'
  const { proxy }: any = getCurrentInstance()
  const styleLibListEl = ref()

  const state = reactive({
    //导出
    export: {
      type: 'equipment',
      data: exportData,
      importType: false,
      list: [], //导出数据
      template: 'http://10.18.4.25/template/device.xlsx',
      interface: '/jack-ics-api/device/import'
    },

    dialogType: true,
    dialogTableVisible: false,
    dialogTitle: '查看床次计划',

    //默认参数弹窗1
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
    state.defaultParam.defaultParamType = true
    }
    if (type === '3') {
      state.defaultParam.Title = '裁剪建议参数'
    state.defaultParam.defaultParamType = true
    }
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

  //------------------------------导出-------------------------------
  //打开弹窗-【导出】
  const importMethod = () => {
    state.export.importType = true
  }

  //获取导出数据
  const getList = (e: any) => {
    state.export.list = e
  } 

  const confirm=()=>{
    exportEvents(true)
  }
  //关闭弹窗-【导出】
  const exportEvents = (type: any) => {
    if (type === true) {
      let saveData = state.export.list

      let data: any = []

      saveData.forEach((item: any) => {
        data.push({
          image: item.image ? item.image : '',
          name: item.name,
          sn: item.sn,
          spec: item.spec,
          type: item.type.toString()
        })
      })
      proxy.$baseService.post('/jack-ics-api/device/saveBatch', { deviceExcelDTOList: data }).then((res: any) => {
        refreshTable()
        state.export.importType = false
        ElMessage({
          message: '导入成功',
          type: 'success'
        })
      })
    }
    if (type === false) {
      state.export.importType = false
    }
  }
</script>
<style>
  .defaultParam {
    cursor: pointer;
  }
</style>

<!--
 * @Author: lyj
 * @Date: 2022-08-31 13:11:11
 * @LastEditTime: 2022-09-15 11:51:32
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
      <el-button type="primary" style="order: 3" @click="handleClick(false, '新增面料')"> 新增 </el-button>
      <el-button type="primary" style="order: 3" @click="importMethod">导入</el-button>
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
  </njp-table-config>
  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :close-on-click-modal="false" :title="state.dialogTitle" width="800px">
    <DialogContent v-if="state.dialogTableVisible" :row="state.data.row" :close="close" :dialog-type="state.dialogType" />
  </el-dialog>

  <!-- 导出  -->
  <el-dialog v-if="state.export.importType" v-model="state.export.importType" :close-on-click-modal="false" title="导入" width="400px">
    <ImportDialog :export="state.export" :get-list="getList" />
    <template #footer>
      <el-button style="order: 3" @click="exportEvents(false)">取消</el-button>
      <el-button type="primary" style="order: 3" @click="exportEvents(true)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref ,getCurrentInstance} from 'vue'
  import { ElMessage } from 'element-plus'


  import ImgModular from '@/components/imgModular/index.vue'
  import DialogContent from './modules/dialog-content.vue'
  import ImportDialog from '@/components/dialog-import-table/index.vue'
  import  {exportData} from  "./modules/conifgs.ts"
  const { proxy }: any = getCurrentInstance()

  let mapType = new Map()
  mapType.set(1, '针织面料')
  mapType.set(2, '梭织面料')

  const styleLibListEl = ref()

  const state = reactive({
      //导出
    export: {
      type:"fabric",
      data:exportData,
      importType: false,
      list: [],//导出数据
      template: 'http://10.18.4.25/template/fabric.xlsx',
      interface: '/jack-ics-api/fabric/import'
    },

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

   //------------------------------导出-------------------------------
  //打开弹窗-【导出】
  const importMethod = () => {
    state.export.importType = true
  }

  //获取导出数据
  const getList = (e: any) => {
    state.export.list = e
  }

  //关闭弹窗-【导出】
  const exportEvents = (type: any) => {
    if (type === true) {
      let saveData = state.export.list

      let data: any = []

      saveData.forEach((item: any) => {
        data.push({
          color: item.color,
          image: item.image ? item.image : '',
          name: item.name,
          sn: item.sn,
          type: item.type,
          weight: item.weight
        })
      })
      proxy.$baseService.post('/jack-ics-api/fabric/saveBatch', { fabricExcelDTOList: data }).then((res: any) => {
        state.export.importType = false
          ElMessage({
          message: '添加成功',
          type: 'success'
        })
        refreshTable()

      })
    }
    if (type === false) {
      state.export.importType = false
    }
  }
</script>

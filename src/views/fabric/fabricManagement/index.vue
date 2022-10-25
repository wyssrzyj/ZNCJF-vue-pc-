<!--
 * @Author: lyj
 * @Date: 2022-08-31 13:11:11
 * @LastEditTime: 2022-10-25 10:41:32
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @selection-change="handleSelectionChange" @on-add-update-handle="handleAddOrUpdate" @row-dblclick="handleRowDbclick">
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
      <el-button type="danger" style="order: 3" @click="mov">删除</el-button>
    </template>

    <template #img="{ row }">
      <ImgModular :img="row.img" />
    </template>

    <template #type="{ row }">
      {{ fabric.get(row.type.toString() ) }}
    </template>

    <template #actionExtBtn="{ row }">
      <el-button link type="primary" style="order: 3" @click="handleClick(true, '查看面料管理', row)">查看</el-button>
      <el-button link type="primary" style="order: 3" @click="handleClick(false, '编辑面料管理', row)">编辑</el-button>
    </template>
  </njp-table-config>

  <!-- 删除 -->
  <el-dialog v-model="state.dialogVisible" title="提示" width="30%" :before-close="handleClose">
    <span>确定要删除该数据吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :draggable="false" :close-on-click-modal="false" :title="state.dialogTitle" width="750px">
    <DialogContent v-if="state.dialogTableVisible" :row="state.data.row" :close="close" :dialog-type="state.dialogType" />
  </el-dialog>

  <!-- 导出  -->
  <el-dialog v-if="state.export.importType" v-model="state.export.importType" :draggable="false" :close-on-click-modal="false" title="导入" width="400px">
    <ImportDialog :export="state.export" :get-list="getList" :confirm="confirm" />
    <template #footer>
      <el-button style="order: 3" @click="exportEvents(false)">取消</el-button>
      <el-button type="primary" style="order: 3" @click="exportEvents(true)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import { isEmpty } from 'lodash'
    import { fabric } from '@/components/conifgs.ts'
  import ImportDialog from '@/components/dialog-import-table/index.vue'
  import ImgModular from '@/components/imgModular/index.vue'
  import DialogContent from './modules/dialog-content.vue'
  import { exportData } from './modules/conifgs.ts'
  const { proxy }: any = getCurrentInstance()



  const styleLibListEl = ref()

  const state = reactive({
    dialogVisible: false,
    ids: [],
    //导出
    export: {
      type: 'fabric',
      data: exportData,
      width: '800px',
      importType: false,
      list: [], //导出数据
      // template: 'http://192.168.99.184/template/fabric.xlsx',
      template: '/template/面料管理模板.xlsx',//引入的是V1的

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

  const confirm = () => {
    exportEvents(true)
  }

  //关闭弹窗-【导出】
  const exportEvents = (type: any) => {
    if (type === true) {
      let saveData = state.export.list

      let data: any = []

      saveData.forEach((item: any) => {
        data.push({
          color: item.color,
          primaryFlag: item.primaryFlag,
          image: !isEmpty(item.styleUrlList) ? item.styleUrlList[0].url : null, //款图
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

  //选中id
  const handleSelectionChange = (val: any) => {
    if (!isEmpty(val)) {
      let ids: any = []
      val.map((item: any) => {
        ids.push(item.id)
      })
      state.ids = ids
    }
  }
  //删除
  const mov = () => {
    if (!isEmpty(state.ids)) {
      state.dialogVisible = true
    } else {
      ElMessage({
        message: '至少选择一个',
        type: 'warning'
      })
    }
  }
  const confirmDelete = () => {
    proxy.$baseService.delete('/jack-ics-api/fabric/delete', state.ids).then((res: any) => {
      if (res.code === 0) {
        state.ids = [] //清空选中项
        ElMessage({
          message: '删除成功',
          type: 'success'
        })
        state.dialogVisible = false
        refreshTable()
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
</script>

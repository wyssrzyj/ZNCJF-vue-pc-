<template>
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @selection-change="handleSelectionChange">
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
      <el-button type="danger" style="order: 3" @click="mov">删除</el-button>
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
  <!-- 删除 -->
  <el-dialog v-model="state.dialogVisible" title="提示" width="30%">
    <span>确定要删除该数据吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :draggable="false" :close-on-click-modal="false" :title="state.dialogTitle" width="850px">
    <DialogContent :row="state.data.row" :close="close" :dialog-type="state.dialogType" />
  </el-dialog>
  <!-- 表格修改 -->
  <el-dialog v-if="state.defaultParam.defaultParamType" v-model="state.defaultParam.defaultParamType" :close-on-click-modal="false" :draggable="false" :title="state.defaultParam.Title" width="500px">
    <DefaultParam :list="{}" :row="state.defaultParam.row" :type="false" :operation="operation" :form="state.defaultParam.form" />
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
  import { reactive, getCurrentInstance, ref, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import { isEmpty } from 'lodash'
  import { equipment } from '@/components/conifgs'
  import ImgModular from '@/components/imgModular/index.vue'
  import ImportDialog from '@/components/dialog-import-table/index.vue'
  import DialogContent from './modules/dialog-content.vue'
  import DefaultParam from './modules/dialog-forms.vue'
  import { exportData } from './modules/conifgs'
  const { proxy }: any = getCurrentInstance()
  const styleLibListEl = ref()
  const state = reactive({
    dialogVisible: false,
    ids: [],
    //导出
    export: {
      type: 'equipment',
      data: exportData,
      width: '800px',
      importType: false,
      list: [], //导出数据
      // template: 'http://192.168.99.184/template/device.xlsx',
      template: '/template/设备管理模板.xlsx', //引入的是V1的
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
      // refreshTable()
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
          image: !isEmpty(item.styleUrlList) ? item.styleUrlList[0].url : null, //款图
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

  // const downloadTemplate = () => {
  //   let a = document.createElement('a')
  //   a.setAttribute('download', '')
  //   a.href = 'http://localhost:9000/static/lyj.xlsx'
  //   console.log(a.href)
  //   // a.download;
  //   // a.style.display = "none";
  //   // document.body.appendChild(a);
  //   a.click()
  //   // a.remove();
  // }

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
    proxy.$baseService.delete('/jack-ics-api/device/delete', state.ids).then((res: any) => {
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
</script>
<style>
  .defaultParam {
    cursor: pointer;
  }
</style>

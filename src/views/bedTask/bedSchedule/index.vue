<template>
  <njp-table-config ref="styleLibListEl" @selection-change="handleSelectionChange" :query-form-data="state.queryFormData" @row-dblclick="handleRowDbclick">
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
      <el-button type="primary" style="order: 3" @click="handleClick(false, '新增床次计划')">新增</el-button>
      <el-button type="primary" style="order: 3" @click="importMethod">导入</el-button>
      <el-button type="success" style="order: 3" @click="examine">审核</el-button>
    </template>

    <template #styleImage="{ row }">
      <ImgModular :img="row.styleImage" />
    </template>
    <template #statu="{ row }">
       <el-tag v-if="row.statu" class="ml-2" :type="tagType.get(row.statu)">  {{ mapType.get(row.statu) }}</el-tag>
    </template>

    <template #actionExtBtn="{ row }">
      <el-button link type="primary" style="order: 3" @click="handleClick(true, '查看设备', row)">查看</el-button>
      <el-button v-if="row.statu!==2" link type="primary" style="order: 3" @click="handleClick(false, '编辑设备', row)">编辑</el-button>
    </template>
  </njp-table-config>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :title="state.dialogTitle" width="1000px">
    <DialogContent :row="state.row" :close="close" :dialog-type="state.dialogType" />
  </el-dialog>
  <!-- 导出  -->
  <el-dialog v-if="state.export.importType" v-model="state.export.importType" :close-on-click-modal="false" title="导入" width="400px">
    <ImportDialog :type="'bedSchedule'" :export="state.export" :get-list="getList" :confirm="confirm" />
    <template #footer>
      <el-button style="order: 3" @click="exportEvents(false)">取消</el-button>
      <el-button type="primary" style="order: 3" @click="exportEvents(true)">确认</el-button>
    </template>
  </el-dialog>
  <!-- 打印拉布单 -->
  <el-dialog v-if="state.printType" v-model="state.printType" :close-on-click-modal="false" title="打印拉布单" width="1000px">
    <Print />
    <template #footer>
      <el-button style="order: 3" @click="printingMethod(false)">取消</el-button>
      <el-button type="primary" style="order: 3" @click="printingMethod(true)">确认</el-button>
    </template>
  </el-dialog>

  <!-- 打印工单 -->
  <el-dialog v-if="state.workType" v-model="state.workType" :close-on-click-modal="false" title="打印工单" width="1000px">
    <Work :id="'1567443329765433346'" />
    <template #footer>
      <el-button style="order: 3" @click="setWrkType(false)">取消</el-button>
      <el-button type="primary" style="order: 3" @click="setWrkType(true)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref,getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import { isEmpty } from 'lodash'

  import { mapType ,tagType} from '@/components/conifgs.ts'
  import ImgModular from '@/components/imgModular/index.vue'
  import ImportDialog from '@/components/dialog-import-table/index.vue'
  import DialogContent from './modules/dialog-content.vue'
  import { exportData } from './modules/conifgs.ts'
  const { proxy } = getCurrentInstance()






  const styleLibListEl = ref()

  const state: any = reactive({
    //导出
    export: {
      type: '',
      data: exportData,
      importType: false,
      list: [],
      template: 'http://10.18.4.25/template/bedPlan.xlsx',
      interface: '/jack-ics-api/bedPlan/import'
    },
    //打印状态
    printType: false,
    workType: false,

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
    limit: 6,
    ids:[]
  })

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

   const examine = () => {
    if (!isEmpty(state.ids)) {
      proxy.$baseService.post('/jack-ics-api/bedPlan/audit', { idList: Object.values(state.ids) }).then((res: any) => {
        if (res.code === 0) {
          ElMessage({
            message: '审核成功',
            type: 'success'
          })
          refreshTable()
        }
      })
    } else {
      ElMessage({
        message: '至少选择一个',
        type: 'warning'
      })
    }
  }

  //关闭 弹窗
  const close = () => {
    state.dialogTableVisible = false
    refreshTable()
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
      refreshTable()
      state.export.importType = false
      ElMessage({
        message: '添加成功',
        type: 'success'
      })
    }
    if (type === false) {
      state.export.importType = false
    }
  }


    const handleSelectionChange = (val: any) => {
    if (!isEmpty(val)) {
      let ids: any = []
      val.map((item: any) => {
        ids.push(item.id)
      })
      state.ids = ids
    }
  }

  // ---------------------------------
  // -------------------打印---------------------------------
  const printingMethod = (type: any) => {
    state.printType = type
  }
  const setWrkType = (type: any) => {
    state.workType = type
  }
</script>

<!-- eslint-disable prettier/prettier -->
<template>
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @on-add-update-handle="handleAddOrUpdate" @selection-change="handleSelectionChange">
    <template #queryFormItem>
      <el-form-item label="生产订单" prop="produceOrderCode">
        <el-input v-model="state.queryFormData.produceOrderCode" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="床次计划号" prop="bedPlanNo">
        <el-input v-model="state.queryFormData.bedPlanNo" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="款式编号" prop="taskCode">
        <el-input v-model="state.queryFormData.taskCode" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="statu">
        <el-select v-model="state.queryFormData.statu" clearable filterable>
          <el-option v-for="item in state.statu" :key="item.name" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
    </template>

    <template #operationExtBtn>
      <el-button type="primary" style="order: 3" @click="handleClick(false, '新增铺布')">新增</el-button>
      <el-button type="primary" style="order: 3" @click="examine">审核</el-button>
    </template>

    <template #styleImage="{ row }">
      <ImgModular :img="row.styleImage" />
    </template>
    <template #statu="{ row }">
       <el-tag v-if="row.statu" class="ml-2" :type="tagType.get(row.statu)">  {{ mapType.get(row.statu ) }}</el-tag>
    </template>

    <template #actionExtBtn="{ row }">
      <el-button link type="primary" style="order: 3" @click="handleClick(true, '查看铺布', row)">查看</el-button>
      <el-button  v-if="row.statu !== 2" link type="primary" style="order: 3" @click="handleClick(false, '编辑铺布', row)">编辑</el-button>
      <el-button v-if="row.statu === 2" link type="primary" style="order: 3" @click="setPrint(row)">打印</el-button>
    </template>

    <el-dialog  :close-on-click-modal="false" :draggable="false" v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :title="state.dialogTitle" width="1100px" hei>
      <DialogContent :type="state.dialogType" :row="state.row" :close="close" :dialog-type="state.dialogType" />
    </el-dialog>
  </njp-table-config>

  <div  style="height: 0; overflow: hidden">
    <Print  :id="state.printId" />
  </div>
</template>

<script lang="ts" setup>
  import print from 'print-js'
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { isEmpty } from 'lodash'
  import { ElMessage } from 'element-plus'

  import { tagType,mapType} from '@/components/conifgs.ts'
  import ImgModular from '@/components/imgModular/index.vue'
  import DialogContent from './modules/dialog-content.vue'
  import Print from './modules/dialog-print.vue'
  const { proxy } = getCurrentInstance()



  const styleLibListEl = ref()


  const state: any = reactive({
    row: {},
    dialogType: true,
    dialogTableVisible: false,
    dialogTitle: '查看铺布',
    statu: [
      { name: '未审核', value: 1 },
      { name: '已审核', value: 2 },
      { name: '进行中', value: 3 },
      { name: '已完成', value: 4 }
    ],

    queryFormData: {
      produceOrderCode: '',
      bedPlanNo: '',
      taskCode: '',
      statu: ''
    },

    dialogVisible: false,
    title: '上传',
    fileList: [],
    rowData: {},
    limit: 6,
    printType: false,
    printId: '',
    ids: [] //选中id
  })
  const refreshTable = () => {
    styleLibListEl.value.refreshTable()
  }

  const examine = () => {
    if (!isEmpty(state.ids)) {
      proxy.$baseService.post('/jack-ics-api/spreadTask/audit', { idList: Object.values(state.ids) }).then((res: any) => {
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
  const setPrint = (row: any) => {
    try {
      if (row.statu === 2) {
        state.printId = row.id
        state.printType = true
        print({
          printable: 'print',
          type: 'html',
          targetStyles: ['*'],
          maxWidth: 5000
        })
      }
    } catch (error) {
    }

    //添加状态
  }

  const handleAddOrUpdate = (row: any) => {
    //根据有无row判断点击新增或编辑按钮
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

<template>
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @on-add-update-handle="handleAddOrUpdate">
    <template #queryFormItem>
      <el-form-item label="款号" prop="styleCode">
        <el-input v-model="state.queryFormData.styleCode" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="床次" prop="bedPlanNo">
        <el-input v-model="state.queryFormData.bedPlanNo" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="贴标任务号" prop="taskCode">
        <el-input v-model="state.queryFormData.taskCode" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="资源名称" prop="deviceName">
        <el-input v-model="state.queryFormData.deviceName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="statu">
        <el-select v-model="state.queryFormData.statu" clearable filterable>
          <el-option v-for="item in state.statu" :key="item.name" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
    </template>

    <template #styleImage="{ row }">
      <ImgModular :img="row.styleImage" />
    </template>
    <template #statu="{ row }">
      <el-tag v-if="row.statu" class="ml-2" :type="tagType.get(row.statu)"> {{ mapType.get(row.statu) }}</el-tag>
    </template>

    <template #actionExtBtn="{ row }">
      <el-button link type="primary" style="order: 3" @click="handleClick(row, true)">查看</el-button>
      <el-button v-if="row.statu === 2" link type="primary" style="order: 3" @click="handleClick(row, false)">编辑</el-button>
    </template>
  </njp-table-config>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import ImgModular from '@/components/imgModular/index.vue'
  import { tagType ,mapType} from '@/components/conifgs'
  const { proxy }: any = getCurrentInstance()



  const styleLibListEl = ref()

  const state: any = reactive({
    row: {},
    dialogType: true,
    dialogTableVisible: false,
    dialogTitle: '查看床次计划',
    statu: [
      { name: '待执行', value: '2' },
      { name: '进行中', value: '3' },
      { name: '已完成', value: '4' }
    ],

    queryFormData: {
      bedPlanNo: '',
      taskCode: '',
      deviceName: '',
      statu: '',
      styleCode: ''
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

  //新增、编辑、查看
  const handleClick = (row: any, type: any) => {
    state.row = row
    toViewFun(row, type)
  }

  //跳转详情
  const toViewFun = (row: any, type: any) => {
    proxy.$routerToView({
      path: `/cuttingManagement/label/view-dialog-content`,
      query: {
        _mt: `贴标任务详情`,
        id: row.id,
        bedPlanId: row.bedPlanId,
        deviceId: row.deviceId,
        typeValue: type
      }
    })
  }
</script>

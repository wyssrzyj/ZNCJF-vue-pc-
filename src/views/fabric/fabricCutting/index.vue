<!--
 * @Author: lyj
 * @Date: 2022-08-31 13:11:11
 * @LastEditTime: 2023-02-04 14:53:55
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @selection-change="handleSelectionChange" @on-add-update-handle="handleAddOrUpdate">
    <template #queryFormItem>
      <el-form-item label="参数模板编号" prop="sn">
        <el-input v-model="state.queryFormData.sn" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="参数模板名称" prop="name">
        <el-input v-model="state.queryFormData.name" placeholder="请输入" clearable />
      </el-form-item>
    </template>

    <template #operationExtBtn>
      <el-button type="primary" style="order: 3" @click="handleClick(false, '新增裁剪模版', {})">新增</el-button>
      <el-button type="danger" style="order: 3" @click="mov">删除</el-button>
    </template>

    <template #imageUrl="{ row }">
      <ImgModular :img="row.imageUrl" />
    </template>

    <template #fabricType="{ row }">
      <span> {{ fabric.get(row.fabricType.toString()) }}</span>
    </template>
    <template #fabricWeight="{ row }">
      <span> {{ row.fabricWeightMin }}~{{ row.fabricWeightMax }}</span>
    </template>
    <template #knifeSpeed="{ row }">
      <span> {{ row.knifeSpeedMin }}~{{ row.knifeSpeedMax }}</span>
    </template>

    <template #minKnifeFrequency="{ row }">
      <span> {{ row.minKnifeFrequencyMin }}~{{ row.minKnifeFrequencyMax }}</span>
    </template>
    <template #maxKnifeFrequency="{ row }">
      <span> {{ row.maxKnifeFrequencyMin }}~{{ row.maxKnifeFrequencyMax }}</span>
    </template>
    <template #minKnifeDistance="{ row }">
      <span> {{ row.minKnifeDistanceMin }}~{{ row.minKnifeFrequencyMax }}</span>
    </template>
    <template #knifeAngle="{ row }">
      <span> {{ row.knifeAngleMin }}~{{ row.knifeAngleMax }}</span>
    </template>
    <template #emptyRatio="{ row }">
      <span> {{ row.emptyRatioMin }}~{{ row.emptyRatioMax }}</span>
    </template>
    <template #relationFabricName="{ row }">
      <span> {{ row.relationFabricName }}</span>
    </template>

    <template #actionExtBtn="{ row }">
      <el-button link type="primary" style="order: 3" @click="handleClick(true, '查看裁剪模板', row)">查看</el-button>
      <el-button link type="primary" style="order: 3" @click="handleClick(false, '编辑裁剪模板', row)">编辑</el-button>
    </template>

    <el-dialog v-model="state.dialogTableVisible" :draggable="false" :close-on-click-modal="false" :title="state.dialogTitle" width="1100px">
      <DialogContent v-if="state.dialogTableVisible" :row="state.data.row" :close="close" :dialog-type="state.dialogType" />
    </el-dialog>
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
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { fabric } from '@/components/conifgs'
  import { ElMessage } from 'element-plus'
  import { isEmpty } from 'lodash'
  import ImgModular from '@/components/imgModular/index.vue'

  import DialogContent from './modules/dialog-content.vue'
  const { proxy } = getCurrentInstance() as any
  const styleLibListEl = ref()
  const state = reactive({
    dialogVisibleMov: false, //删除
    ids: [], //选中id

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
  //清空选中项
  const onFormQuery = (params = {}) => {
    styleLibListEl.value.onFormQuery()
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
    state.data.row = {}
    if (type == 'preservation') {
      state.dialogTableVisible = false
      refreshTable()
    } else {
      state.dialogTableVisible = false
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
    proxy.$baseService.delete('/jack-ics-api/cutTemplateParam/delete', state.ids).then((res: any) => {
      if (res.code === 0) {
        state.ids = [] //清空选中项
        onFormQuery()
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

<template>
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @selection-change="handleSelectionChange">
    <template #queryFormItem>
      <el-form-item label="班次名称" prop="spec">
        <el-input v-model="state.queryFormData.name" placeholder="请输入" clearable />
      </el-form-item>
    </template>

    <template #operationExtBtn>
      <el-button type="primary" style="order: 3" @click="handleClick(false, '班次管理新增', {})">新增</el-button>
      <el-button type="danger" style="order: 3" @click="mov">删除</el-button>
    </template>

    <template #actionExtBtn="{ row }">
      <el-button link type="primary" style="order: 3" @click="handleClick(false, '班次管理修改', row)">编辑</el-button>
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

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :draggable="false" :close-on-click-modal="false" :title="state.dialogTitle" width="700px">
    <DialogContent :row="state.data.row" :close="close" :dialog-type="state.dialogType" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { isEmpty } from 'lodash'
  import DialogContent from './modules/dialog-content.vue'
  const { proxy }: any = getCurrentInstance()
  const styleLibListEl = ref()
  const state = reactive({
    dialogVisible: false,
    ids: [],
    dialogType: true,
    dialogTableVisible: false,
    dialogTitle: '查看',
    // 查询数据
    queryFormData: {
      name: ''
    },
    data: {
      row: {}
    }
  })

  //刷新数据
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
    if (type == 'preservation') {
      state.dialogTableVisible = false
      refreshTable()
    } else {
      state.dialogTableVisible = false
    }
  }

  //删除..
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
    proxy.$baseService.delete('/jack-ics-api/teamSchedule/delete', state.ids).then((res: any) => {
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

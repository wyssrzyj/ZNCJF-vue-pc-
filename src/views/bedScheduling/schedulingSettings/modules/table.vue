<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-03-10 15:41:39
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="table">
    <el-table
      ref="singleTableRef"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      :data="state.tableData"
      :height="350"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column property="styleBedNo" label="床次" />
      <el-table-column property="fabricName" label="面料" />
      <el-table-column property="primaryFlag" label="主料/辅料">
        <template #default="{ row }">
          <span>{{ row.primaryFlag === 1 ? '主料' : '辅料' }}</span>
        </template>
      </el-table-column>

      <el-table-column property="spreadClothLevel" label="计划层数" />
      <el-table-column property="bedSum" label="计划件数" />

      <el-table-column property="customName" label="排唛比例">
        <template #default="{ row }">
          <img :src="edit" alt="" class="schedulingSettings-edit" @click="shippingMarks(row)" />
        </template>
      </el-table-column>
      <el-table-column property="startDate" label="计划开始时间" />
      <el-table-column property="endDate" label="计划结束时间" />
      <el-table-column property="customName" label="铺布任务">
        <template #default="scope">
          <div class="tableContainer">
            <div class="check-customName">
              <div class="innerCircle"></div>
            </div>
            <div :class="scope.row.cloth === true ? 'progress-customName' : 'progress-customName-no'"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="cloth" label="贴标任务">
        <template #default="scope">
          <div class="tableContainer">
            <div :class="scope.row.cloth === true ? 'progress' : 'progress-no'"></div>
            <div :class="scope.row.cloth === true ? 'check' : 'unchecked'">
              <div v-if="scope.row.cloth === true" class="innerCircle"></div>
            </div>
            <div :class="scope.row.labeling === true || scope.row.cropping === true ? 'progress' : 'progress-no'"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="labeling" label="裁剪任务">
        <template #default="scope">
          <div class="tableContainer">
            <div :class="scope.row.labeling === true ? 'progress-cropping' : 'progress-cropping-no'"></div>
            <div :class="scope.row.labeling === true ? 'check-cropping' : 'check-cropping-no'">
              <div v-if="scope.row.labeling === true" class="innerCircle"></div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 排唛比例 -->
  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :close-on-click-modal="false" :draggable="false" title="排唛比例" width="1200px">
    <PopModule :type="true" :operation="operation" :form="state.form" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance, watch } from 'vue'
  import { isEmpty } from 'lodash'
  import moment from 'moment'

  import edit from '@/components/icon/edit.png'
  import PopModule from './dialog-forms.vue'

  import './table.less'

  const props = defineProps<{
    row: any
  }>()

  const { proxy } = getCurrentInstance() as any

  const state: any = reactive({
    tableData: [],
    dialogTableVisible: false,
    form: {} //排麦比例需要的数据
  })

  const init = (e: any) => {
    let data = { styleCode: e.style.styleCode }

    proxy.$baseService.get('/jack-ics-api/productionScheduling/listBedProgress', { ...data }).then((res: any) => {
      if (!isEmpty(res.data)) {
        state.total = res.data
        //添加任务状态
        let list = res.data

        if (!isEmpty(list)) {
          list.map((item: any) => {
            // 尾部样式处理
            if (item.finishList) {
              item.finishList = item.finishList.split(',')

              if (item.finishList.includes('1')) {
                item.cloth = true
              }
              if (item.finishList.includes('2')) {
                item.labeling = true
              }
            }
            //时间处理
            if (item.startDate) {
              item.startDate = moment(item.startDate).format('HH:mm:ss')
              item.endDate = moment(item.endDate).format('HH:mm:ss')
            }
          })
        }

        state.tableData = list
      }
    })
  }

  watch(
    () => props.row,
    item => {
      init(item)
    }
  )

  //弹窗展示
  const shippingMarks = (e: any) => {
    proxy.$baseService.get('/jack-ics-api/bedPlan/get', { id: e.id }).then((res: any) => {
      state.form = res.data
      state.dialogTableVisible = true
    })
  }
  //弹窗事件
  const operation = (e: any) => {
    if (e.type === 'cancel') {
      state.dialogTableVisible = false
    }
    if (e.type === 'confirm') {
        state.dialogTableVisible = false
   
    }
  }



 
</script>
<style lang="less" scoped>
  /deep/ .el-input__inner {
    text-align: left !important; //输入框左对齐
  }

  .table {
    width: 66vw;
  }
</style>

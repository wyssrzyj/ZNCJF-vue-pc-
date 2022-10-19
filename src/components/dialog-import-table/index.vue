<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2022-10-13 14:27:22
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="importContainer">
    <div>
      <el-button type="primary" style="order: 3" @click="download">模板下载</el-button>
    </div>
    <div class="import">
      <UploadModule :get-data="getData" :disabled="false" :type="'import'" :interface="props.export.interface" />
    </div>
  </div>

  <!-- 表格 -->
  <div v-if="props.export.type !== ''">
    <el-dialog v-if="state.importType" v-model="state.importType" :draggable="false" :close-on-click-modal="false" title="导入" :width="props.export.width">
      <DialogTable v-if="state.importType" :type="props.export.type" :data="props.export.data" :form="state.fileList" :get-table-data="getTableData" />
      <template #footer>
        <el-button style="order: 3" @click="cancel()">取消</el-button>
        <el-button type="primary" style="order: 3" @click="exportEvents(false)">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import UploadModule from '@/components/upload/index.vue'
  import DialogTable from './dialog-table.vue'
  import { isEmpty, cloneDeep } from 'lodash'

  const props = defineProps<{
    type: any
    getList: any
    export: any
    confirm: any
  }>()

  const state: any = reactive({
    importType: false,
    fileList: [], //表格数据
    saveData: [] //表格更新数据 用于保存判断
  })

  const getData = (e: any) => {
    state.fileList = [e.data]
    if (!isEmpty(e.data)) {
      state.importType = true
    } else {
      ElMessage({
        message: '导入失败',
        type: 'warning'
      })
    }
  }

  const download = () => {
    ownLoad(props.export.template)
  }

  const ownLoad = (data: any) => {
    if (!data) {
      return
    }
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = data
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  //传递给父级
  const getTableData = (e: any) => {
    state.saveData = e
    props.getList(e)
  }

  const cancel = () => {
    state.importType = false
    state.fileList = cloneDeep([])
  }
  //关闭弹窗
  const exportEvents = (type: any) => {
    // if()
    if (!isEmpty(state.saveData)) {
      let allMeet = false

      //设备
      if (props.export.type === 'equipment' ) {
        let equipmentType = state.saveData.every((item: any) => {
          return item.sn !== '' && item.spec !== '' && item.name !== '' && item.type !== ''
        })
        allMeet = equipmentType
      }

      // 面料
       if ( props.export.type === 'fabric') {
        console.log(state.saveData);

        let equipmentType = state.saveData.every((item: any) => {
          return item.sn !== ''  && item.name !== '' && item.type !== ''&& item.primaryFlag !== ''&& item.primaryFlag !== null
        })
        allMeet = equipmentType
      }

      //床次
      if (props.export.type === 'bedSchedule') {
        let equipmentType = state.saveData.every((item: any) => {
          return (
            item.styleCode !== '' &&
            item.styleName !== '' &&
            item.produceOrderCode !== '' &&
            item.spreadClothLevel !== '' &&
            item.fabricCode !== '' &&
            item.fabricName !== '' &&
            item.fabricColor !== '' &&
            item.spreadClothLevel !== '' &&
            !isEmpty(item.shelfImageList) &&
            item.shelfScale !== ''
          )
        })
        allMeet = equipmentType
      }

      if (allMeet) {
        state.importType = type
        props.confirm()
      } else {
        ElMessage({
          message: '必填项不可为空',
          type: 'warning'
        })
      }
    }
  }
</script>
<style>
  .importContainer {
    display: flex;
  }
  .import {
    width: 100px;
    height: 35px;
    overflow: hidden;
    display: flex;
  }
</style>

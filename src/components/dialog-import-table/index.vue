<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2022-09-15 11:49:09
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
    <el-dialog v-if="state.importType" v-model="state.importType" :close-on-click-modal="false" title="导入" width="800px">
      <DialogTable :type="props.export.type" :data="props.export.data" :form="state.fileList" :get-table-data="getTableData" />
      <template #footer>
        <el-button style="order: 3" @click="exportEvents(false)">取消</el-button>
        <el-button type="primary" style="order: 3" @click="exportEvents(false)">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import UploadModule from '@/components/dialog-upload.vue'
  import DialogTable from './dialog-table.vue'

  const props = defineProps<{
    getList: any
    export: any
  }>()

  const state: any = reactive({
    importType: false,
    fileList: [] //表格数据
  })

  const getData = (e: any) => {
    state.fileList = e.data
    state.importType = true
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
    
    props.getList(e)
  }

  //关闭弹窗
  const exportEvents = (type: any) => {
    state.importType = type
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

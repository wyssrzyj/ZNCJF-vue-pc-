<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-09-23 17:26:44
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-table
    ref="table"
    height="300"
    style="width: 100%"
    :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }"
    :data="state.tableData"
    border
    stripe
    @selection-change="handleSelectionChange"
  >
    <el-table-column v-for="(item, index) in state.data" :key="index" :prop="item.prop" :label="item.label">
      <!-- 图片  -->
      <template v-if="item.type === 'img'" #default="{ row }">
        <div @click="showUploadDialog(row, 'styleUrlList')">
          <img
            v-if="row.styleUrlList && row.styleUrlList.length"
            class="tableImg"
            :src="find(row.styleUrlList, { topic: 1 }) ? find(row.styleUrlList, { topic: 1 }).url : row.styleUrlList[0].url"
            alt="主图"
            style="width: 75px; height: 75px"
          />
          <njp-upload-placeholder-icon v-else />
        </div>
      </template>

      <!-- 其他 -->
      <template v-if="item.type == null" #default="{ row }">
        <el-input v-model="row[item.prop]" type="text" />
      </template>
      <!-- 类型 -->
      <template v-if="item.type === 'type'" #default="{ row }">
        <!-- 设备  -->
        <div v-if="props.type === 'equipment'">
          <el-select v-model="row.type">
            <el-option v-for="item in state.equipmentType" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>
        
        <!-- 面料 -->
        <div v-if="props.type === 'fabric'">
            <el-select v-model="row.type" >
                <el-option v-for="item in state.fabricType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>

          <!-- {{ row.type ? fabric.get(row.type) : null }} -->
        </div>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="操作" width="120">
      <template #default="{ row }">
        <el-popconfirm title="是否删除?" @confirm="selectedChange(row)">
          <template #reference>
            <el-button link type="primary" size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="state.dialogVisible" :title="state.title" width="980px" :draggable="false">
    <ImagesV1 v-if="state.dialogVisible" v-model="state.fileList" :limit="state.limit" />
    <template #footer>
      <el-button @click="state.dialogVisible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="handleImageUpload">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue'
  import ImagesV1 from '@/components/njp-upload-images-v1.vue'
  import { find, isEmpty, cloneDeep } from 'lodash'
  import { equipmentType ,fabricType} from '@/components/conifgs.ts'

  const table: any = ref()

  const props = defineProps<{
    type: any
    data: any
    getTableData: any
    form: any
  }>()

  const state: any = reactive({
    data: props.data,
    tableData: [],
    equipmentType: equipmentType,
    fabricType: fabricType,
    //
    dialogVisible: false,
    title: '上传',
    fileList: [],
    rowData: {},
    limit: 6
  })

  //处理格式
  const setFormat = (data: any) => {
    let sum: any = []
    if (!isEmpty(data)) {
      data.forEach((item: any) => {
        if (!isEmpty(item.response)) {
          sum.push(item.response.data)
        }
      })
    }
    let arr = sum.flat(Infinity)
    //处理图片回显
    arr.map((item: any, index: any) => {
      item.only = index
      item.type = item.type.toString()
      item.styleUrlList = item.image !== null ? [{ url: item.image }] : [] //图片组件
    })
    console.log(arr)

    return arr
  }

  const init = () => {
    state.tableData = setFormat(props.form)
    props.getTableData(state.tableData)
  }

  init()

  //监听变化
  watch(
    () => props.form,
    item => {
      state.tableData = setFormat(item)
    }
  )

  const showUploadDialog = (row: any, type: any) => {
    state.dialogVisible = true
    state.title = '上传图片'
    state.limit = 1 //数量
    state.rowData = row
    state.fileList = row[type] || []
  }

  //替换数据
  const updateData = (record: any, list: any) => {
    const sum = cloneDeep(list)
    const subscript = sum.findIndex((item: any) => item.only === record.only)
    if (subscript !== -1) {
      sum.splice(subscript, 1, record)
      return sum
    }
  }

  //保存
  const handleImageUpload = () => {
    state.dialogVisible = false
    let rowData = cloneDeep(state.rowData)
    rowData.styleUrlList = state.fileList //组件需要格式

    rowData.image = state.fileList[0].url //后端需要格式

    let list = cloneDeep(state.tableData)
    //**赋值**
    state.tableData = updateData(rowData, list)
  }

  //删除
  const selectedChange = (e: any) => {
    let rowData = cloneDeep(state.tableData)
    state.tableData = rowData.filter((item: any) => item.only !== e.only)
  }

  //监听数据变化 返回给父级
  watch(
    () => state.tableData,
    item => {
      props.getTableData(item)
    }
  )
</script>

<style>
  .el-table__header-wrapper .el-checkbox {
    display: none;
  }
  .image {
    width: 100px;
    height: 100px;
    padding: 10px;
  }
  .tableImg {
    cursor: pointer;
  }
</style>

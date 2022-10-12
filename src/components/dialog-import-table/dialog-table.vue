<!--
 * @Author: lyj
 * @Date: 2022-08-10 10:02:06
 * @LastEditTime: 2022-10-12 16:28:19
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-table
    ref="table"
    height="600"
    style="width: 100%"
    :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }"
    :data="state.tableData"
    border
    stripe
    @selection-change="handleSelectionChange"
  >
    <el-table-column v-for="(item, index) in state.data" :key="index" :prop="item.prop" :min-width="110">
      <!-- 表头 -->
      <template #header>
        <span> <span v-if="item.required" class="required">*</span> {{ item.label }}</span>
      </template>
      <!-- 图片  -->
      <template v-if="item.type === 'img' || item.type === 'styleImage'" #default="{ row }">
        <div @click="showUploadDialog(row, 'styleUrlList')">
          <img
            v-if="row.styleUrlList.length && row.styleUrlList"
            class="tableImg"
            :src="find(row.styleUrlList, { topic: 1 }) ? find(row.styleUrlList, { topic: 1 }).url : row.styleUrlList[0].url"
            alt="主图"
            style="width: 75px; height: 75px"
          />
          <njp-upload-placeholder-icon v-else />
        </div>
      </template>
      <!-- 唛架图  -->
      <template v-if="item.type === 'shelfImage'" #default="{ row }">
        <div @click="showUploadDialog(row, 'shelfImageList')">
          <img
            v-if="row.shelfImageList.length && row.shelfImageList"
            class="tableImg"
            :src="find(row.shelfImageList, { topic: 1 }) ? find(row.shelfImageList, { topic: 1 }).url : row.shelfImageList[0].url"
            alt="主图"
            style="width: 75px; height: 75px"
          />
          <njp-upload-placeholder-icon v-else />
        </div>
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
          <el-select v-model="row.type">
            <el-option v-for="item in state.fabricType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </template>
       <!--面料类型-- 主、辅料 -->
     <template v-if="item.type === 'primaryFlag'" #default="{ row }">
        <!-- 面料 -->
          <el-select v-model="row[item.prop]">
            <el-option label="主料" :value="1" />
            <el-option label="辅料" :value="2" />
          </el-select>
      </template>

      <!-- 其他 -->
      <template v-if="item.type == null" #default="{ row }">
        <el-input v-model="row[item.prop]" type="text" />
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

  <el-pagination
    v-model:currentPage="page"
    v-model:page-size="limit"
    class="import-table-pagination"
    :page-sizes="[10, 20, 50, 100]"
    :small="small"
    :disabled="disabled"
    :background="background"
    layout="total, sizes, prev, pager, next, jumper"
    :total="state.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrent"
  />

  <!-- 图片 -->
  <el-dialog v-model="state.dialogVisible" :title="state.title" width="210px" :draggable="false">
    <ImagesV1 v-if="state.dialogVisible" v-model="state.fileList" :limit="state.limit" />
    <template #footer>
      <el-button @click="state.dialogVisible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="handleImageUpload('img')">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>

  <!-- 唛架图片 -->
  <el-dialog v-model="state.shelfImageType" title="上传唛架图" width="210px" :draggable="false">
    <ShelfIma v-if="state.shelfImageType" v-model="state.shelfList" :picture-type="state.pictureType" :limit="state.limit" />
    <template #footer>
      <el-button @click="state.shelfImageType = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="handleImageUpload('shelfIma')">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue'
  import ImagesV1 from '@/components/njp-upload-images-v1.vue'
  import ShelfIma from '@/components/njp-upload-shelfIma-v1.vue' //唛架图
  import { find, isEmpty, cloneDeep } from 'lodash'
  import { equipmentType, fabricType } from '@/components/conifgs.ts'

  const page = ref(1)
  const limit = ref(10)
  const table: any = ref()

  const props = defineProps<{
    type: any
    data: any
    getTableData: any
    form: any
  }>()

  const state: any = reactive({
    data: props.data,
    initData: [], //接口所有数据
    tableData: [], //展示数据
    equipmentType: equipmentType,
    fabricType: fabricType,
    // 分页
    total: 0,
    //图片
    dialogVisible: false,
    title: '上传',
    fileList: [],
    rowData: {},
    limit: 6,
    //唛架图片
    shelfImageType: false,
    shelfList: [],
    pictureType: { accept: ' .cut, .dat, .gbr, .ggt,.grb,.ict,.iso,.nc,.tac,.txt', availableSuffix: '  cut dat gbr ggt grb ict iso nc tac txt' }
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

      let arr = sum.flat(Infinity)

      //处理图片回显
      arr.map((item: any, index: any) => {
        item.only = index
        //款图
        item.styleUrlList = [] //图片组件
        // 唛架图
        if (props.type === 'bedSchedule') {
          item.shelfImageList = [] //图片组件
        }

        if (item.type) {
          item.type = item.type.toString()
        }
      })
      return cloneDeep(arr)
    } else {
      return sum
    }
  }

  const getNewArray = (array: any, subGroupLength: any) => {
    let index = 0
    let newArray = []
    while (index < array.length) {
      newArray.push(array.slice(index, (index += subGroupLength)))
    }
    return newArray
  }

  //分页功能
  const setPagination = (data: any) => {
    let list = getNewArray(data, limit.value)
    state.tableData = list[page.value - 1] //赋值展示数据  -1 数组从0开始
  }

  const init = () => {
    let initData = setFormat(props.form)
    state.initData = initData
    props.getTableData(initData)
    state.total = initData.length //总长度
    //处理数据
    setPagination(initData)
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
    state.title = '上传图片'
    state.limit = 1 //数量
    if (type === 'styleUrlList') {
      state.dialogVisible = true
      state.rowData = row
      state.fileList = row[type] || [] //点击吧当前图片数据传递到组件中
    }
    if (type === 'shelfImageList') {
      state.shelfImageType = true
      state.rowData = row
      state.shelfList = row[type] || [] //点击吧当前图片数据传递到组件中
    }
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

  //图片保存
  const handleImageUpload = (type: any) => {
    if (type === 'img') {
      state.dialogVisible = false
      let rowData = cloneDeep(state.rowData)
      rowData.styleUrlList = state.fileList //组件需要格式
      // rowData.image = state.fileList[0].url //后端需要格式-款图
      let list = cloneDeep(state.tableData)
      //**赋值**
      state.tableData = updateData(rowData, list)
    }
    //唛架图
    if (type === 'shelfIma') {
      state.shelfImageType = false
      let rowData = cloneDeep(state.rowData)
      rowData.shelfImageList = state.shelfList //组件需要格式
      let list = cloneDeep(state.tableData)
      //**赋值**
      state.tableData = updateData(rowData, list)
    }
  }

  //删除
  const selectedChange = (e: any) => {
    let rowData = cloneDeep(state.tableData)
    state.tableData = rowData.filter((item: any) => item.only !== e.only)
  }

  const handleSizeChange = (val: number) => {
    limit.value = val
    setPagination(state.initData)
  }
  const handleCurrent = (val: number) => {
    page.value = val
    setPagination(state.initData)
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
  .image {
    width: 100px;
    height: 100px;
    padding: 10px;
  }
  .tableImg {
    cursor: pointer;
  }
  .required {
    color: red;
    font-size: 15px;
  }
  .import-table-pagination {
    float: right;
    transform: translateY(20px);
    position: unset !important;
  }
</style>

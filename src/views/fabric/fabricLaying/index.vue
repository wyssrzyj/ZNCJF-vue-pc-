<template>
  面料铺布99
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @on-add-update-handle="handleAddOrUpdate" @row-dblclick="handleRowDbclick">
    <template #queryFormItem>
      <el-form-item label="面料编号" prop="styleNo">
        <el-input v-model="state.queryFormData.styleNo" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="面料名称" prop="productName">
        <el-input v-model="state.queryFormData.productName" placeholder="请输入" clearable />
      </el-form-item>
    </template>
    <template #operationExtBtn>
      <el-button type="primary" style="order: 1" @click="handleUploadStyle">批量导入款式</el-button>
      <el-button type="primary" style="order: 2" @click="handleUploadFile">批量导入文件</el-button>
      <el-button type="primary" style="order: 3" @click="handleClick(false, '新增面料铺布', { id: '1' })">新增</el-button>
      <el-button type="primary" style="order: 3" @click="handleClick(true, '查看面料铺布', { id: '1' })">查看</el-button>
      <el-button type="primary" style="order: 3" @click="handleClick(false, '编辑面料铺布', { id: '1' })">编辑</el-button>
      <el-button type="primary" style="order: 3" @click="mov">删除</el-button>
    </template>
    <template #actionExtBtn="{ row }">
      <div>
        <el-button type="primary" style="order: 3" @click="handleClick(true, '查看面料铺布', row)">查看</el-button>
        <el-button type="primary" style="order: 3" @click="handleClick(false, '编辑面料铺布', row)">编辑</el-button>
      </div>
    </template>
    <template #styleUrlList="{ row }">
      <div @click="showUploadDialog(row, 'styleUrlList')">
        <img
          v-if="row.styleUrlList && row.styleUrlList.length"
          :src="find(row.styleUrlList, { topic: 1 }) ? find(row.styleUrlList, { topic: 1 }).url : row.styleUrlList[0].url"
          alt="主图"
          style="width: 75px; height: 75px"
        />
        <njp-upload-placeholder-icon v-else />
      </div>
    </template>
    <template #prooFactory="{ row }">
      <el-select v-model="row.prooFactory" clearable filterable @change="selectChange(row)">
        <el-option v-for="item in store.state.selectOptions.selectProoFactory" :key="item" :label="item" :value="item" />
      </el-select>
    </template>
    <template #priority="{ row }">
      <el-select v-model="row.priority" clearable filterable @change="selectChange(row)">
        <el-option v-for="(item, index) in 5" :key="index" :label="`P${index}`" :value="`P${index}`" />
      </el-select>
    </template>
    <template #remark="{ row }">
      <div style="white-space: pre; height: 90px">{{ row.remark }}</div>
    </template>
  </njp-table-config>

  <dialog-upload-file ref="dialogUploadFileEl" @on-submit-success="refreshTable" />
  <dialog-upload-style ref="dialogUploadStyleEl" @on-submit-success="refreshTable" />
  <el-dialog v-model="state.dialogVisible" :title="state.title" width="980px" :draggable="false">
    <njp-upload-images-v1 v-if="state.dialogVisible" v-model="state.fileList" :limit="state.limit" />
    <template #footer>
      <el-button @click="state.dialogVisible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="handleImageUpload">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :title="state.dialogTitle" width="1200px">
    <DialogContent :current="state.current" :close="close" :dialog-type="state.dialogType" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance, ref } from 'vue'
  import { useStore } from 'vuex'
  import { findIndex, find } from 'lodash'
  import { ElMessage } from 'element-plus'
  import DialogContent from './dialogContent/index.vue'

  const { proxy }: any = getCurrentInstance()
  const store = useStore()

  const dialogUploadFileEl = ref()
  const dialogUploadStyleEl = ref()
  const styleLibListEl = ref()

  const state = reactive({
    dialogType: true,
    dialogTableVisible: false,
    dialogTitle: '查看面料铺布',
    current: {},

    queryFormData: {
      styleNo: '',
      productName: ''
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

  const selectChange = (row: any) => {
    proxy.$baseService.put('/njp-dsr-api/dsr/dsrstyle/update', row).then(res => {
      if (res.code !== 0) return ElMessage.error(res.msg)
      refreshTable()
    })
  }

  const handleRowDbclick = (row: any) => {
    toViewFun(row, 'opinionList')
  }

  // const toView = (row: any, type) => {
  //   toViewFun(row, type)
  // }

  const toViewFun = (row: any, type: any) => {
    proxy.$routerToView({
      path: `/style/create-style/view-create-style`,
      query: {
        _mt: `款式详情`,
        id: row.id,
        season: row.season,
        stage: row.stage,
        styleNo: row.styleNo,
        gender: row.gender,
        brand: row.brand,
        productType: row.productType,
        typeValue: type
      }
    })
  }

  //去打印通知单详情
  // const toViewSample = row => {
  //   proxy.$routerToView({
  //     path: `/style/create-sample/view-create-sample`,
  //     query: {
  //       _mt: `打样单详情`,
  //       styleNo: row.styleNo,
  //       stage: row.stage
  //     }
  //   })
  // }

  const handleUploadStyle = () => {
    dialogUploadStyleEl.value.showDialog({
      action: '/njp-dsr-api/dsr/dsrstyle/importStyleBatch'
    })
  }

  const handleUploadFile = () => {
    dialogUploadFileEl.value.showDialog()
  }

  const showUploadDialog = (row: any, type: any) => {
    state.dialogVisible = true
    state.title = '上传款式图'
    state.limit = 6
    state.rowData = row
    state.rowData.type = type
    state.fileList = row[type] || []
  }

  const handleImageUpload = () => {
    const imgList = state.fileList.map((item: any) => {
      return {
        dsrStyleId: state.rowData.id,
        fileId: item.id,
        fileType: state.rowData.type == 'styleUrlList' ? 5 : 6,
        topic: item.topic,
        url: item.url
      }
    })
    //如果没有设置主图，则默认第一个是主图
    if (findIndex(imgList, { topic: 1 }) == -1 && imgList.length) {
      imgList[0].topic = 1
    }

    const sendData = {
      dsrStyleId: state.rowData.id,
      fileType: state.rowData.type == 'styleUrlList' ? 5 : 6,
      uploadImageList: imgList
    }

    proxy.$baseService.post('/njp-dsr-api/dsr/dsrstyle/uploadImage', sendData).then(res => {
      if (res.code !== 0) return ElMessage.error(res.msg)
      ElMessage.success(res.msg)
      state.dialogVisible = false
      refreshTable()
    })
  }

  const refreshTable = () => {
    styleLibListEl.value.refreshTable()
  }

  //上传TP资料成功
  // const onUploadSuccess = e => {
  //   const sendData = {
  //     dsrStyleId: state.rowData.id,
  //     fileId: e.id,
  //     fileType: 2
  //   }
  //   proxy.$baseService.post('/njp-dsr-api/dsr/dsrstyle/uploadOneFile', sendData).then(res => {
  //     if (res.code !== 0) return ElMessage.error(res.msg)
  //     refreshTable()
  //   })
  // }

  //新增、编辑、查看
  const handleClick = (e: any, type: any, row: any) => {
    state.current = row
    state.dialogTitle = type
    state.dialogType = e
    state.dialogTableVisible = true
  }
  const mov = () => {
    // console.log('删除')
  }
  //关闭 弹窗
  const close = () => {
    state.dialogTableVisible = false
  }
</script>

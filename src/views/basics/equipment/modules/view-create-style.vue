<template>
  <njp-view-detail title="基础信息">
    <template #button>
      <el-button type="primary" :loading="state.loading1" @click="save">保存</el-button>
    </template>
    <!---------------------------------------------------------- 表单区域 ---------------------------------------------------------->
    <el-form class="form-row" :model="state.formData" label-position="top">
      <el-row>
        <el-col :span="20">
          <el-row>
            <el-form-item label="品牌" prop="brand">
              <el-select v-model="state.formData.brand" clearable filterable>
                <el-option v-for="item in store.state.selectOptions.selectBrand" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="款号" prop="styleNo">
              <el-input v-model="state.formData.styleNo" placeholder="请输入" clearable disabled />
            </el-form-item>
            <el-form-item label="季节" prop="season">
              <el-select v-model="state.formData.season" clearable filterable disabled>
                <el-option v-for="item in store.state.selectOptions.selectSeason" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="阶段" prop="stage">
              <el-select v-model="state.formData.stage" clearable filterable disabled>
                <el-option v-for="item in store.state.selectOptions.selectStage" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="品名" prop="productName">
              <el-input v-model="state.formData.productName" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="系列" prop="series">
              <el-select v-model="state.formData.series" clearable filterable>
                <el-option v-for="item in store.state.selectOptions.selectSeries" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="子系列" prop="subseries">
              <el-select v-model="state.formData.subseries" clearable filterable>
                <el-option v-for="item in store.state.selectOptions.selectSubSeries" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="state.formData.gender" clearable filterable>
                <el-option v-for="item in store.state.selectOptions.selectGender" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="成人/儿童" prop="adultChildren">
              <el-select v-model="state.formData.adultChildren" clearable filterable>
                <el-option v-for="item in store.state.selectOptions.selectAdultsChildren" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="针梭织" prop="woven">
              <el-select v-model="state.formData.woven" clearable filterable>
                <el-option v-for="item in store.state.selectOptions.selectWoven" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="上下装" prop="upsideDown">
              <el-select v-model="state.formData.upsideDown" clearable filterable>
                <el-option v-for="item in store.state.selectOptions.selectUpsideDown" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="工艺师">
              <el-input v-model="state.formData.technologist" clearable placeholder="请输入" />
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="4">
          <el-row style="width: 200px">
            <el-form-item label="款式图">
              <div @click="showUploadDialog(state.formData, 'styleUrlList')">
                <img
                  v-if="state.formData.styleUrlList && state.formData.styleUrlList.length"
                  :src="find(state.formData.styleUrlList, { topic: 1 }) ? find(state.formData.styleUrlList, { topic: 1 }).url : state.formData.styleUrlList[0].url"
                  alt="主图"
                  style="width: 178px; height: 178px"
                />
                <njp-upload-placeholder-image v-else />
              </div>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <!---------------------------------------------------------- 列表区域 ---------------------------------------------------------->
    <div>
      <el-tabs v-model="state.typeValue" type="card" @tab-click="handleTabClick">
        <el-tab-pane v-for="item in state.typeList" :key="item.typeCode" :label="item.typeName" :name="item.typeCode" />
      </el-tabs>
      <!---------------------------------------------------------- 内部意见 ---------------------------------------------------------->
      <njp-table-config v-show="state.typeValue === 'opinionList'" ref="tableEl1" @on-refactor-query-params="refactorQueryParams" @on-refactor-table-list="getOpinionList">
        <template #content="{ row }">
          <el-input v-model="row.content" placeholder="请输入评审意见" type="textarea" clearable />
        </template>
        <template #type="{ row }">
          <el-select v-model="row.type" clearable>
            <el-option v-for="(item, index) in store.state.selectOptions.selectOpinionsType" :key="item" :label="item" :value="index" />
          </el-select>
        </template>
        <template #state="{ row }">
          <el-select v-model="row.state" clearable>
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </template>
        <template #actionExtBtn="{ row }">
          <el-button link type="primary" @click="addRow(row, state.tableData.opinionList)">添加</el-button>
          <el-button link type="danger" @click="delRow(row, state.tableData.opinionList)">删除</el-button>
        </template>
      </njp-table-config>
      <!---------------------------------------------------------- 开发bom明细 ---------------------------------------------------------->
      <njp-table-config v-show="state.typeValue === 'bomDetailsList'" ref="tableEl2" comp-key="bomDetails" @on-refactor-query-params="refactorQueryParams" @on-refactor-table-list="getBomDetailsList">
        <template #operationExtBtn>
          <!--          <el-button type="primary" @click="useOtherBom">引用其他款bom</el-button>-->
          <el-button type="primary" :loading="state.loading2" @click="syncBom">同步BOM</el-button>
          <!--          <el-input v-model="state.materialNoOrName" style="width: 200px" placeholder="材料名称/材料编码" clearable @keyup.enter="searchBom(state.materialNoOrName)" @clear="searchBom()">-->
          <!--            <template #append>-->
          <!--              <el-button icon="Search" @click="searchBom(state.materialNoOrName)" />-->
          <!--            </template>-->
          <!--          </el-input>-->
        </template>
        <template #appPart="{ row }">
          <el-input v-model="row.appPart" placeholder="请输入" clearable />
        </template>
        <template #partCode="{ row }">
          <el-input v-model="row.partCode" placeholder="请输入" clearable />
        </template>
        <template #materialNo="{ row }">
          <el-select v-model="row.materialNo" placeholder="请输入或选择" clearable filterable allow-create />
        </template>
        <template #materialName="{ row }">
          <el-select v-model="row.materialName" placeholder="请输入或选择" clearable filterable allow-create />
        </template>
        <template #supplier="{ row }">
          <el-input v-model="row.supplier" placeholder="请输入" clearable />
        </template>
        <template #singleCons="{ row }">
          <el-input v-model="row.singleCons" placeholder="请输入" clearable />
        </template>
        <template #materialCategory="{ row }">
          <el-input v-model="row.materialCategory" placeholder="请输入" clearable />
        </template>
        <template #unit="{ row }">
          <el-input v-model="row.unit" placeholder="请输入" clearable />
        </template>
        <template #weight="{ row }">
          <el-input v-model="row.weight" placeholder="请输入" clearable />
        </template>
        <template #width="{ row }">
          <el-input v-model="row.width" placeholder="请输入" clearable />
        </template>
        <template #materialType="{ row }">
          <el-input v-model="row.materialType" placeholder="请输入" clearable />
        </template>
        <template #inUse="{ row }">
          <el-input v-model="row.inUse" placeholder="请输入" clearable />
        </template>
        <template #zabMapSlot>
          <template v-if="state.tableData.bomDetailsList.length && state.tableData.bomDetailsList[0].zabMap">
            <el-table-column v-for="(val, key) in state.tableData.bomDetailsList[0].zabMap" :key="key" :label="key" align="center" width="120">
              <template #default="{ row }">
                <el-input v-model="row.zabMap[key]" type="text" placeholder="请输入" />
              </template>
            </el-table-column>
          </template>
        </template>
        <template #remark="{ row }">
          <el-input v-model="row.remark" placeholder="请输入" clearable />
        </template>
        <template #price="{ row }">
          <el-input v-model="row.price" placeholder="请输入" clearable />
        </template>
        <template #yxhSize="{ row }">
          <el-input v-model="row.yxhSize" placeholder="请输入" clearable />
        </template>
        <template #actionExtBtn="{ row }">
          <el-button link type="primary" @click="addRow(row, state.tableData.bomDetailsList)">添加</el-button>
          <el-button link type="danger" @click="delRow(row, state.tableData.bomDetailsList)">删除</el-button>
        </template>
      </njp-table-config>
      <!---------------------------------------------------------- 工艺bom明细 ---------------------------------------------------------->
      <njp-table-config
        v-show="state.typeValue === 'bomProcessDetailsList'"
        ref="tableEl3"
        comp-key="bomProcessDetails"
        @on-refactor-query-params="refactorQueryParams"
        @on-refactor-table-list="getBomProcessDetailsList"
      >
        <template #appPart="{ row }">
          <el-input v-model="row.appPart" placeholder="请输入" clearable />
        </template>
        <template #partCode="{ row }">
          <el-input v-model="row.partCode" placeholder="请输入" clearable />
        </template>
        <template #materialNo="{ row }">
          <el-select v-model="row.materialNo" placeholder="请输入或选择" clearable filterable allow-create />
        </template>
        <template #materialName="{ row }">
          <el-select v-model="row.materialName" placeholder="请输入或选择" clearable filterable allow-create />
        </template>
        <template #supplier="{ row }">
          <el-input v-model="row.supplier" placeholder="请输入" clearable />
        </template>
        <template #singleCons="{ row }">
          <el-input v-model="row.singleCons" placeholder="请输入" clearable />
        </template>
        <template #materialCategory="{ row }">
          <el-select v-model="row.materialCategory" placeholder="请输入或选择" clearable filterable allow-create />
        </template>
        <template #unit="{ row }">
          <el-input v-model="row.unit" placeholder="请输入" clearable />
        </template>
        <template #weight="{ row }">
          <el-input v-model="row.weight" placeholder="请输入" clearable />
        </template>
        <template #width="{ row }">
          <el-input v-model="row.width" placeholder="请输入" clearable />
        </template>
        <template #materialType="{ row }">
          <el-select v-model="row.materialType" placeholder="请输入或选择" clearable filterable allow-create />
        </template>
        <template #inUse="{ row }">
          <el-input v-model="row.inUse" placeholder="请输入" clearable />
        </template>
        <template #zabMapSlot>
          <template v-if="state.tableData.bomDetailsList.length && state.tableData.bomDetailsList[0].zabMap">
            <el-table-column v-for="(val, key) in state.tableData.bomDetailsList[0].zabMap" :key="key" :label="key" align="center" width="120">
              <template #default="{ row }">
                <el-input v-model="row.zabMap[key]" type="text" placeholder="请输入" />
              </template>
            </el-table-column>
          </template>
        </template>
        <template #remark="{ row }">
          <el-input v-model="row.remark" placeholder="请输入" clearable />
        </template>
        <template #price="{ row }">
          <el-input v-model="row.price" placeholder="请输入" clearable />
        </template>
        <template #yxhSize="{ row }">
          <el-input v-model="row.yxhSize" placeholder="请输入" clearable />
        </template>
        <template #actionExtBtn="{ row }">
          <el-button link type="primary" @click="addRow(row, state.tableData.bomProcessDetailsList)">添加</el-button>
          <el-button link type="danger" @click="delRow(row, state.tableData.bomProcessDetailsList)">删除</el-button>
        </template>
      </njp-table-config>
      <!---------------------------------------------------------- tp资料 ---------------------------------------------------------->
      <njp-table-config v-show="state.typeValue === 'tpList'" ref="tableEl4" comp-key="tpFile" @on-refactor-query-params="refactorQueryParams" @on-refactor-table-list="getTpList">
        <template #actionExtBtn="{ row }">
          <njp-upload-button-single link :btn-text="row.url ? '重新上传' : '上传'" :file-type="2" @update:modelValue="fileToTable(row, $event)" />
          <njp-download-file v-if="row.url" :url="row.url" :name="row.name" />
          <el-button type="primary" link @click="addRow(row, state.tableData.tpList)">添加</el-button>
          <el-button type="danger" link @click="delRow(row, state.tableData.tpList)">删除</el-button>
        </template>
      </njp-table-config>
    </div>
  </njp-view-detail>
  <njp-dialog-common ref="dialogEl" :hide-btn="true">
    <div v-loading="state.loading3">
      <njp-table-config :page-fixed="false" comp-key="styleList" :query-form-data="state.queryFormData" @on-refactor-query-params="refactorDialogQueryParams">
        <template #queryFormItem>
          <el-form-item label="款式编码" prop="styleNo">
            <el-input v-model="state.queryFormData.styleNo" placeholder="请输入" clearable />
          </el-form-item>
        </template>
        <template #actionExtBtn="{ row }">
          <el-button link type="primary" @click="selectBom(row)">选择</el-button>
        </template>
      </njp-table-config>
    </div>
  </njp-dialog-common>
  <el-dialog v-model="state.dialogVisible" :title="state.title" width="980px" :draggable="false">
    <njp-upload-images-v1 v-if="state.dialogVisible" v-model="state.fileList" :limit="state.limit" />
    <template #footer>
      <el-button @click="state.dialogVisible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="handleImageUpload">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  /*---------------------------------------------------------------init--------------------------------------------------------------------------*/
  import { reactive, onMounted, getCurrentInstance, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { findIndex, cloneDeep, find } from 'lodash'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useStore } from 'vuex'

  const route = useRoute()
  const { proxy } = getCurrentInstance()
  const store = useStore()

  const tableEl1 = ref()
  const tableEl2 = ref()
  const tableEl3 = ref()
  const tableEl4 = ref()
  const dialogEl = ref()

  /*---------------------------------------------------------------props----------------------------------------------------------------------*/

  const state = reactive({
    formData: {},
    tableData: {
      opinionList: [],
      bomDetailsList: [],
      bomProcessDetailsList: [],
      tpList: []
    },
    queryFormData: {
      styleNo: ''
    },
    materialNoOrName: '',
    typeValue: 'opinionList',
    typeList: [
      {
        typeName: '内部意见',
        typeCode: 'opinionList'
      },
      {
        typeName: '开发BOM明细',
        typeCode: 'bomDetailsList'
      },
      {
        typeName: '工艺BOM明细',
        typeCode: 'bomProcessDetailsList'
      },
      {
        typeName: 'tp资料',
        typeCode: 'tpList'
      }
    ],
    loading1: false,
    loading2: false,
    loading3: false,
    dialogVisible: false,
    fileList: [],
    rowData: null,
    limit: 6
  })

  /*---------------------------------------------------------------methods----------------------------------------------------------------------*/

  //选择款式的bom后覆盖开发bom列表
  const selectBom = row => {
    state.loading3 = true
    proxy.$baseService
      .get('/njp-dsr-api/dsr/dsrstylebomdetails/citeOtherBom', {
        prooNoticeId: row.id
      })
      .then(res => {
        state.loading3 = false
        if (res.code !== 0) return ElMessage.error(res.msg)
        dialogEl.value.hideDilaog()
        if (res.data && res.data.length) {
          state.tableData.bomDetailsList.length = 0
          res.data.forEach(item => {
            state.tableData.bomDetailsList.push(item)
          })
        }
      })
  }

  //同步bom
  const syncBom = () => {
    state.loading2 = true
    proxy.$baseService
      .get('/njp-dsr-api/dsr/dsrstyle/getBomListByStyleNoAndStageAndSeason', {
        season: route.query.season,
        stage: route.query.stage,
        styleNo: route.query.styleNo
      })
      .then(res => {
        state.loading2 = false
        if (res.code !== 0) return ElMessage.error(res.msg)
        state.materialNoOrName = ''
        tableEl2.value.refreshTable()
      })
  }

  const fileToTable = (row, e) => {
    for (let k in row) {
      row[k] = e[k]
    }
  }

  const addRow = (row, list) => {
    if (['tpList'].includes(state.typeValue) && list.length >= 3) return ElMessage.warning('最多添加3条数据！')
    let obj = cloneDeep(row)
    for (let k in obj) {
      if (k == 'zabMap') {
        for (let j in obj[k]) {
          obj[k][j] = null
        }
      } else {
        obj[k] = null
      }
    }
    obj.id = new Date().getTime()
    obj.dsrStyleId = row.dsrStyleId
    const index = findIndex(list, { id: row.id })
    list.splice(index + 1, 0, obj)
  }

  const delRow = (row, list) => {
    if (list.length == 1) {
      ElMessageBox.confirm('确定要清空该数据吗？', '提示').then(res => {
        for (const k in row) {
          if (k == 'sizeMap') {
            for (let j in row[k]) {
              row[k][j] = null
            }
          } else {
            row[k] = null
          }
        }
      })
    } else {
      ElMessageBox.confirm('确定要删除该数据吗？', '提示').then(res => {
        const index = findIndex(list, { id: row.id })
        list.splice(index, 1)
      })
    }
  }

  //图片上传相关
  const showUploadDialog = (row, type) => {
    state.dialogVisible = true
    state.title = '上传款式图'
    state.limit = 6
    state.rowData = row
    state.rowData.type = type
    state.fileList = row[type] || []
  }
  const handleImageUpload = () => {
    const imgList = state.fileList.map(item => {
      return {
        dsrStyleId: state.rowData.id,
        fileId: item.id,
        fileType: 5,
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
      fileType: 5,
      uploadImageList: imgList
    }

    proxy.$baseService.post('/njp-dsr-api/dsr/dsrstyle/uploadImage', sendData).then(res => {
      if (res.code !== 0) return ElMessage.error(res.msg)
      ElMessage.success(res.msg)
      state.dialogVisible = false
      getDetail()
    })
  }

  const handleTabClick = e => {
    state.typeValue = e.props.name
  }

  const refactorQueryParams = e => {
    e.dsrStyleId = route.query.id
  }

  const refactorDialogQueryParams = e => {
    e.gender = route.query.gender
    e.brand = route.query.gender
    e.productType = route.query.productType
  }

  //获取意见列表
  const getOpinionList = e => {
    state.tableData.opinionList = e
  }

  //获取开发bom明细
  const getBomDetailsList = e => {
    state.tableData.bomDetailsList = e
  }

  //获取工艺bom明细
  const getBomProcessDetailsList = e => {
    state.tableData.bomProcessDetailsList = e
  }

  //获取tp资料
  const getTpList = e => {
    state.tableData.tpList = e
  }

  //保存表单
  const saveForm = () => {
    proxy.$baseService.put('/njp-dsr-api/dsr/dsrstyle/renewStyle', state.formData).then(res => {
      if (res.code !== 0) return ElMessage.error(res.msg)
      getDetail()
    })
  }

  const save = () => {
    saveForm()
    const apiObj = {
      opinionList: {
        api: '/njp-dsr-api/dsr/dsrstylereviewopinions/saveAndUpdate',
        El: tableEl1
      },
      bomDetailsList: {
        api: '/njp-dsr-api/dsr/dsrstylebomdetails/saveAndUpdate',
        El: tableEl2
      },
      bomProcessDetailsList: {
        api: '/njp-dsr-api/dsr/dsrstylebomprocessdetails/batchSaveAndUpdate',
        El: tableEl3
      },
      tpList: {
        api: '/njp-dsr-api/dsr/dsrstylefiles/uploadFiles',
        El: tableEl4
      }
    }
    const sendData = state.tableData[state.typeValue]
    const keyArr = ['id', 'no', 'dsrStyleId', 'zabMap']
    //去除全部为null的数据
    if (Array.isArray(sendData)) {
      for (let i = 0; i < sendData.length; i++) {
        sendData[i].no = i
        let flag = true
        for (const j in sendData[i]) {
          if (!keyArr.includes(j) && !proxy.$utils.isNull(sendData[i][j])) {
            flag = false
            break
          }
        }
        if (flag) {
          sendData.splice(i, 1)
          i--
        }
      }
    }
    //校验
    if (state.typeValue == 'opinionList') {
      for (const [index, item] of sendData.entries()) {
        if (!item.content) {
          ElMessage.warning(`第${index + 1}行的评审意见不能为空`)
          return
        }
        if (!item.type && item.type != 0) {
          ElMessage.warning(`第${index + 1}行的意见类型不能为空`)
          return
        }
        if (!item.state && item.state != 0) {
          ElMessage.warning(`第${index + 1}行的是否采用不能为空`)
          return
        }
      }
    }
    if (state.typeValue == 'bomDetailsList' || state.typeValue == 'bomProcessDetailsList') {
      for (const [index, item] of sendData.entries()) {
        if (!item.materialName) {
          ElMessage.warning(`第${index + 1}行的材料名称不能为空`)
          return
        }
        if (!item.materialNo) {
          ElMessage.warning(`第${index + 1}行的材料编码不能为空`)
          return
        }
      }
    }
    state.loading1 = true
    let data = {
      dsrStyleId: route.query.id,
      dtoList: sendData
    }
    if (state.typeValue == 'tpList') {
      const fileList = state.tableData.tpList.map(item => {
        return {
          dsrStyleId: route.query.id,
          fileId: item.id,
          fileType: 2,
          url: item.url
        }
      })
      data = {
        dsrStyleId: route.query.id,
        fileType: 2,
        uploadFileList: fileList
      }
    }
    proxy.$baseService.post(apiObj[state.typeValue].api, data).then(res => {
      state.loading1 = false
      if (res.code !== 0) return ElMessage.error(res.msg)
      ElMessage.success(res.msg)
      apiObj[state.typeValue].El.value.refreshTable()
    })
  }

  const getDetail = () => {
    proxy.$baseService.get(`/njp-dsr-api/dsr/dsrstyle/getStyle/${route.query.id}`).then(res => {
      if (res.code !== 0) return ElMessage.error(res.msg)
      state.formData = res.data
    })
  }

  onMounted(() => {
    state.typeValue = route.query.typeValue
    getDetail()
  })
</script>

<style lang="less" scoped>
  .el-row {
    .el-form-item {
      margin-right: 30px;
    }
  }
</style>

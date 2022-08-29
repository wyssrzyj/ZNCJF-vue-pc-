<template>
  <el-dialog v-model="state.dialogVisible" :title="state.title" :close-on-click-modal="false" draggable>
    <el-form>
      <div class="tip">
        <el-icon><Warning /></el-icon>
        {{ props.tips }}
      </div>
      <el-form-item label="请选择需要上传的文件类型：">
        <el-select v-model="state.fileType" placeholder="请选择" :disabled="state.loading" @change="handleTypeChange">
          <el-option v-for="item in state.fileTypeList" :key="item.value" :label="item.label" :value="item.value" @click.native="state.fileTypeObj = item" />
        </el-select>
      </el-form-item>
      <el-form-item label="批量导入：">
        <div class="flex">
          <njp-download-template v-if="state.fileType == 2" template-name="工序库模板.xlsx" />
          <el-upload
            v-if="state.fileType !== null"
            :file-list="state.fileTypeObj.fileList"
            :action="state.ossAction"
            multiple
            :data="state.data"
            :before-upload="beforeAvatarUpload"
            :on-progress="uploadProgress"
            :on-success="uploadSuccess"
            :before-remove="beforeRemove"
            :on-error="uploadError"
          >
            <el-button icon="upload">上传文件</el-button>
            <div v-if="state.fileType !== null && state.fileTypeObj.rule" class="subtip">
              <el-icon><Warning /></el-icon>
              文件命名格式：{{ state.fileTypeObj.rule }}
            </div>
          </el-upload>
          <el-button v-else icon="upload" @click="touchoffTip">上传文件</el-button>
        </div>
      </el-form-item>
    </el-form>
    <template v-if="state.fileType != 2" #footer>
      <el-button :disabled="state.loading" @click="handleCancel">{{ $t('cancel') }}</el-button>
      <el-button type="primary" :disabled="state.loading" @click="handleSubmit">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance } from 'vue'
  import { getToken } from '@njpCommon/utils/cache'
  import { ElMessage } from 'element-plus'

  const { proxy }: any = getCurrentInstance()
  const emits = defineEmits(['on-submit-success'])

  const props = defineProps({
    tips: {
      type: String,
      default: `请优先导入部件信息，再进行文件导入`
    },
    action: {
      type: String,
      default: `/njp-plus-admin-api/sys/oss/upload`
    }
  })

  const state = reactive({
    dialogVisible: false,
    title: '导入文件',
    fileType: null,
    fileTypeList: [
      {
        label: '平面图',
        value: 8,
        fileList: [],
        rule: '部件编码_自定义名称'
      },
      {
        label: '工艺路线',
        value: 2,
        fileList: [],
        rule: '部件编码_自定义名称'
      },
      {
        label: '工艺分解图',
        value: 9,
        fileList: [],
        rule: '部件编码_自定义名称'
      },
      {
        label: '工艺视频',
        value: 10,
        fileList: [],
        rule: '部件编码_自定义名称'
      },
      {
        label: '纸版文件',
        value: 0,
        fileList: [],
        rule: '部件编码_自定义名称'
      }
    ],
    fileTypeObj: {},
    ossAction: `${proxy.$baseService.app.api}${props.action}`,
    loading: false,
    data: { token: getToken() }
  })

  const handleTypeChange = e => {
    if (e == 2) {
      state.ossAction = `${proxy.$baseService.app.api}/njp-dsr-api/dsr/dsrdataprocedure/importData`
    } else {
      state.ossAction = `${proxy.$baseService.app.api}${props.action}`
    }
  }

  const showDialog = ({ title = '导入文件' } = {}) => {
    state.dialogVisible = true
    state.title = title
  }

  const uploadProgress = rawFile => {
    state.loading = true
  }

  const uploadSuccess = (res, uploadFile, uploadFiles) => {
    if (res.code != 0) {
      ElMessage.error(res.msg)
      uploadFile.status = 'fail'
    }
    state.fileTypeObj['fileList'] = uploadFiles
    state.loading = false
  }

  const uploadError = (err, file, fileList) => {
    ElMessage.error('系统有点繁忙，请稍后重试！')
    state.loading = false
  }

  const beforeRemove = (file, fileList) => {
    state.loading = false
  }

  const beforeAvatarUpload = rawFile => {
    if (state.fileType === null) {
      ElMessage.warning('请先选择需要上传的文件类型!')
      return false
    }
    const reg = /^.+_.+$/
    if (!reg.test(rawFile.name)) {
      ElMessage.warning('请上传按“部件编码_自定义名称”规则命名的文件!')
      return false
    }

    if ((state.fileType === 5 || state.fileType === 7) && !/image\/*/.test(rawFile.type)) {
      ElMessage.warning('请上传图片类型文件!')
      return false
    }

    if (rawFile.size / 1024 / 1024 > 200) {
      ElMessage.error('文件大小不得超过 200MB!')
      return false
    }
    return true
  }

  const handleCancel = () => {
    state.dialogVisible = false
    state.fileType = null
  }

  const touchoffTip = () => {
    ElMessage.warning('请先选择需要上传的文件类型!')
  }

  const handleSubmit = () => {
    let arr = []
    let lock = true
    state.fileTypeList.map(item => {
      if (item.fileList.length) {
        let fileList = []
        item.fileList.map(it => {
          if (it.status !== 'fail') {
            fileList.push({
              name: it.name,
              id: it.response.data.id ? it.response.data.id : it.id
            })
          }
        })
        if (fileList.length) {
          arr.push({
            fileType: item.value,
            fileList
          })
          lock = false
        }
      }
    })
    if (lock) {
      ElMessage.warning('请先上传符合要求的文件!')
      return
    }
    proxy.$baseService.post('/njp-dsr-api/dsr/dsrdataversion/importFile', arr).then(res => {
      if (res.code == 0) {
        ElMessage.success(res.msg)
        handleCancel()
        emits('on-submit-success')
      } else {
        ElMessage.error(res.msg)
      }
    })
  }

  defineExpose({
    showDialog
  })
</script>

<style lang="less" scoped>
  .tip {
    width: 100%;
    border-radius: 4px;
    background: #fffbf1;
    box-sizing: border-box;
    border: 1px solid #ffe098;
    color: #ffa631;
    margin-bottom: 20px;
    padding: 2px 10px;
    line-height: 28px;
    display: flex;
    align-items: center;
  }
  .subtip {
    font-size: 12px;
    font-weight: normal;
    line-height: 18px;
    letter-spacing: 0px;
    color: #999999;
    margin: 10px 0px;
    & > .el-icon {
      font-size: 14px;
      position: relative;
      top: 2px;
      left: 3px;
    }
  }
  /deep/.el-icon {
    font-size: 16px;
    margin-right: 5px;
  }
  /deep/.el-upload {
    display: block;
  }
  /deep/.el-upload-list {
    max-height: 600px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
  }
  /deep/.el-upload-list__item {
    width: 260px;
    margin-right: 20px;
  }
</style>

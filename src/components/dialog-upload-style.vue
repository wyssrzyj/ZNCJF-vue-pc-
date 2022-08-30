<template>
  <el-dialog v-model="state.dialogVisible" :title="state.title" :before-close="handleBeforeClose" :close-on-click-modal="false" draggable>
    <el-form>
      <el-form-item label="导入款式，存在相同款式编码和阶段时，是否全覆盖：">
        <el-switch v-model="state.cover" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="批量导入款式资料：">
        <njp-download-template :template-name="state.templateName" />
        <el-upload
          :file-list="state.fileList"
          accept=".xls, .xlsx"
          :action="state.imgAction"
          multiple
          :data="{ token: getToken(), cover: state.cover }"
          :before-upload="beforeAvatarUpload"
          :on-success="uploadSuccess"
          style="width: 100%"
        >
          <el-button icon="upload" class="uploadfile">上传文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance } from 'vue'
  import { getToken } from '@njpCommon/utils/cache'
  import { ElMessage } from 'element-plus'

  const { proxy }: any = getCurrentInstance()
  const emits = defineEmits(['on-submit-success'])

  const state = reactive({
    dialogVisible: false,
    title: '导入款式',
    imgAction: `${proxy.$baseService.app.api}/njp-dsr-api/dsr/dsrstyle/importStyle`,
    fileList: [],
    cover: 1,
    templateName: '款式库模板.xlsx'
  })

  const showDialog = ({ title = '导入款式', action = '' } = {}) => {
    state.dialogVisible = true
    state.title = title
    if (action) state.imgAction = `${proxy.$baseService.app.api}${action}`
  }

  const handleBeforeClose = () => {
    state.cover = 1
    if (state.fileList.length) {
      state.fileList = []
      emits('on-submit-success')
    }
    state.dialogVisible = false
  }

  const uploadSuccess = (res, uploadFile, uploadFiles) => {
    if (res.code != 0) {
      ElMessage.error(res.msg)
      uploadFile.status = 'fail'
      // state.fileList.splice(state.fileList.length - 1, 1)
    }
    state.fileList = uploadFiles
  }

  const beforeAvatarUpload = rawFile => {
    if (rawFile.size / 1024 / 1024 > 10) {
      ElMessage.error('文件大小不得超过 10MB!')
      return false
    }
    return true
  }

  defineExpose({
    showDialog,
    state
  })
</script>

<style lang="less" scoped>
  /deep/.el-form {
    height: 500px;
    max-height: 600px;
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

  /deep/.el-form-item__content {
    align-items: flex-start;
  }

  .uploadfile {
    position: absolute;
    top: 0px;
    left: 130px;
  }
</style>

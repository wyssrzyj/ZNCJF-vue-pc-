<template>
  <!-- 通用上传  -->
    <el-upload
      v-if="state.fileType !== null"
      :disabled="props.disabled"
      :file-list="state.targetArr[0]['fileList']"
      :accept="props.upload.pictureType.accept"
      :action="state.ossAction"
      multiple
      :headers="{ token: getToken() }"
      :before-upload="beforeAvatarUpload"
      :on-progress="uploadProgress"
      :on-success="uploadSuccess"
      :before-remove="beforeRemove"
      :on-remove="remove"
      :on-error="uploadError"
      :limit="props.upload.shelfFile.limit"
      :on-preview="download"
    >
      <el-button :disabled="props.disabled" icon="upload">上传文件</el-button>
      <div v-if="state.fileType !== null" class="subtip">
        <el-icon>
          <Warning />
        </el-icon>
        {{ props.upload.shelfFile.title }}
      </div>
    </el-upload>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance, watch } from 'vue'
  import { Warning } from '@element-plus/icons-vue'
  import { getToken } from '@/utils/cache'
  import { ElMessage } from 'element-plus'
  import { isEmpty } from 'lodash'
  const props = defineProps<{
    // either: '必传且限定' | '其中一个' | '值' // 利用TS：限定父组件传 either 的值
    value: any[]
    gitFile: any
    disabled: boolean
    upload: any
  }>()

  const { proxy }: any = getCurrentInstance()
  // const emits = defineEmits(['on-submit-success'])

  const state: any = reactive({
    disabled: props.disabled,
    dialogVisible: false,
    title: '导入文件',
    fileType: 0,
    fileTypeList: [
      {
        label: '样版文件',
        value: 0
      },
      {
        label: '3D渲染文件',
        value: 1
      },
      {
        label: 'tp资料',
        value: 2
      },
      {
        label: '款式图片',
        value: 5
      },
      {
        label: '样版截图',
        value: 6
      }
    ],
    ossAction: `${proxy.$baseService.app.api}${props.upload.api}`,
    targetArr: [
      {
        fileType: 0,
        fileList: []
      },
      {
        fileType: 1,
        fileList: []
      },
      {
        fileType: 2,
        fileList: []
      },
      {
        fileType: 3,
        fileList: []
      },
      {
        fileType: 4,
        fileList: []
      },
      {
        fileType: 5,
        fileList: []
      },
      {
        fileType: 6,
        fileList: []
      }
    ],
    uploadFileLoading: false
  })
  watch(
    () => props.value,
    item => {
      if (!isEmpty(props.value)) {
        state.targetArr[state.fileType]['fileList'] = item
        //
      } else {
        state.targetArr[state.fileType]['fileList'] = []
      }
    }
  )
  //点击下载
  const download = (e: any) => {
    //后端返回的
    if (!isEmpty(e.url)) {
      ownload(e.url)
    } else {
      //组件返回的
      if (!isEmpty(e.response.data)) {
        ownload(e.response.data.src)
      }
    }
  }

  const ownload = (data: any) => {
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

  const showDialog = ({ title = '导入文件' } = {}) => {
    state.dialogVisible = true
    state.title = title
  }

  const uploadProgress = (rawFile: any) => {
    state.uploadFileLoading = true
  }
  const uploadSuccess = (res: any, uploadFile: any, uploadFiles: any) => {
    if (res.code != 0) {
      ElMessage.error(res.msg)
      uploadFile.status = 'fail'
    }

    // 传递给父级
    props.gitFile({ data: uploadFiles })

    state.targetArr[state.fileType]['fileList'] = uploadFiles
    state.uploadFileLoading = false
  }

  const uploadError = (err: any, file: any, fileList: any) => {
    ElMessage.error('系统有点繁忙，请稍后重试！')
    state.uploadFileLoading = false
  }

  //是否可以删除
  const beforeRemove = (file: any, fileList: any) => {}

  //删除
  const remove = (uploadFile: any, uploadFiles: any) => {
    props.gitFile({ data: uploadFiles })
  }

  const setType = (name: string) => {
    if (props.upload.pictureType.accept === '') return true

    let availableSuffix = props.upload.pictureType.availableSuffix //文件后缀限制
    let index = name.lastIndexOf('.')
    let suffix = name.slice(index + 1)
    let type = availableSuffix.includes(suffix)
    return type
  }

  const beforeAvatarUpload = (rawFile: any) => {
    setType(rawFile.name)
    if (state.fileType === null) {
      ElMessage.warning('请先选择需要上传的文件类型!')
      return false
    }

    if (!setType(rawFile.name)) {
      ElMessage.warning('请上传规定的类型文件!')
      return false
    }
  }

  defineExpose({
    showDialog,
    state
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
  .file-upload {
    width: 200px;
    min-height: 50px;
  }
</style>

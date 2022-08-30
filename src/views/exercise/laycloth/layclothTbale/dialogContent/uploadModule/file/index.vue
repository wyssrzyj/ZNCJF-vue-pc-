<template>
  <el-upload
    v-if="state.fileType !== null"
    :file-list="state.targetArr[0]['fileList']"
    :accept="`${state.fileType == 5 || state.fileType == 6 ? '.jpg, .jpeg, .png, .gif' : ''}`"
    :action="state.ossAction"
    multiple
    :data="{ token: getToken() }"
    :before-upload="beforeAvatarUpload"
    :on-progress="uploadProgress"
    :on-success="uploadSuccess"
    :before-remove="beforeRemove"
    :on-error="uploadError"
  >
    <el-button icon="upload">上传文件</el-button>
    <div v-if="state.fileType !== null" class="subtip">
      <el-icon>
        <Warning />
      </el-icon>
      文件命名格式：如
    </div>
  </el-upload>
  <el-button v-else icon="upload" @click="touchoffTip">上传文件</el-button>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance } from 'vue'
  import { Warning } from '@element-plus/icons-vue'
  import { getToken } from '@njpCommon/utils/cache'
  import { ElMessage } from 'element-plus'

  // const props = defineProps<{
  //   // either: '必传且限定' | '其中一个' | '值' // 利用TS：限定父组件传 either 的值
  //   value: any[]
  //   gitFile: any
  // }>()

  const { proxy }: any = getCurrentInstance()
  // const emits = defineEmits(['on-submit-success'])

  const state = reactive({
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
    ossAction: `${proxy.$baseService.app.api}/njp-plus-admin-api/sys/oss/upload`,
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
    state.targetArr[state.fileType]['fileList'] = uploadFiles
    state.uploadFileLoading = false
  }

  const uploadError = (err: any, file: any, fileList: any) => {
    ElMessage.error('系统有点繁忙，请稍后重试！')
    state.uploadFileLoading = false
  }

  const beforeRemove = (file: any, fileList: any) => {
    state.uploadFileLoading = false
  }

  const beforeAvatarUpload = (rawFile: any) => {
    if (state.fileType === null) {
      ElMessage.warning('请先选择需要上传的文件类型!')
      return false
    }
    // const reg = /^.+_.+_.+\.[a-zA-Z0-9]+$/
    // if (!reg.test(rawFile.name)) {
    //   ElMessage.warning('请上传按“款号_阶段_序号”规则命名的文件!')
    //   return false
    // }

    if ((state.fileType === 5 || state.fileType === 6) && !(rawFile.type == 'image/jpeg' || rawFile.type == 'image/jpg' || rawFile.type == 'image/png' || rawFile.type == 'image/gif')) {
      ElMessage.warning('请上传图片类型文件!')
      return false
    }

    if (rawFile.size / 1024 / 1024 > 200) {
      ElMessage.error('文件大小不得超过 200MB!')
      return false
    }
    return true
  }

  // const handleCancel = () => {
  //   state.dialogVisible = false
  //   state.fileType = null
  //   state.targetArr = [
  //     {
  //       fileType: 0,
  //       fileList: []
  //     },
  //     {
  //       fileType: 1,
  //       fileList: []
  //     },
  //     {
  //       fileType: 2,
  //       fileList: []
  //     },
  //     {
  //       fileType: 3,
  //       fileList: []
  //     },
  //     {
  //       fileType: 4,
  //       fileList: []
  //     },
  //     {
  //       fileType: 5,
  //       fileList: []
  //     },
  //     {
  //       fileType: 6,
  //       fileList: []
  //     }
  //   ]
  // }

  const touchoffTip = () => {
    ElMessage.warning('请先选择需要上传的文件类型!')
  }

  // const handleSubmit = () => {
  //   let arr: any = []
  //   let lock = true
  //   state.targetArr.map(item => {
  //     if (item.fileList.length) {
  //       let fileList: any = []
  //       item.fileList.map(it => {
  //         if (it.status !== 'fail') {
  //           fileList.push({
  //             name: it.name,
  //             id: it.response.data.id ? it.response.data.id : it.id
  //           })
  //         }
  //       })
  //       if (fileList.length) {
  //         arr.push({
  //           fileType: item.fileType,
  //           fileList
  //         })
  //         lock = false
  //       }
  //     }
  //   })
  //   if (lock) {
  //     ElMessage.warning('请先上传符合要求的文件!')
  //     return
  //   }
  //   proxy.$baseService.post('/njp-dsr-api/dsr/dsrstyle/importStyleImage', arr).then(res => {
  //     if (res.code == 0) {
  //       ElMessage.success(res.msg)
  //       handleCancel()
  //       emits('on-submit-success')
  //     } else {
  //       ElMessage.error(res.msg)
  //     }
  //   })
  // }

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
</style>

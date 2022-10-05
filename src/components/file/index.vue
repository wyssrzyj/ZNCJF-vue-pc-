<template>
  <div v-if="disabled === true">
    <el-button icon="upload" :disabled="true">上传文件</el-button>
  </div>
  <div v-if="disabled === false">

    <div class="file-upload">
          <el-upload
      v-if="state.fileType !== null"
      :file-list="state.targetArr[0]['fileList']"
      :accept="props.pictureType.accept"
      :action="state.ossAction"
      multiple
      :headers="{ token: getToken() }"
      :before-upload="beforeAvatarUpload"
      :on-progress="uploadProgress"
      :on-success="uploadSuccess"
      :before-remove="beforeRemove"
      :on-error="uploadError"
      :limit="props.upload.limit"
      :on-preview="download"
    >
      <el-button icon="upload">上传文件</el-button>
      <div v-if="state.fileType !== null" class="subtip">
        <el-icon>
          <Warning />
        </el-icon>
        {{ props.upload.title }}
    

      </div>
    </el-upload>

    </div>

  </div>
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
    pictureType: any
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
    ossAction: `${proxy.$baseService.app.api}/jack-ics-api/oss/upload`,
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
    const a = document.createElement('a'); 
    a.style.display = 'none';       
    a.href = data;   
    document.body.appendChild(a);
    a.click();  
    document.body.removeChild(a);
  

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
  //删除
  const beforeRemove = (file: any, fileList: any) => {
    // console.log(file);
    // console.log(fileList);
    // console.log("删除");
    // state.uploadFileLoading = false
    // return false 
  }

  const setType = (name: string) => {
    if (props.pictureType.accept === '') return true

    let availableSuffix = props.pictureType.availableSuffix //文件后缀限制
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
  .file-upload{
    width: 200px;
    min-height:50px;
  }
</style>

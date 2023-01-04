<template>
  <!-- 自定义样式 -->
  <div>
    <!-- 上传 -->
    <div v-if="state.img === ''" :style="state.style" class="shelfFile-img" @click="added">
      <div class="upload-title">
        <span
          ><el-icon class="plus-icon"><Plus /></el-icon
        ></span>
        <span>上传唛架图</span>
      </div>
    </div>
    <!-- 展示 -->
    <div v-if="state.img !== ''">
      <div class="demo-image__preview">
        <el-image :style="state.style" :src="state.img" :preview-src-list="state.srcList" :initial-index="1" fit="cover" />
        <div v-if="!props.disabled" class="download" @click="beforeRemove">
          <el-icon class="download-icon"><Delete /></el-icon>
        </div>
      </div>
      <!-- 查看的时候显示下载按钮 -->
    </div>
  </div>

  <!-- 截取-隐藏样式 -->
  <div class="upload-hide">
    <el-upload
      :disabled="props.disabled"
      :file-list="state.targetArr[0]['fileList']"
      :accept="props.pictureType.accept"
      :action="state.ossAction"
      multiple
      :headers="{ token: getToken() }"
      :before-upload="beforeAvatarUpload"
      :on-progress="uploadProgress"
      :on-success="uploadSuccess"
      :before-remove="beforeRemove"
      :on-remove="remove"
      :on-error="uploadError"
      :limit="props.upload.limit"
      :on-preview="download"
    >
      <el-button id="initSlide-markerFile" :disabled="props.disabled" icon="upload">上传文件</el-button>
      <div v-if="state.fileType !== null" class="subtip">
        <el-icon>
          <Warning />
        </el-icon>
        <!-- {{ props.upload.title }} -->
      </div>
    </el-upload>
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
    disabled: boolean //是否显示按钮
    pictureType: any
    upload: any
    width?: any
  }>()

  const { proxy }: any = getCurrentInstance()
  const state: any = reactive({
    img: '', //预览
    srcList: [],
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
    ossAction: `${proxy.$baseService.app.api}/jack-ics-api/oss/analysis-mark`,
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
    uploadFileLoading: false,
    style: props.width ? `width:${props.width}vw; height: 135px` : `width: 200px; height: 135px`
  })

  watch(
    () => props.value,
    item => {
      if (!isEmpty(props.value)) {
        if (item[0].shelfImage) {
          state.img = item[0].shelfImage
          state.srcList = [item[0].shelfImage]
        }
        state.targetArr[state.fileType]['fileList'] = item
        //
      } else {
        state.img = ''
        state.uploadFileLoading = false
        state.targetArr[0]['fileList'] = []
        // props.gitFile({ data: [] }) //传递给父级
      }
    }
  )

  //自定义删除
  const beforeRemove = () => {
    state.img = ''
    state.uploadFileLoading = false
    state.targetArr[0]['fileList'] = []
    props.gitFile({ data: [] }) //传递给父级
  }

  const remove = (uploadFile: any, uploadFiles: any) => {
    props.gitFile({ data: uploadFiles })
  }

  //新增
  const added = () => {
    //initSlide-markerFile ID必须唯一 否则获取不到

    // 自定义组件 只展示样式  数据逻辑还是走原始数据流
    let e = document.createEvent('MouseEvents')
    e.initEvent('click', true, true)
    let dome: any = document.getElementById('initSlide-markerFile')
    dome.dispatchEvent(e)
  }

  //点击下载
  const download = (e: any) => {
    //后端返回的
    if (!isEmpty(e.shelfImage)) {
      ownload(e.shelfImage)
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
    const blobUrl = data
    // 这里的文件名根据实际情况从响应头或者url里获取
    const a = document.createElement('a')
    a.target = '_block'
    a.href = blobUrl
    a.download = 'w3logo'
    a.click()
    window.URL.revokeObjectURL(blobUrl)
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
    //预览图片
    state.img = uploadFiles[0].response.data.shelfImage
    state.srcList = [uploadFiles[0].response.data.shelfImage]
    // 传递给父级
    props.gitFile({ data: uploadFiles })

    state.targetArr[state.fileType]['fileList'] = uploadFiles
    state.uploadFileLoading = false
  }

  const uploadError = (err: any, file: any, fileList: any) => {
    ElMessage.error('系统有点繁忙，请稍后重试！')
    state.uploadFileLoading = false
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
  .demo-image__error .image-slot {
    font-size: 30px;
  }
  .demo-image__error .image-slot .el-icon {
    font-size: 30px;
  }
  .demo-image__error .el-image {
    width: 100%;
    height: 200px;
  }
  .markerFile-pictureImg {
    width: 100px;
    height: 100px;
  }
  .demo-image__preview {
    position: relative;
    border: 1px solid #dddddd;
    border-radius: 10px;
  }

  .download {
    cursor: pointer;
    width: 50px;
    height: 100px;
    position: relative;
    position: absolute;
    right: 0px;
    bottom: 0px;
    font-size: 28px;
    color: #409eff;
  }
  .download-icon {
    position: absolute;
    right: 7px;
    bottom: 6px;
    font-size: 24px;
    color: #409eff;
  }
  .upload-title {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #909399;
    font-size: 20px;
  }
  .plus-icon {
    font-size: 30px;
    color: #909399;
  }
  .shelfFile-img {
    border-radius: 10px;
    background: #eee;

    // background: red;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .upload-hide {
    width: 0;
    height: 0;
    overflow: hidden;
  }
  .mov {
    position: absolute;
    right: 60px;
    bottom: 0;
  }
  .delete-icon {
    font-size: 30px;
  }
</style>

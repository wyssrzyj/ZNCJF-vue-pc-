<template>
  <div v-loading.fullscreen.lock="state.loading" element-loading-text="图片上传中，请稍后！">
    <el-upload
      :file-list="state.fileList"
      :action="state.imgAction"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :headers="{ token: getToken() }"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-progress="uploadProgress"
      :on-error="uploadError"
      v-bind="$attrs"
      :on-exceed="handleExceed"
      :accept="props.pictureType.accept"
      :before-upload="beforeAvatarUpload"
      :limit="props.limit"
    >
      <el-icon><Plus /></el-icon>
      <template #file="{ file }">
        <div>
          <div class="uploadimg">
            <el-image class="bedScheduleImg" ref="previewImage" :src="file.url" :initial-index="4" fit="contain" />
            <div v-if="file.topic" class="cornermark">主图</div>
          </div>
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__it" @click="setMainPic(file)"> 设为主图 </span>
            <span class="el-upload-list__it" @click="handlePictureCardPreview(file)"> 预览 </span>
            <span class="el-upload-list__it" @click="handleRemove(file)"> 删除 </span>
          </span>
        </div>
      </template>
    </el-upload>
    <el-image-viewer
      v-if="dialogVisible"
      :initial-index="state.initialIndex"
      :infinite="false"
      :hide-on-click-modal="true"
      :url-list="state.fileList.map(item => item.url)"
      @close="dialogVisible = false"
    />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'njp-upload-images-v1'
  }
</script>

<script lang="ts" setup>
  import { ref, getCurrentInstance, watch, onMounted, toRefs } from 'vue'
  import { reactive } from 'vue'
  import type { UploadProps } from 'element-plus'
  import { getToken } from '@/utils/cache'
  import { ElMessage } from 'element-plus'
  import { cloneDeep } from 'lodash'

  const { proxy }: any = getCurrentInstance()

  const dialogVisible = ref(false)

  const props = defineProps<{
    // either: '必传且限定' | '其中一个' | '值' // 利用TS：限定父组件传 either 的值
    modelValue: any
    limit: {
      type: number
      default: 1000
    }
    imgApi: string
   pictureType: any
  }>()

  const state = reactive({
    loading: false,
    fileList: cloneDeep(props.modelValue),
    imgAction: `${proxy.$baseService.app.api}/jack-ics-api/oss/analysis-mark`, //接口
    initialIndex: 0,
    fileType:0, 
  })

  watch(
    () => state.fileList,
    v => {
      removeEl(v)
    },
    { deep: true }
  )

  const removeEl = fileList => {
    let plusEl = null
    if (!plusEl) plusEl = document.querySelector('.el-upload--picture-card')
    if (fileList.length >= props.limit) {
      plusEl.style.display = 'none'
    } else {
      plusEl.style.display = 'inline-flex'
    }
  }

  const emits = defineEmits(['update:modelValue'])

  const handleSuccess = (res, uploadFile, uploadFiles) => {

    uploadFiles[0].url=uploadFiles[0].response.data.shelfImage
    state.fileList = uploadFiles
    emits('update:modelValue', uploadFiles)
    state.loading = false
  }

  const uploadProgress = () => {
    state.loading = true
  }
  const uploadError = () => {
    state.loading = false
  }



  const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    const index = state.fileList.findIndex(item => {
      return item.url == uploadFile.url
    })
    state.fileList.splice(index, 1)
    emits('update:modelValue', formartFileList(state.fileList))
  }

  const handlePictureCardPreview: UploadProps['onPreview'] = uploadFile => {
    state.initialIndex = state.fileList.findIndex(item => item.id == uploadFile.id)
    dialogVisible.value = true
  }

  const handleExceed = files => {
    if (files) {
      ElMessage.warning(`最多上传${props.limit}张！`)
    }
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

  const setMainPic: UploadProps['setMainPic'] = uploadFile => {
    const index = state.fileList.findIndex(item => {
      return item.url == uploadFile.url
    })
    state.fileList.map(item => {
      item['topic'] = 0
    })
    state.fileList[index]['topic'] = 1
    state.fileList.unshift(state.fileList.splice(index, 1)[0])
    emits('update:modelValue', formartFileList(state.fileList))
  }

  onMounted(() => {
    removeEl(state.fileList)
  })

  defineExpose({
    ...toRefs(state)
  })
</script>

<style lang="scss" scoped>
  ::v-deep .el-upload-list--picture-card .el-upload-list__item-actions {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .el-upload-list__it {
    width: 70%;
    height: 28px;
    border: 1px solid #fff;
    border-radius: 6px;
    margin: 8px;
    font-size: 16px;
    line-height: 28px;
    text-align: center;
  }
  ::v-deep .el-upload-list--picture-card .el-upload-list__item-actions:hover span {
    display: block;
  }

  .uploadimg {
    
    position: relative;
    .cornermark {
      position: absolute;
      color: #fff;
      right: -22px;
      top: -8px;
      width: 68px;
      height: 36px;
      background: var(--el-color-success);
      text-align: center;
      transform: rotate(45deg);
      line-height: 48px;
      text-indent: 4px;
    }
  }
  .bedScheduleImg{
    width: 150px;
    height: 150px;
  }
</style>

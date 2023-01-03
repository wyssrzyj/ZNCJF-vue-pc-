<template>
  <div class="file-upload">
    <!-- 自定义样式-  -->
    <div>
      <el-table :height="130" :border="true" :data="state.tableData" :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" style="width: 100%">
        <el-table-column label="附件名称" prop="fileName" />
        <el-table-column label="附件格式" prop="format" />
        <el-table-column label="附件大小" prop="fileSize">
          <template #default="scope">
            <span>{{ scope.row.fileSize }}M</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="right">
          <template #header>
            <div>
              <div v-if="props.disabled === false" class="added" @click="added">新增</div>
              <div v-if="props.disabled === true">新增</div>
            </div>
          </template>
          <template #default="scope">
            <div class="fileAdded">
              <span class="file-download" @click="fileDownload(scope)">下载</span>
              <span v-if="props.disabled === false" class="file-delete" @click="mov(scope)">删除</span>
              <span v-if="props.disabled === true" class="file-disabled">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 备注 -->
      <div class="file-remarks">{{ props.upload.title }}</div>
    </div>
    <!-- 截取-隐藏样式 -->
    <div class="upload-hide">
      <el-upload
        v-if="state.fileType !== null"
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
        <el-button id="initSlide-file" :disabled="props.disabled" icon="upload">上传文件</el-button>
        <div v-if="state.fileType !== null" class="subtip">
          <el-icon>
            <Warning />
          </el-icon>
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
    uploadFileLoading: false,
    tableData: [] //表格数据
  })

  //自定义 数据格式处理
  const formatProcessing = (data: any) => {
    if (!isEmpty(data)) {
      data.map((item: any) => {
        item.NameType = item.name.split('.')
        item.fileName = item.NameType[0]
        item.format = item.NameType[1]
        //附件大小
        item.used = item.size / 1024 / 1024
        item.fileSize = item.used.toFixed(1) > 0 ? item.used.toFixed(1) : 0.1
      })
    }
    return data
  }
  //监听数据变化
  watch(
    () => props.value,
    item => {
      if (!isEmpty(props.value)) {
        state.targetArr[state.fileType]['fileList'] = item
        state.tableData = formatProcessing(item) //表格数据
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
    state.tableData = formatProcessing(uploadFiles) //自定义样式需要的数据

    state.targetArr[state.fileType]['fileList'] = uploadFiles //原始组件需要
    state.uploadFileLoading = false

    ElMessage({
      message: '文件添加成功',
      type: 'success'
    })
  }

  const uploadError = (err: any, file: any, fileList: any) => {
    ElMessage.error('系统有点繁忙，请稍后重试！')
    state.uploadFileLoading = false
  }

  //删除
  const beforeRemove = (file: any, fileList: any) => {
    // state.uploadFileLoading = false
    // return false
  }
  //删除
  const remove = (uploadFile: any, uploadFiles: any) => {
    props.gitFile({ data: uploadFiles })
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

  //新增
  const added = () => {
    //initSlide-file ID必须唯一 否则获取不到

    // 自定义组件 只展示样式  数据逻辑还是走原始数据流
    let e = document.createEvent('MouseEvents')
    e.initEvent('click', true, true)
    let dome: any = document.getElementById('initSlide-file')
    dome.dispatchEvent(e)
  }

  // 下载
  const fileDownload = (val: any) => {
    download(val.row)
  }

  //自定义删除
  const mov = (e: any) => {
    let fileList = state.targetArr[state.fileType]['fileList']
    let list = fileList.filter((item: any) => item.id !== e.row.id)
    state.tableData = formatProcessing(list) //表格数据
    state.targetArr[state.fileType]['fileList'] = list //原生数据
    props.gitFile({ data: list }) //传递给父级
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


  .file-upload {
    min-width: 350px;
    height: 150px;
  }
  .fileAdded {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .file-delete {
    color: #fb602d;
    cursor: pointer;
  }
  .file-download {
    color: #409eff;
    cursor: pointer;
  }
  .file-disabled {
    color: #595a5a;
  }
  .upload-hide {
    width: 0;
    height: 0;
    overflow: hidden;
  }
  .added {
    cursor: pointer;
    color: #409eff;
  }
  .file-remarks{
    margin-top: 5px;
  }
</style>

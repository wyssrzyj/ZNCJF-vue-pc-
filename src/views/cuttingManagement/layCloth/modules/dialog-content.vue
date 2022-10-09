<template>
  <div class="container">
    <div class="top">
      <p v-for="(item, i) in state.topList" :key="i" :class="state.topCurrent === i ? 'active' : ''" @click="switchMenu(i)">{{ item }}</p>
    </div>
    <div class="middle">
      <div class="left-form">
        <el-form ref="leftForm" :rules="leftFormRules" :model="state.leftForm" label-width="auto" label-position="top">
          <el-form-item label="款图" class="layclothImg">
            <UploadModule v-model="state.form.img" :disabled="disable(true)" :type="'img'" :get-data="getData" :value="state.form" />
          </el-form-item>
          <el-form-item label="款式编号">
            <el-input v-model="state.form.styleCode" :disabled="disable(true)" placeholder="请输入款式编号" type="text" />
          </el-form-item>
          <el-form-item label="款式名称">
            <el-input v-model="state.form.styleName" :disabled="disable(true)" placeholder="请输入款式名称" type="text" />
          </el-form-item>
          <el-form-item label="唛架图">
            <div class="layCloth-img">
              <UploadModule :disabled="disable(true)" :type="'shelfFile'" :get-data="getData" :value="state.form.shelfFile" :upload="upload.shelfFile" />
            </div>
          </el-form-item>
          <el-form-item label="其他附件">
            <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getAttachmentList" :value="state.form.attachmentList" :upload="upload.attachmentList" />
          </el-form-item>
        </el-form>
      </div>
      <div class="right-from">
        <!--选择设备-->
        <SelectDev v-if="state.topCurrent === 0" :type="state.type" :value="state.list.one" :set-data="setData" @changeFrom="selectDeviceSub" />
        <!--设备参数-->
        <DevParam v-if="state.topCurrent === 1" ref="devParam" :type="state.type" :value="state.list" :row="state.list.one" :set-data="setData" @changeFrom="devParamSub" />
        <!--计划时间-->
        <PlannedTime v-if="state.topCurrent === 2" ref="plannedTime" :type="state.type" :ids="state.ids" :value="state.list" :set-data="setData" @changeFrom="plannedTimeSub" />
      </div>
    </div>
    <div class="foot">
      <el-button @click="close">取消</el-button>
      <el-button :disabled="disable(false)" type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ElMessage } from 'element-plus'
  import { isEmpty, cloneDeep } from 'lodash'
  import { reactive, ref, getCurrentInstance } from 'vue'
  import type { FormRules } from 'element-plus'
  import { FormInstance } from 'element-plus'

  import SelectDev from './selectDev.vue'
  import DevParam from './devParam.vue'
  import PlannedTime from './plannedTime.vue'
  import UploadModule from './dialog-upload.vue'
  import { content } from './conifgs'

  const leftForm = ref<FormInstance>()
  const { proxy } = getCurrentInstance()

  const { formData } = content

  const props = defineProps<{
    type: any
    close: any
    row: any
  }>()

 
   
  const state: any = reactive({
    type: props.type,
    list: { one: {}, two: {}, three: {} }, //保存数据
    form: formData,
    topCurrent: 0,
    ids:{
     bedPlanId:  props.row.bedPlanId,
     deviceId:  props.row.deviceId
    }, //设备id
    topList: ['1.选择设备', '2.设备参数', '3.计划时间'],
    leftForm: {
      styleNo: '',
      styleName: ''
    },


    // 选择设备表单数据
    selectDeviceData: {},
    // 设备参数表单数据
    devParamData: {},
    // 计划时间表单数据
    plannedTimeData: {},
    //【用于未点击计划时间-》保存】
    rightForm: {
      //铺布
      spreadTaskTime: {
        planStartTime: null,
        planEndTime: null
      },
      //贴标
      pasteTaskTime: {
        planStartTime: null,
        planEndTime: null
      },
      //裁剪
      cutTaskTime: {
        planStartTime: null,
        planEndTime: null
      }
    }
  })
  
  const leftFormRules = reactive<FormRules>({
    styleName: [
      {
        required: true,
        message: '请输入款式名称',
        trigger: 'change'
      }
    ]
  })

  // const selectDevice = ref<any>(null)
  const devParam = ref<any>(null)
  const plannedTime = ref<any>(null)

  const init = () => {
    //面料名称

    //数据回显
    if (props.row) {
      proxy.$baseService.get('/jack-ics-api/spreadTask/get', { taskId: props.row.id }).then((res: any) => {
        //唛架图
        res.data.shelfFile = [
          {
            name: res.data.shelfFileName,
            shelfImage: res.data.shelfImage,
            response: {
              data: {
                src: res.data.shelfFileUrl
              }
            }
          }
        ]
        state.form = cloneDeep(res.data) //显示左侧款图
        state.list.one = res.data //初始显示数据
      })

      //设备参数
          const data = {
        bedPlanId: props.row.bedPlanId,
        deviceId: props.row.deviceId,
        spreadClothLevel: props.row.spreadClothLevel
      }
        proxy.$baseService.get('/jack-ics-api/spreadTask/getParam', data).then((res: any) => {
        if (res.code === 0) {
         setData('2', { top: res.data.spreadTaskParam, bottom: res.data.cutTaskParam })
        }
      })

      //计划时间
       if (state.ids) {
      proxy.$baseService
        .get('/jack-ics-api/spreadTask/getTime', {
          bedPlanId: state.ids.bedPlanId
        })
        .then((res: any) => {
          if (res.code === 0) {
            if (res.data.spreadTaskTime) {
              state.rightForm.spreadTaskTime = res.data.spreadTaskTime
            }
            if (res.data.pasteTaskTime) {
              state.rightForm.pasteTaskTime = res.data.pasteTaskTime
            }
            if (res.data.cutTaskTime) {
              state.rightForm.cutTaskTime = res.data.cutTaskTime
            }

            // state.rightForm = res.data
            setData('3', state.rightForm)
          }
        })
    }
    }
  }

  init()

  //切换菜单
  const switchMenu = (i: any) => {
    let bedPlanNo = state.list.one.bedPlanNo
    let deviceSn = state.list.one.deviceSn
    if (bedPlanNo && deviceSn) {
      state.topCurrent = i
    } else {
      ElMessage({
        message: '必填项不能为空',
        type: 'warning'
      })
    }
  }

  // 总数据
  const setData = (type: any, e: any) => {
    if (type === '1') {
      let cloneForm = cloneDeep(state.form) //为了图片可以渲染
      cloneForm.styleCode = e.styleCode
      cloneForm.styleName = e.styleName
      cloneForm.deviceId = e.deviceId
      // 图片
      cloneForm.img = [{ url: e.styleImage }]
      //唛架图
      if (e.shelfFile.name) {
        cloneForm.shelfFile = [
          {
            name: e.shelfFile.name,
            shelfImage: e.shelfImage, //图暂时没有
            response: {
              data: {
                src: e.shelfFile.url
              }
            }
          }
        ]
      }
      state.ids.deviceId = e.deviceId
      state.form = cloneForm
      state.list.one = e
    }
    if (type === '2') {
      state.list.two = e
    }
    if (type === '3') {
      state.list.three = e
    }
  }

  // 是否可用
  const disable = (type: any) => {
    return state.type === true ? true : type
  }
  // 上传
  const upload = reactive({
    shelfFile: { limit: 1, title: '最多上传一个' },
    attachmentList: { limit: 5, title: '最多上传5个' }
  })
  // 上传
  const getData = (e: any) => {
    if (e.type === 'img') {
      state.form.styleImage = e.data
    }
    //唛架图
    if (e.type === 'shelfFile') {
      if (!isEmpty(e.data)) {
        let shelfFile = e.data[0].response.data

        const { heigh, width, sumArea } = shelfFile
        state.form.shelfWidth = heigh //唛架门幅
        state.form.shelfLength = width //唛架长度
        state.form.spreadClothLength = Number(width) + 0.03 //铺布长度
        state.effectiveArea = sumArea //利用率
        //利用率
        state.form.attritionRate = sumArea / (heigh * Number(state.form.spreadClothLength))
        //文件传给组件
        e.data[0].response.data.src = e.data[0].response.data.shelfFileUrl

        state.form.shelfFile = e.data //赋值
      }
      // shelfWidth
    }
  }

  // 其他附件
  const getAttachmentList = (e: any) => {
    if (e.type === 'file') {
      state.form.attachmentList = e.data
    }
  }

  //判断设备参数是否为空  空不传递给后端

  const setTwo = (data: any, type: any) => {
    let top = ['forwardSpeed', 'uniformTightness', 'reduceTightness', 'crawlSpeed', 'angle', 'backSpeed', 'accelerationTightness', 'crawlTightness', 'crawlDistance', 'accelerationWeight']
    let bottom = ['minKnifeFrequency', 'maxKnifeFrequency', 'knifeSpeed', 'knifeAngle', 'minKnifeDistance', 'emptyRatio']

    if (type === 'top') {
      top.forEach(item => {
        if (data[item] === 0) {
          data[item] = null
        }
      })
    }
    if (type === 'bottom') {
      bottom.forEach(item => {
        if ([0, '0', null, undefined].includes(data[item])) {
          data[item] = null
        }
      })
    }
    return data
  }
  // 保存
  const save = () => {
    //必填项不可为空

    let bedPlanNo = state.list.one.bedPlanNo
    let deviceSn = state.list.one.deviceSn
    let rowId = !isEmpty(props.row) ? props.row.id : null
    //其他附件

    if (bedPlanNo && deviceSn) {
      let list = cloneDeep(state.form) //防止污染
      //其他附件

      if (!isEmpty(list.attachmentList)) {
        let arr: any = []

        list.attachmentList.forEach((item: any) => {
          //组件返回格式
          if (!isEmpty(item.response)) {
            arr.push({
              name: item.name,
              url: item.response.data.src,
              size: item.size,
              suffix: item.response.data.extension
            })
          } else {
            // 后端返回格式
            arr.push({
              name: item.name,
              url: item.url,
              size: item.size,
              suffix: item.suffix
            })
          }
        })
        list.attachmentList = arr
      }

      let data = {
        id: rowId,
        //附件
        attachmentList: list.attachmentList,
        // 1-
        bedPlanId: state.list.one.bedPlanId,
        deviceId: state.list.one.deviceId,

        // 2-上
        spreadTaskParam: !isEmpty(state.list.two.top) ? setTwo(state.list.two.top, 'top') : null,
        // 2-下
        cutTaskParam: !isEmpty(state.list.two.bottom) ? setTwo(state.list.two.bottom, 'bottom') : null,
        //3-时间
        bedPalnTaskTimeDTO: state.list.three
      
      }
      

      proxy.$baseService.post('/jack-ics-api/spreadTask/save', data).then((res: any) => {
        if (res.code === 0) {
          ElMessage({
            message: '保存成功',
            type: 'success'
          })
          props.close()
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    } else {
      ElMessage({
        message: '必填项不能为空',
        type: 'warning'
      })
    }
  }

  // 取消
  const close = (formEl: any) => {
    props.close()
  }
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0 10px;
    .top {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-bottom: 1px solid #eaeaea;
      padding: 0 20px 30px 10px;
      p {
        margin: 0;
        width: 244px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #bcbcbc;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1px;
        background: url('../../../../assets/images/layCloth/step-bg2.png') 100% 100% no-repeat;
        &.active {
          background: url('../../../../assets/images/layCloth/step-bg2-active.png') 100% 100% no-repeat !important;
          color: #ffffff;
        }
        &:hover {
          background: url('../../../../assets/images/layCloth/step-bg2-active.png') 100% 100% no-repeat;
          color: #ffffff;
        }
        &:nth-child(1) {
          background: url('../../../../assets/images/layCloth/step-bg1.png') 100% 100% no-repeat;
          &.active {
            background: url('../../../../assets/images/layCloth/step-bg1-active.png') 100% 100% no-repeat !important;
            color: #ffffff;
          }
        }
        &:nth-child(1):hover {
          background: url('../../../../assets/images/layCloth/step-bg1-active.png') 100% 100% no-repeat;
        }
      }
    }
    .middle {
      width: 100%;
      display: flex;
      height: 585px;
      overflow-y: auto;
      //align-items: center;
      justify-content: space-between;
      margin: 20px 0 30px 0;
      /deep/ .el-input {
        width: 250px;
      }
      .left-from {
        width: 250px;
      }
      .right-from {
        width: 555px;
      }
    }
    .foot {
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      height: 52px;
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.302);
    }
  }
  .layCloth-img {
    width: 200px;
  }
</style>

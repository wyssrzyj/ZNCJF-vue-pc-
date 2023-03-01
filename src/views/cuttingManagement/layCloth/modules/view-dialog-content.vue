<template>
  <div class="container">
    <el-form ref="leftForm" class="tops" :rules="leftFormRules" :model="state.leftForm" label-width="auto" label-position="top">
      <el-form-item label="款图">
        <UploadModule v-model="state.form.img" :disabled="disable(true)" :type="'img'" :get-data="getData" :value="state.form" />
      </el-form-item>
      <div class="top-input">
        <el-form-item label="款式编号">
          <el-input v-model="state.form.styleCode" :disabled="disable(true)" placeholder="请输入款式编号" type="text" />
        </el-form-item>
        <el-form-item label="款式名称">
          <el-input v-model="state.form.styleName" :disabled="disable(true)" placeholder="请输入款式名称" type="text" />
        </el-form-item>
      </div>

      <div class="top-shelfFile">
        <el-form-item label="唛架图">
          <!-- <div class="layCloth-img"> -->
          <UploadModule :disabled="disable(true)" :type="'shelfFile'" :get-data="getData" :value="state.form.shelfFile" :upload="upload.shelfFile" :width="59" />
          <!-- </div> -->
        </el-form-item>
      </div>
    </el-form>
    <!-- 暂时关闭  2-24 2.1版本 -->
    <!-- 选项 -->
    <!-- <div class="option">
      <div v-for="(item, i) in state.topList" :key="i" :class="item.type ? 'option-item-check' : 'option-item'" @click="option(item, i)">{{ item.name }}</div>
    </div> -->
    <!-- 内容  -->
    <div class="middle-container">
      <div class="middle">
        <!--选择设备-->
        <SelectDev v-if="state.topCurrent === 0" :type="state.type" :value="state.list.one" :set-data="setData" />
        <!-- 暂时关闭  2-24 2.1版本 -->
        <!--设备参数-->
        <!-- <DevParam v-if="state.topCurrent === 1" ref="devParam" :type="state.type" :value="state.list" :row="state.list.one" :set-data="setData" /> -->
        <!--计划时间-->
        <!-- <PlannedTime v-if="state.topCurrent === 2" ref="plannedTime" :type="state.type" :ids="state.ids" :value="state.list" :set-data="setData" /> -->

        <!-- 时间更新  新功能 -->
        <!-- <plannedTimeDemo v-if="state.topCurrent === 2" ref="plannedTime" :type="state.type" :ids="state.ids" :value="state.list" :set-data="setData"  /> -->
      </div>
      <div class="enclosure">
        <div class="enclosureTitle">其他附件</div>
        <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getAttachmentList" :value="state.form.attachmentList" :upload="upload.attachmentList" />
      </div>
    </div>

    <div class="foot">
      <el-button @click="close"> {{ state.type === false ? '取消' : '关闭' }}</el-button>
      <!-- <el-button v-if="state.type === false" type="success" :disabled="disable(false)" class="preservation" @click="submitForm('1')">审核</el-button> -->
      <el-button v-if="state.type === false" :disabled="disable(false)" type="primary" @click="submitForm('2')">保存</el-button>
      <!-- <el-button v-if="state.type === false" :disabled="disable(false)" type="primary" @click="submitForm()">DEMO</el-button> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ElMessage } from 'element-plus'
  import { isEmpty, cloneDeep } from 'lodash'
  import { useRoute, useRouter } from 'vue-router'
  import { reactive, ref, getCurrentInstance } from 'vue'
  import type { FormRules } from 'element-plus'
  import { FormInstance } from 'element-plus'

  import emits from '@njpCommon/utils/emits'
  import { EMitt } from '@njpCommon/constants/enum'
  import UploadModule from '@/components/upload/index.vue'

  import SelectDev from './selectDev.vue'
  // import DevParam from './devParam.vue'
  // import PlannedTime from './plannedTime.vue'
  // import plannedTimeDemo from './plannedTimeDemo.vue'
  import { content } from './conifgs'

  const leftForm = ref<FormInstance>()
  const { proxy } = getCurrentInstance() as any
  const route = useRoute()
  const router = useRouter()
  const { formData } = content

  // const props = defineProps<{
  //   type: any
  //   close: any
  //   row: any
  // }>()

  const state: any = reactive({
    type: false,
    list: { one: {}, two: {}, three: {} }, //保存数据
    form: formData,
    topCurrent: 0,
    ids: {
      bedPlanId: route.query.bedPlanId,
      deviceId: route.query.deviceId
    }, //设备id
    // topList: ['1.选择设备', '2.设备参数', '3.计划时间'],
    topList: [
      { name: '选择设备', type: true },
      { name: '设备参数', type: false },
      { name: '计划时间', type: false }
    ],
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
  // const devParam = ref<any>(null)
  // const plannedTime = ref<any>(null)

  //设置设备参数
  let setGetParam = (data: any) => {
    proxy.$baseService.get('/jack-ics-api/spreadTask/getParam', data).then((res: any) => {
      if (res.code === 0) {
        setData('2', { top: res.data.spreadTaskParam, bottom: res.data.cutTaskParam })
      }
    })
  }

  const init = () => {
    //面料名称
    state.type = route.query.typeValue === 'true' ? true : false
    //数据回显
    if (route.query.id) {
      proxy.$baseService.get('/jack-ics-api/spreadTask/get', { taskId: route.query.id }).then((res: any) => {
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
        res.data.img = [{ url: res.data.styleImage }]
        state.form = cloneDeep(res.data) //显示左侧款图
        state.list.one = res.data //初始显示数据
      })

      const data = {
        bedPlanId: route.query.bedPlanId,
        deviceId: route.query.deviceId,
        spreadClothLevel: route.query.spreadClothLevel
      }

      setGetParam(data)

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
              state.rightForm.isSkipPaste = res.data.isSkipPaste
              setData('3', state.rightForm)
            }
          })
      }
    }
  }

  init()

  //切换菜单
  // const option = (v: any, i: any) => {
  //   let bedPlanNo = state.list.one.bedPlanNo
  //   let deviceSn = state.list.one.deviceSn
  //   if (bedPlanNo && deviceSn) {
  //     let arr = cloneDeep(state.topList)
  //     arr.map((item: any) => {
  //       if (item.name === v.name) {
  //         item.type = true
  //       } else {
  //         item.type = false
  //       }
  //     })
  //     state.topCurrent = i
  //     state.topList = arr
  //   } else {
  //     ElMessage({
  //       message: '必填项不能为空',
  //       type: 'warning'
  //     })
  //   }
  // }

  // 总数据
  const setData = (type: any, e: any) => {
    if (type === '1') {
      let cloneForm = state.form
      cloneForm.styleCode = e.styleCode
      cloneForm.styleName = e.styleName
      cloneForm.deviceId = e.deviceId
      // 暂时注销 床次计划号逻辑 22.9.23 13-02
      // 图片
      // cloneForm.img = [{ url: e.styleImage }]
      //唛架图
      // if (e.shelfFile.name) {
      //   cloneForm.shelfFile = [
      //     {
      //       name: e.shelfFile.name,
      //       shelfImage: e.shelfImage, //图暂时没有
      //       response: {
      //         data: {
      //           src: e.shelfFile.url
      //         }
      //       }
      //     }
      //   ]
      // }
      state.ids.deviceId = e.deviceId
      state.form = cloneForm
      state.list.one = e

      const data = {
        bedPlanId: e.bedPlanId,
        deviceId: e.deviceId,
        spreadClothLevel: e.spreadClothLevel
      }
      setGetParam(data)
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

  let timeout: any
  const debounce = (func: any, wait: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func()
    }, wait)
  }
  const submitForm = (type: any) => {
    debounce(function () {
      save(type)
    }, 300)
  }

  // 取消
  const close = () => {
    emits.emit(EMitt.OnCloseCurrTab)
    router.push('/cuttingManagement/layCloth') //跳转到列表
  }

  // 保存
  const save = (type: any) => {
    //必填项不可为空
    let bedPlanNo = state.list.one.bedPlanNo
    let deviceSn = state.list.one.deviceSn
    let rowId = !isEmpty(route.query) ? route.query.id : null
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
        bedPalnTaskTimeDTO: state.list.three,

        isSkipPaste: state.list.three.isSkipPaste
      }
      let api = type === '1' ? '/jack-ics-api/spreadTask/saveAndAudit' : '/jack-ics-api/spreadTask/save'

      proxy.$baseService.post(api, data).then((res: any) => {
        if (res.code === 0) {
          ElMessage({
            message: '保存成功',
            type: 'success'
          })
          close()
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
    }
    .foot {
      background: #fff;
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
  .middle-container {
    width: 100%;
    margin-top: 10px;
    position: relative;
    // overflow-y: auto;
  }
  .enclosure {
    position: absolute;
    left: 0;
    bottom: 0;
    padding-bottom: 50px;
    width: 82vw;
    transform: translate(0, 220px);
  }

  .layCloth-file {
    width: 450px;
  }
  .enclosureTitle {
    margin-bottom: 10px;
  }

  .option {
    width: 100%;
    border-bottom: 1px solid #dddddd;
  }
  .option-item {
    cursor: pointer;
    width: 100px;
    height: 30px;
    margin-right: 5px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #dddddd;
    border-bottom: none;
  }
  .option-item-check {
    cursor: pointer;
    width: 100px;
    height: 30px;
    margin-right: 5px;
    text-align: center;
    line-height: 30px;
    background: #3e8ff7;
    color: #fff;
    border: 1px solid #dddddd;
    border-bottom: none;
  }
  /deep/ .el-input {
    width: 300px;
  }
</style>

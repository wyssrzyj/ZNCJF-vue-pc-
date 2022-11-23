<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-11-23 09:03:06
 * @Description: 
 * @LastEditors: lyj
-->

<template>
  <div>
    <div class="bedSchedule">
      <el-form ref="ruleFormRef" class="rightFormRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form">
        <!-- top -->
        <div class="top">
          <el-form-item label="款图" class="layclothImg">
            <UploadModule v-model="state.form.styleImage" :img-style="{ height: 100 }" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="state.form" />
          </el-form-item>
          <div>
            <el-form-item label="款式编号 " prop="styleCode">
              <el-input v-model="state.form.styleCode" :disabled="disable(false)" placeholder="请输入款式编号" type="text" />
            </el-form-item>
            <el-form-item label="款式名称" prop="styleName">
              <el-input v-model="state.form.styleName" :disabled="disable(false)" placeholder="请输入款式名称" type="text" />
            </el-form-item>
          </div>

          <el-form-item label="唛架图" prop="shelfFile">
            <UploadModule :disabled="disable(false)" :type="'shelfFile'" :get-data="getData" :value="state.form.shelfFile" :upload="upload.shelfFile" :width="45" />
          </el-form-item>
        </div>

        <div>
          <el-row :gutter="20" style="margin: 2px 2px 0px 10px">
            <el-col :span="8">
              <div v-for="(item, index) in state.left" :key="index">
                <div v-if="item.type === null">
                  <el-form-item :label="`${item.name}`">
                    <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
                  </el-form-item>
                </div>
                <div v-if="item.type === 'levelClothSum'">
                  <el-form-item :label="`${item.name}`">
                    <el-input-number
                      v-model="state.form[item.model]"
                      :placeholder="`请输入${item.name}`"
                      :controls="false"
                      :disabled="disable(item.disabled)"
                      controls-position="right"
                      :min="0"
                      type="text"
                    />
                  </el-form-item>
                </div>
                <div v-if="item.type === 'spreadClothLength'">
                  <el-form-item :label="`${item.name} (mm)`" :prop="item.prop">
                    <div>
                      <el-input-number
                        v-model="state.form[item.model]"
                        :placeholder="`请输入${item.name}`"
                        class="number-styleBedNo"
                        :controls="false"
                        :precision="0"
                        controls-position="right"
                        :min="0"
                        :disabled="disable(item.disabled)"
                        @change="setUtilization"
                      />
                    </div>
                  </el-form-item>
                </div>
                <div v-if="item.type === 'bedSum'">
                  <el-form-item :label="`${item.name}`">
                    <el-input-number
                      v-model="state.form[item.model]"
                      :placeholder="`请输入${item.name}`"
                      :controls="false"
                      :disabled="disable(item.disabled)"
                      controls-position="right"
                      :min="0"
                      type="text"
                    />
                  </el-form-item>
                </div>
                <div v-if="item.type === 'fabricColor'" class="parent">
                  <el-form-item :label="item.name" prop="fabricColor">
                    <div class="fabricColor">
                      <Tips title="模板：红，蓝  【如有多种颜色 按，分隔】" />
                    </div>
                    <el-input v-model="state.form[item.model]" placeholder="模板：红，蓝 " :disabled="disable(item.disabled)" type="text" @click="demo" />
                  </el-form-item>
                </div>
                <div v-if="item.type === 'shelfList'">
                  <el-form-item :label="`${item.name}`" :prop="item.prop">
                    <div class="fabricColor">
                      <Tips title="维护排唛比例后生成总件数机损耗率" />
                    </div>
                    <!-- <el-button type="primary" :disabled="disable(false)"  @click="shippingMarks">排麦比例调正</el-button> -->
                    <div class="shelfList" @click="shippingMarks">
                      <img class="bedScheduleLeft" :src="RowWheat" alt="" />
                      <div>排唛比例调整</div>
                    </div>
                  </el-form-item>
                </div>
                <div v-if="item.type === 'fabricName'">
                  <el-form-item :label="item.name" :prop="item.prop">
                    <el-select v-model="state.form[item.model]" :placeholder="`请选择${item.name}`" :disabled="disable(item.disabled)" filterable class="number-styleBedNo" @change="setFabricName">
                      <el-option v-for="item in state.fabricName" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div v-for="(item, index) in state.middle" :key="index">
                <div v-if="item.type === 'produceOrderCode'">
                  <el-form-item :label="item.name" prop="produceOrderCode">
                    <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
                  </el-form-item>
                </div>

                <div v-if="item.type === 'shelfWidth'">
                  <el-form-item :label="`${item.name}(mm)`" prop="shelfWidth">
                    <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
                  </el-form-item>
                </div>

                <div v-if="item.type === 'useRate'">
                  <el-form-item :label="`${item.name} (%)`" :prop="item.prop" class="buttonContainer">
                    <div class="fabricColor">
                      <Tips title="【选择唛架图获取有效面积】有效面积/(铺布长度*唛架门幅)" />
                    </div>

                    <el-input-number
                      v-model="state.form[item.model]"
                      :placeholder="`请输入${item.name}`"
                      class="number-styleBedNo"
                      :controls="false"
                      :precision="2"
                      controls-position="right"
                      :disabled="disable(item.disabled)"
                    />
                  </el-form-item>
                </div>

                <div v-if="item.type === null">
                  <el-form-item :label="`${item.name}`">
                    <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
                  </el-form-item>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div v-for="(item, index) in state.right" :key="index">
                <div v-if="item.type === 'bedPlanNo'">
                  <el-form-item :label="`${item.name}`" :prop="item.prop">
                    <div class="fabricColor">
                      <Tips title="数字 自动生成" />
                    </div>
                    <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
                  </el-form-item>
                </div>

                <div v-if="item.type === 'styleBedNo'">
                  <el-form-item :label="`${item.name}`" :prop="item.prop">
                    <div class="fabricColor">
                      <Tips title="根据款式自动加1" />
                    </div>

                    <el-input-number
                      v-model="state.form[item.model]"
                      :placeholder="`根据款式自动加1`"
                      class="number-styleBedNo"
                      :controls="false"
                      :disabled="disable(item.disabled)"
                      controls-position="right"
                      :min="1"
                    />
                  </el-form-item>
                </div>

                <div v-if="item.type === 'shelfLength'">
                  <el-form-item :label="`${item.name} (mm)`" :prop="item.prop">
                    <el-input-number
                      v-model="state.form[item.model]"
                      :placeholder="`请输入${item.name}`"
                      class="number-styleBedNo"
                      :controls="false"
                      :precision="0"
                      controls-position="right"
                      :min="0"
                      :disabled="disable(item.disabled)"
                    />
                  </el-form-item>
                </div>

                <div v-if="item.type === null">
                  <el-form-item :label="`${item.name}`" :prop="item.prop" class="bedPlanNo-input">
                    <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
                  </el-form-item>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-form-item label="其他附件">
          <div class="bedSchedule-file">
            <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getAttachmentList" :value="state.form.attachmentList" :upload="upload.attachmentList" />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="dialogFoot">
      <el-button @click="resetForm(ruleFormRef)"> {{ state.type === false ? '取消' : '关闭' }}</el-button>
      <el-button v-if="disable(false) && route.query.statu !== 1" type="primary" class="preservation" @click="setPrint">打印</el-button>
      <!-- <el-button v-if="!disable(false)" type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)">确认</el-button> -->

      <el-button v-if="state.type === false" type="success" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef, '1')">审核</el-button>
      <el-button v-if="state.type === false" type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef, '2')">确认</el-button>
    </div>
  </div>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :close-on-click-modal="false" :draggable="false" title="排唛比例" width="1200px">
    <PopModule :type="state.type" :operation="operation" :form="state.form" />
  </el-dialog>
  <div style="height: 0; overflow: hidden">
    <Work :id="state.printId" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'
  import print from 'print-js'
  import { useRoute } from 'vue-router'

  import UploadModule from '@/components/upload/index.vue'
  import Tips from '@/components/tips/index.vue'
  import RowWheat from '@/components/icon/rowWheat.png'
  import emits from '@njpCommon/utils/emits'
  import { EMitt } from '@njpCommon/constants/enum'

  import { content } from './conifgs'
  import { ElMessage } from 'element-plus'
  import PopModule from './dialog-forms.vue'
  import Work from './dialog-work.vue'

  import './index.less'
  const { formData, formMiddleData, formLeftData, formRightData, dataRule } = content
  const ruleFormRef = ref<any>()
  const { proxy } = getCurrentInstance() as any
  const route = useRoute()



  const state: any = reactive({
    form: formData,
    type: false,
    left: cloneDeep(formLeftData),
    middle: cloneDeep(formMiddleData),
    right: cloneDeep(formRightData),
    dialogTableVisible: false,
    //提示信息
    prop: dataRule,
    fabricName: [],
    effectiveArea: 0, //有效面积
    printId: ''
    // printType: false
  })

  const setPrint = () => {
    // if (route.query.statu !== 1) {
    print({
      printable: 'work',
      type: 'html',
      targetStyles: ['*'],
      maxWidth: 5000
    })
    // }
    //添加状态
  }

  // 上传
  const upload = reactive({
    shelfFile: { limit: 1, title: '最多上传一个' },
    attachmentList: { limit: 5, title: '最多上传5个' }
  })

  //面料名称
  const getFabricName = (name: any) => {
    let data = {
      page: 1,
      limit: 99
    }
    proxy.$baseService.get('/jack-ics-api/fabric/pageList', data).then((res: any) => {
      if (!isEmpty(res.data.list)) {
        let list: any = []
        res.data.list.forEach((item: any) => {
          list.push({
            label: item.name,
            value: item.name,
            ...item
          })
        })
        state.fabricName = list
      }
    })
  }
  //面料名称联动
  const setFabricName = (e: any) => {
    let dataClone = cloneDeep(state.fabricName)
    let arr = dataClone.filter((item: any) => item.value === e)[0]
    state.form.fabricColor = arr.color
    state.form.shelfList = [] //清除排麦比例的旧值只用联动数据
    state.form.fabricCode = arr.sn
  }
  const init = () => {
    state.type = route.query.typeValue === 'true' ? true : false
    //面料名称
    getFabricName('')
    //数据回显
    if (route.query) {
      state.printId = route.query.id
      proxy.$baseService.get('/jack-ics-api/bedPlan/get', { id: route.query.id }).then((res: any) => {
        // 图片
        res.data.img = [{ url: res.data.styleImage }]
        //唛架图
        res.data.shelfFile = [
          {
            name: res.data.shelfFile.name,
            shelfImage: res.data.shelfImage,
            response: {
              data: {
                src: res.data.shelfFile.src
              }
            }
          }
        ]

        //回显排唛比例-unique判断唯一值
        if (!isEmpty(res.data.shelfList)) {
          let shelfList = res.data.shelfList
          shelfList.map((item: any, index: any) => {
            item.unique = `${item.color}${index}`
          })
          res.data.shelfList = shelfList
        }

        let sum = res.data.shelfWidth * res.data.spreadClothLength
        state.effectiveArea = (res.data.useRate / 100) * sum //有效面积x`
        state.form = res.data
      })
    }
  }

  init()

  // 是否可用
  const disable = (type: any) => {
    return state.type === true ? true : type
  }

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
        state.form.spreadClothLength = Number(width) + 30 //铺布长度
        state.effectiveArea = sumArea //有效面积

        //利用率
        state.form.useRate = (sumArea / (heigh * Number(state.form.spreadClothLength))) * 100
        //文件传给组件
        e.data[0].response.data.src = e.data[0].response.data.shelfFileUrl

        state.form.effectiveArea = sumArea //有效面积
        state.form.shelfFile = e.data //赋值
      } else {
        state.form.shelfFile = []
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

  const setUtilization = () => {
    // (铺布长度*唛架门幅)
    let product = state.form.spreadClothLength * state.form.shelfWidth
    state.form.useRate = (state.effectiveArea / product) * 100
  }

  //排唛比例
  const shippingMarks = () => {
    let colorTitle: any = state.form.fabricColor
    let spreadClothLevel = true
    let fabricColor = false

    // spreadClothLevel = true
    // 铺布层数
    // if (Number(state.form.spreadClothLevel) > 0) {
    // } else {
    //   ElMessage({
    //     message: '铺布层数不可为空',
    //     type: 'warning'
    //   })
    // }
    // 面料颜色
    if (colorTitle) {
      let data = colorTitle.split('，')
      if (data.length === 1) {
        fabricColor = true
      }

      if (data.length > 1) {
        let pattern = /([a-zA-Z0-9]+，?)+|[\u4e00-\u9fa5]，/
        if (pattern.test(colorTitle)) {
          fabricColor = true
        } else {
          ElMessage({
            message: '请按照模板写法',
            type: 'warning'
          })
        }
      }
    } else {
      ElMessage({
        message: '面料颜色不可为空',
        type: 'warning'
      })
    }

    if (spreadClothLevel === true && fabricColor === true) {
      state.dialogTableVisible = true
    }
  }
  //去重
  let dataRepeat = (arr: any) => {
    let newArr = arr.filter(function (value: any, index: any, self: any) {
      return self.indexOf(value) === index
    })
    return newArr
  }
  //单层间数的计算
  const setLevelClothSum=(size:any,data:any)=>{
    let arr = data.filter((item:any)=>item.size===size)
    arr.map((item:any)=>{
      item.levelClothSum=item.levelClothSum===undefined?0:item.levelClothSum
    })
    let max =Math.max.apply(Math,arr.map((item:any) => { return item.levelClothSum }))
    //获取当前尺码的最大值 
    return max
  }
  //排唛比例- 保存- 数据处理
  const setShelfList = (e: any) => {
    let list = e.data

    let bedSum = 0 //床次总件数
    let levelClothSum = 0 //单层件数
    let spreadClothLevel = 0
    let data: any = { color: [], size: [], newColor: [], newSize: [] }

    //尺码
    let size = list[0].sizeAndAmountList
    if (!isEmpty(size)) {
      let sizeList: any = []
      size.map((item: any) => {
        sizeList.push({ size: item.size })
      })
      state.form.sizeList = sizeList //
    }

    if (!isEmpty(list)) {
      //床次总件数
      list.forEach((item: any) => {
        bedSum += item.bedSum
        data.color.push(item.color)
        data.size.push(item.size)
      })
      data.newColor = dataRepeat(data.color)
      data.newSize = dataRepeat(data.size)
      //单层件数----------------------------
      let levelData: any = []
       list.forEach((v:any) => {
        levelData.push(v.sizeAndAmountList)
        })
      let level=levelData.flat(Infinity)
     
      state.form.sizeList.forEach((item:any) => {
       levelClothSum+=setLevelClothSum(item.size,level)
      })
     // ----------------------------
      
      //铺布层数
      let colorData: any = []
      data.newColor.forEach((item: any) => {
        let arr = list.findIndex((v: any) => v.color === item)
        colorData.push(list[arr])
      })
      colorData.forEach((item: any) => {
        spreadClothLevel += item.spreadClothLevel
      })
      //********用于回显和保存********* */
      //数据
      state.form.shelfList = list //排唛比例数据赋值
      //**************************/
      state.form.bedSum = bedSum
      state.form.levelClothSum = levelClothSum
      state.form.spreadClothLevel = spreadClothLevel
    }
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined, type: any) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        let data = cloneDeep(state.form) //防止污染
        // 图片
        if (!isEmpty(data.styleImage)) {
          data.styleImage = data.styleImage[0].url
        } else {
          data.styleImage = ''
        }

        // 唛架图处理
        if (!isEmpty(data.shelfFile)) {
          let shelfFile = {
            name: data.shelfFile[0].name,
            url: data.shelfFile[0].response.data.src
          }
          //  唛架预览
          data.shelfImage = data.shelfFile[0].response.data.shelfImage
          data.shelfFile = shelfFile
        }

        //其他附件
        if (!isEmpty(data.attachmentList)) {
          let arr: any = []

          data.attachmentList.forEach((item: any) => {
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
          data.attachmentList = arr
        }

        // 排唛比例
        //面料名称
        let api = type === '1' ? '/jack-ics-api/bedPlan/saveAndAudit' : '/jack-ics-api/bedPlan/save'
        proxy.$baseService.post(api, data).then((res: any) => {
          if (res.code === 0) {
            ElMessage({
              message: '保存成功',
              type: 'success'
            })
            emits.emit(EMitt.OnCloseCurrTab)
          } else {
          }
        })
      }
    })
  }

  //弹窗事件
  const operation = (e: any) => {
    if (e.type === 'cancel') {
      state.dialogTableVisible = false
    }
    if (e.type === 'confirm') {
     
      e.data.map((item: any) => {
        item.type = ''
      })

      setShelfList(e)
      state.dialogTableVisible = false
    }
  }

  // 取消
  const resetForm = (formEl: any) => {
    emits.emit(EMitt.OnCloseCurrTab)
  }
</script>
<style lang="less" scoped>
  .rightFormRef {
    display: block;
    /deep/ .el-input {
      width: 22vw;
    }
  }

  .number-styleBedNo {
    /deep/ .el-input__inner {
      text-align: left !important; //输入框左对齐
    }
  }
  .top {
    width: 100%;
    height: 200px;
    display: flex;
  }
</style>

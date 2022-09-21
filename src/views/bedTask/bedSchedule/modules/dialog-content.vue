<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-09-21 12:55:41
 * @Description: 
 * @LastEditors: lyj
-->

<template>
  <el-form ref="ruleFormRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form">
    <el-row :gutter="20" style="margin: 2px 2px 0 10px">
      <!-- left -->
      <el-col :span="8">
        <el-form-item label="款图" class="layclothImg">
          <UploadModule v-model="state.form.styleImage" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="state.form" />
        </el-form-item>
        <el-form-item label="款式编号">
          <el-input v-model="state.form.styleCode" :disabled="disable(false)" placeholder="请输入款式编号" type="text" />
        </el-form-item>
        <el-form-item label="款式名称" prop="styleName">
          <el-input v-model="state.form.styleName" :disabled="disable(false)" placeholder="请输入款式名称" type="text" />
        </el-form-item>
        <el-form-item label="唛架图" prop="shelfFile">
          <UploadModule :disabled="disable(false)" :type="'shelfFile'" :get-data="getData" :value="state.form.shelfFile" :upload="upload.shelfFile" />
        </el-form-item>
        <el-form-item label="其他附件">
          <UploadModule :disabled="disable(false)" :type="'file'" :get-data="getAttachmentList" :value="state.form.attachmentList" :upload="upload.attachmentList" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <div v-for="(item, index) in state.middle" :key="index">
          <div v-if="item.type === 'produceOrderCode'">
            <el-form-item label="生产订单" prop="produceOrderCode">
              <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'fabricColor'">
            <el-form-item label="面料颜色" prop="fabricColor">
              <el-input v-model="state.form[item.model]" placeholder="模板：红，蓝 " :disabled="disable(item.disabled)" type="text">
                <template #append>
                  <el-tooltip class="box-item" effect="dark" content=" 模板：红，蓝  【如有多种颜色 按，分隔】" placement="right-start">
                    <el-icon class="filledIcon" :size="20"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="item.type === 'shelfWidth'">
            <el-form-item label="唛架门幅" prop="shelfWidth">
              <div>
                <el-input-number v-model="state.form[item.model]" controls-position="right" :precision="2" :step="0.1" :disabled="disable(item.disabled)" @change="setUtilization" />
                <span class="titleRight">米</span>
              </div>
              <!-- <el-input-number v-model="form[item.model]" :precision="2" :step="0.1" :disabled="disable(item.disabled)">
                <template #append>米</template>
              </el-input-number> -->
            </el-form-item>
          </div>
          <div v-if="item.type === 'spreadClothLevel'">
            <el-form-item label="铺布层数" prop="spreadClothLevel">
              <el-input-number v-model="state.form[item.model]" :disabled="disable(item.disabled)" controls-position="right" :min="1" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'levelClothSum'">
            <el-form-item :label="`${item.name}`">
              <el-input-number v-model="state.form[item.model]" :disabled="disable(item.disabled)" controls-position="right" :min="1" type="text" />
            </el-form-item>
          </div>
          <div v-if="item.type === 'bedSum'">
            <el-form-item :label="`${item.name}`">
              <el-input-number v-model="state.form[item.model]" :disabled="disable(item.disabled)" controls-position="right" :min="1" type="text" />
            </el-form-item>
          </div>

          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
        </div>
      </el-col>
      <!-- right -->
      <el-col :span="8">
        <div v-for="(item, index) in state.right" :key="index">
          <div v-if="item.type === 'styleBedNo'">
            <el-form-item :label="`${item.name}`" prop="styleBedNo">
              <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text">
                <template #append>
                  <el-tooltip class="box-item" effect="dark" content="数字 自动生成 生成规则：一个款式根据床次计划数量从1开始+1  不可修改 " placement="right-start">
                    <el-icon class="filledIcon" :size="20"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </div>

          <div v-if="item.type === 'fabricName'">
            <el-form-item :label="item.name" prop="fabricName" class="buttonContainer">
              <el-select v-model="state.form[item.model]" :disabled="disable(item.disabled)" filterable @change="setFabricName">
                <el-option v-for="item in state.fabricName" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>

          <div v-if="item.type === 'shelfLength'">
            <el-form-item :label="`${item.name}`" prop="shelfLength">
              <div>
                <el-input-number v-model="state.form[item.model]" controls-position="right" :precision="2" :step="0.1" :disabled="disable(item.disabled)" />
                <span class="titleRight">米</span>
              </div>
            </el-form-item>
          </div>
          <div v-if="item.type === 'spreadClothLength'">
            <el-form-item :label="`${item.name}`" prop="spreadClothLength">
              <div>
                <el-input-number v-model="state.form[item.model]" controls-position="right" :precision="2" :step="0.1" :disabled="disable(item.disabled)" @change="setUtilization" />
                <span class="titleRight">米</span>
              </div>
            </el-form-item>
          </div>
          <div v-if="item.type === 'shelfList'">
            <el-form-item :label="`${item.name}`" prop="shelfList">
              <el-icon class="bedScheduleLeft" :size="30" @click="shippingMarks"><Edit /></el-icon>
              <el-tooltip class="box-item" effect="dark" content="维护排唛比例后生成总件数机损耗率" placement="right-start">
                <el-icon class="proportionsRight" :size="20"><QuestionFilled /></el-icon>
              </el-tooltip>
            </el-form-item>
          </div>
          <div v-if="item.type === 'attritionRate'">
            <el-form-item :label="`${item.name}`" class="buttonContainer">
              <el-input-number v-model="state.form[item.model]" controls-position="right" :precision="2" :step="0.1" :disabled="disable(item.disabled)" />
              <div>
                <el-tooltip class="box-item" effect="dark" content="【选择唛架图获取有效面积】有效面积/(铺布长度*唛架门幅)" placement="right-start">
                  <el-icon class="filledIconRate" :size="20"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </div>

          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="state.form[item.model]" :disabled="disable(item.disabled)" type="text" />
            </el-form-item>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="dialogBottom">
      <el-button v-if="!disable(false)" type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)">确认</el-button>
      <el-button v-if="disable(false) && props.row.statu === 2" type="primary" class="preservation" @click="setPrint">打印</el-button>
      <el-button @click="resetForm(ruleFormRef)">取消</el-button>
    </div>
  </el-form>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" title="排唛比例" width="1000px">
    <PopModule v-if="state.dialogTableVisible" :type="props.dialogType" :operation="operation" :form="state.form" />
  </el-dialog>
  <div style="height: 0; overflow: hidden">
    <Work :id="state.printId" />
    <!-- <Work  :id="'1567443329765433346'"111 /> -->
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'
  import print from 'print-js'

  import { QuestionFilled } from '@element-plus/icons-vue'
  import { content } from './conifgs'

  import UploadModule from './dialog-upload.vue'
  import { ElMessage } from 'element-plus'
  import PopModule from './dialog-forms.vue'
  import Work from './dialog-work.vue'

  import './index.less'
  const { formData, formMiddleData, formRightData, dataRule } = content
  const ruleFormRef = ref<any>()
  const { proxy } = getCurrentInstance()

  const props = defineProps<{
    dialogType: boolean
    close: any
    row: any
  }>()

  // const form = reactive(formData)

  const state: any = reactive({
    form: formData,
    type: props.dialogType,
    middle: formMiddleData,
    right: formRightData,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule,
    fabricName: [],
    effectiveArea: 0, //有效面积
    printId: '',
    printType: false
  })

  const setPrint = () => {
    if (props.row.statu === 2) {
      state.printType = true
      print({
        printable: 'work',
        type: 'html',
        targetStyles: ['*'],
        maxWidth: 5000
      })
    }
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
            value: item.id,
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
    state.form.fabricCode = arr.sn
  }
  const init = () => {
    //面料名称
    getFabricName('')

    //数据回显
    if (props.row) {
      state.printId = props.row.id
      proxy.$baseService.get('/jack-ics-api/bedPlan/get', { id: props.row.id }).then((res: any) => {
        // 图片
        res.data.img = [{ url: res.data.styleImage }]

        //唛架图
        res.data.shelfFile = [
          {
            name: res.data.shelfFile.name,
            response: {
              data: {
                src: res.data.shelfFile.src
              }
            }
          }
        ]

        //回显排唛比例-unique判断唯一值
        if (!isEmpty(res.data.shelfList)) {
          let shelfList = cloneDeep(res.data.shelfList)
          shelfList.map((item: any, index: any) => {
            item.unique = `${item.color}${index}`
          })
          res.data.shelfList = shelfList
        }
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

  const setUtilization = () => {
    // (铺布长度*唛架门幅)
    let product = state.form.spreadClothLength * state.form.shelfWidth

    state.form.attritionRate = state.effectiveArea / product
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        let data = cloneDeep(state.form) //防止污染
        // 图片
        if (!isEmpty(data.styleImage)) {
          data.styleImage = data.styleImage[0].url
        }
        // 唛架图处理
        if (!isEmpty(data.shelfFile)) {
          let shelfFile = {
            name: data.shelfFile[0].name,
            url: data.shelfFile[0].response.data.src
          }
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

        proxy.$baseService.post('/jack-ics-api/bedPlan/save', data).then((res: any) => {
          if (res.code === 0) {
            ElMessage({
              message: '保存成功',
              type: 'success'
            })
            formEl.resetFields()
            props.close()
          } else {
          }
        })
      }
    })
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
  //排唛比例- 保存- 数据处理
  const setShelfList = (e: any) => {
    let list = e.data

    let bedSum = 0
    let levelClothSum = 0
    let spreadClothLevel = 0
    let data: any = { color: [], size: [], newColor: [], newSize: [] }
    if (!isEmpty(list)) {
      //床次总件数
      list.forEach((item: any) => {
        bedSum += item.total
        data.color.push(item.color)
        data.size.push(item.size)
      })
      data.newColor = dataRepeat(data.color)
      data.newSize = dataRepeat(data.size)
      //单层件数
      let levelData: any = []
      data.newSize.forEach((item: any) => {
        let arr = list.findIndex((v: any) => v.size === item)
        levelData.push(list[arr])
      })
      levelData.forEach((item: any) => {
        levelClothSum += item.levelClothSum
      })
      //铺布层数
      let colorData: any = []
      data.newColor.forEach((item: any) => {
        let arr = list.findIndex((v: any) => v.color === item)
        colorData.push(list[arr])
      })
      colorData.forEach((item: any) => {
        spreadClothLevel += item.spreadClothLevel
      })
      state.form.bedSum = bedSum
      state.form.levelClothSum = levelClothSum
      state.form.spreadClothLevel = spreadClothLevel
    }
  }

  //弹窗事件
  const operation = (e: any) => {
    if (e.type === 'cancel') {
      state.dialogTableVisible = false
    }
    if (e.type === 'confirm') {
      let color = e.data.map((item: any) => {
        return item.color
      })
      e.data.map((item: any) => {
        item.type = ''
      })
      state.form.shelfList = e.data

      //颜色去重
      let newArr = color.filter(function (value: any, index: any, self: any) {
        return self.indexOf(value) === index
      })
      state.form.fabricColor = newArr.join('，')

      setShelfList(e)
      state.dialogTableVisible = false
    }
  }

  // 取消
  const resetForm = (formEl: any) => {
    props.close()
    // if (!formEl) return
    formEl.resetFields()
  }
</script>

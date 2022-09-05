<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-09-05 10:13:24
 * @Description: 
 * @LastEditors: lyj111
-->

<template>
  <el-form ref="ruleFormRef" class="dialogContentForm" :rules="state.prop" :inline="true" :model="state.form" label-width="130px">
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
              <el-select v-model="state.form[item.model]" :disabled="disable(item.disabled)">
                <el-option label="面料管理" value="1" />
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
              <el-icon class="proportionsLeft" :size="30" @click="shippingMarks"><Edit /></el-icon>
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
      <el-button type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)">确认</el-button>
      <el-button @click="resetForm(ruleFormRef)">取消</el-button>
    </div>
  </el-form>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" title="排唛比例" width="1000px">
    <PopModule v-if="state.dialogTableVisible" :type="props.dialogType" :operation="operation" :form="state.form" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'

  import { QuestionFilled } from '@element-plus/icons-vue'
  import { content } from './conifgs'

  import UploadModule from './dialog-upload.vue'
  import { ElMessage } from 'element-plus'
  import PopModule from './dialog-forms.vue'
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

    effectiveArea: 100 //有效面积
  })

  // 上传
  const upload = reactive({
    shelfFile: { limit: 1, title: '最多上传一个' },
    attachmentList: { limit: 5, title: '最多上传5个' }
  })
  const init = () => {
    if (props.row) {
      proxy.$baseService.get('/jack-ics-api/bedPlan/get', { id: props.row.id }).then((res: any) => {
        // console.log(res)
        // 图片
        res.data.img = [{ url: res.data.styleImage }]
        //唛架图先使用静态数据
        res.data.shelfFile = [
          {
            name: '小心.jpg',
            response: {
              data: {
                src: 'http://10.18.4.25/20220903/f9daaa4fa8904a07875e84d3f8ad38c7.jpg',
                relativeSrc: '/20220903/f9daaa4fa8904a07875e84d3f8ad38c7.jpg',
                size: 0.05,
                extension: 'jpg'
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
        // console.log('获取接口数据', res.data)
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
      state.form.shelfFile = [
        {
          name: '小心.jpg',
          response: {
            data: {
              src: 'http://10.18.4.25/20220903/f9daaa4fa8904a07875e84d3f8ad38c7.jpg',
              relativeSrc: '/20220903/f9daaa4fa8904a07875e84d3f8ad38c7.jpg',
              size: 0.05,
              extension: 'jpg'
            }
          }
        }
      ]
    }

    if (e.type === 'file') {
      state.form.file = e.data[0]
    }
  }
  // 其他附件
  const getAttachmentList = (e: any) => {
    if (e.type === 'file') {
      // console.log('其他', e.data)
      // console.log('其他附件', e.data)

      state.form.attachmentList = []
      // console.log('其他附件', e)
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
        if (!isEmpty(state.form.styleImage)) {
          state.form.styleImage = state.form.styleImage[0].url
        }
        proxy.$baseService.post('/jack-ics-api/bedPlan/save', state.form).then((res: any) => {
          if (res.code === 200) {
            ElMessage({
              message: '保存成功',
              type: 'success'
            })
            formEl.resetFields()

            props.close()
          } else {
            // console.log(res.msg)
          }
        })
      }
    })
  }

  //排唛比例
  const shippingMarks = () => {
    let colorTitle: any = state.form.fabricColor
    let spreadClothLevel = false
    let fabricColor = false
    // 铺布层数
    if (Number(state.form.spreadClothLevel) > 0) {
      spreadClothLevel = true
    } else {
      ElMessage({
        message: '铺布层数不可为空',
        type: 'warning'
      })
    }
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
      state.form.fabricColor = color.join('，') //颜色更新

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

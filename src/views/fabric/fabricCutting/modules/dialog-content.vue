<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-02-04 14:53:25
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="fabricCutting">
    <el-row :gutter="30" style="margin: 2px 2px 0 10px">
      <!-- form -->
      <el-col :span="7">
        <div class="fabricCutting-left">
          <el-form ref="ruleFormRef" label-position="top" class="FabricLayingForm" :rules="state.prop" :inline="true" :model="state.form" label-width="130px">
            <el-form-item label="模板面料图片" class="layclothImg" prop="img">
              <UploadModule v-model="state.form.img" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="state.form" />
            </el-form-item>
            <el-form-item label="参数模板编号" prop="sn">
              <el-input v-model="state.form.sn" :disabled="disable(false)" placeholder="请输入款式编号" type="text" />
            </el-form-item>
            <el-form-item label="参数模板名称" prop="name">
              <el-input v-model="state.form.name" :disabled="disable(false)" placeholder="请输入款式名称" type="text" />
            </el-form-item>
            <el-form-item label="面料类型" prop="fabricType">
              <el-select v-model="state.form.fabricType" :disabled="disable(false)" :placeholder="`请选择面料类型`" @change="change">
                <el-option v-for="item in state.fabricType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="面料克重(g/m²)" prop="fabricWeight">
              <FabricWeight v-model="state.form.fabricWeight" :data="state.form" :type="state.type" :fabric-weight="fabricWeight" />
            </el-form-item>
            <el-form-item label="关联面料">
              <RelatedFabric :form="state.form" :type="state.type" :set-fabric="setFabric" />
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <!-- 自定义 -->
      <el-col :span="17" class="dialogBottomRight">
        <Option :init-form="state.initForm" :type="state.type" :data="state.form" :get-list="getList" />
      </el-col>
    </el-row>
  </div>

  <div class="fabricCuttingBottom"></div>

  <div class="fabricCuttingFoot">
    <el-button @click="resetForm(ruleFormRef)"> {{ state.type === false ? '取消' : '关闭' }}</el-button>
    <el-button v-if="state.type === false" type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)">确认</el-button>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'
  import { content } from './conifgs'
  import './index.less'
  import { ElMessage } from 'element-plus'
  import { fabricType } from '@/components/conifgs'

  import UploadModule from '@/components/upload/index.vue'
  import FabricWeight from './dialog-content-weight.vue'
  import Option from './dialog-content-right.vue'
  import RelatedFabric from './dialog-content-fabric.vue'
  const { proxy } = getCurrentInstance() as any

  const ruleFormRef = ref<any>()
  const { formData, dataRule } = content

  const props = defineProps<{
    dialogType: boolean
    close: any
    row: any
  }>()

  const state = reactive({
    form: cloneDeep(formData),
    initForm: cloneDeep(formData),
    type: props.dialogType,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule,
    fabricType: fabricType
  })

  //处理参数文件回显
  let setLevelParamVOList = (list: any) => {
    if (!isEmpty(list)) {
      list.map((item: any) => {
        let arr = item.cutTemplateParam
        if (isEmpty(arr.attachmentList)) {
          if (arr.paramFileName) {
            arr.attachmentList = [
              {
                name: arr.paramFileName,
                response: {
                  data: { src: arr.paramFile }
                }
              }
            ]
          }
        }
        item.cutTemplateParam = arr
      })
      return list
    }
  }

  const init = () => {
    //获取接口数据赋值form
    if (!isEmpty(props.row)) {
      proxy.$baseService.get('/jack-ics-api/cutTemplateParam/get', { templateId: props.row.id }).then((res: any) => {
        let arr = res.data
        const { sn, name, fabricType, imageUrl, fabricWeightMin, fabricWeightMax } = arr.templateDTO
        //赋值
        arr.sn = sn
        arr.name = name
        arr.fabricType = fabricType
        arr.img = [{ url: imageUrl }]
        arr.fabricWeight = { left: Number(fabricWeightMin), right: Number(fabricWeightMax) }
        arr.fabricType = arr.fabricType.toString()

        //处理参数文件回显
        arr.levelParamVOList = setLevelParamVOList(arr.levelParamVOList)

        if (!isEmpty(arr.templateDTO)) {
          state.form.relationFabricList = arr.templateDTO.relationFabricList
        }
        state.form = arr
        state.initForm = arr
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
      state.form.img = e.data
    }
  }
  //面料克重 赋值
  const fabricWeight = (e: any) => {
    state.form.fabricWeight = e
    state.form.fabricWeightMin = e.left
    state.form.fabricWeightMax = e.right
    const cloneForm = cloneDeep(state.form)
    //类型、克重操作重置面料
    if (!isEmpty(props.row)) {
      cloneForm.templateDTO.relationFabricList = []
    }

    state.form = cloneForm
  }
  //  面料类型 赋值
  const change = (e: any) => {
    state.form.fabricType = e
    const cloneForm = cloneDeep(state.form)
    //类型、克重操作重置面料
    if (!isEmpty(props.row)) {
      cloneForm.templateDTO.relationFabricList = []
    }

    state.form = cloneForm
  }
  //关联面料
  const setFabric = (e: any) => {
    state.form.relationFabricList = e
  }

  //参数文件是否 填写
  const parameterFile = (list: any) => {
    let arr = list.filter((item: any) => isEmpty(item.cutTemplateParam.attachmentList))

    if (!isEmpty(arr)) {
      let title: any = []
      arr.forEach((v: any) => {
        title.push(v.title)
      })
      ElMessage({
        message: `必填项不能为空,【${title.join('，')}】`,
        type: 'warning'
      })

      return false
    } else {
      return true
    }
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        const { fabricType, fabricWeightMax, fabricWeightMin, img, name, sn } = state.form

        //判断必填项是否填写
        if (parameterFile(state.form.levelParamVOList)) {
          let arr = {
            templateDTO: {
              id: props.row.id,
              fabricType: Number(fabricType),
              fabricWeightMax: Number(fabricWeightMax),
              fabricWeightMin: Number(fabricWeightMin),
              imageUrl: !isEmpty(img) ? img[0].url : '',
              name: name,
              sn: sn,
              relationFabricList: !isEmpty(state.form.relationFabricList) ? state.form.relationFabricList : []
            },
            levelParamVOList: state.form.levelParamVOList
          }
          // 格式处理
          proxy.$baseService.post('/jack-ics-api/cutTemplateParam/save', arr).then((res: any) => {
            if (res.code === 0) {
              ElMessage({
                message: '保存成功',
                type: 'success'
              })
              formEl.resetFields()
              props.close('preservation')
            } else {
              ElMessage({
                message: res.msg,
                type: 'warning'
              })
            }
          })
        }
      }
    })
  }

  const getList = (e: any) => {
    state.form.levelParamVOList = e
  }
  // 取消
  const resetForm = (formEl: any) => {
    formEl.resetFields()
    props.close()
  }
</script>
<style lang="less" scoped>
  /deep/ .el-input__inner {
    text-align: left !important; //输入框左对齐
  }
  .fabricCuttingBottom {
    width: 10px;
    height: 50px;
  }
</style>

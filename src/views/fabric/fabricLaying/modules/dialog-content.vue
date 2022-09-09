<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2022-09-08 19:03:12
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-row :gutter="70" style="margin: 2px 2px 0 20px">
    <!-- form -->
    <el-col :span="8">
      <div>
        <el-form ref="ruleFormRef" class="dialogContentForm" :rules="state.prop" :inline="true" :model="state.form" label-width="130px">
          <el-form-item label="模板面料图片" class="layclothImg" prop="img">
            <UploadModule v-model="state.form.img" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="state.form" />
          </el-form-item>
          <br />
          <el-form-item label="参数模板编号" prop="sn">
            <el-input v-model="state.form.sn" :disabled="disable(false)" placeholder="请输入款式编号" type="text" />
          </el-form-item>
          <el-form-item label="参数模板名称" prop="name">
            <el-input v-model="state.form.name" :disabled="disable(false)" placeholder="请输入款式名称" type="text" />
          </el-form-item>
          <el-form-item label="面料类型" prop="fabricType">
            <el-select v-model="state.form.fabricType" :disabled="disable(false)" @change="change">
              <el-option v-for="item in state.fabricType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="面料克重" prop="fabricWeight">
            <FabricWeight v-model="state.form.fabricWeight" :data="state.form" :type="state.type" :fabric-weight="fabricWeight" />
          </el-form-item>
          <el-form-item label="关联面料">
            <RelatedFabric :form="state.form" :type="state.type" :set-fabric="setFabric" />
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <!-- 自定义 -->
    <el-col :span="16" class="dialogBottomRight">
      <Option :init-form="state.initForm" :type="state.type" :data="state.form" :get-list="getList" />
    </el-col>
    <div class="dialogBottom">
      <el-button type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)"> 确认 </el-button>
      <el-button @click="resetForm(ruleFormRef)">取消</el-button>
    </div>
  </el-row>
</template>
<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'
  import { content } from './conifgs'
  import './index.less'
  import { ElMessage } from 'element-plus'
  import { fabricType } from '@/components/conifgs.ts'

  import UploadModule from './dialog-upload.vue'
  import FabricWeight from './dialog-content-weight.vue'
  import Option from './dialog-content-right.vue'
  import RelatedFabric from './dialog-content-fabric.vue'
  const { proxy } = getCurrentInstance()

  const ruleFormRef = ref<any>()
  const { formData, dataRule } = content

  const props = defineProps<{
    dialogType: boolean
    close: any
    current: any
    row: any
  }>()

  const state = reactive({
    form: formData,
    initForm: formData, //只用作初始展示
    type: props.dialogType,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule,
    fabricType: fabricType
  })

  const processInitialData = (data: any) => {
    // 初始 数据格式转换
    const dataFormatConversion = (item: any, title: any) => {
      let data = !isEmpty(item.split(',')) ? item.split(',') : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      let table = {
        date: title,
        one: data[0],
        two: data[1],
        three: data[2],
        four: data[3],
        five: data[4],
        six: data[5],
        seven: data[6],
        eight: data[7],
        nine: data[8],
        ten: data[9]
      }
      return table
    }

    //添加表格
    const setSpreadTemplateParam = (item: any) => {
      item.bottomTable = [dataFormatConversion(item.uniform, '布斗匀速'), dataFormatConversion(item.acceleration, '布斗加速'), dataFormatConversion(item.reduce, '布斗减速')]
      return item
    }

    // 右边处理
    if (!isEmpty(data.levelParamVOList)) {
      data.levelParamVOList.map((item: any) => {
        item.type = Number(item.type)
        item.spreadTemplateParam = setSpreadTemplateParam(item.spreadTemplateParam)
      })
    }

    return data
  }
  const init = () => {
    //获取接口数据赋值form
    if (!isEmpty(props.row)) {
      proxy.$baseService.get('/jack-ics-api/spreadTemplateParam/get', { templateId: props.row.id }).then((res: any) => {
        let arr = res.data
        const { sn, name, fabricType, imageUrl, fabricWeightMin, fabricWeightMax } = arr.templateDTO
        //赋值
        arr.sn = sn
        arr.name = name
        arr.fabricType = fabricType
        arr.img = [{ url: imageUrl }]
        arr.fabricWeight = { left: Number(fabricWeightMin), right: Number(fabricWeightMax) }

        state.form = processInitialData(arr)
        state.initForm = processInitialData(arr)
        // console.log("初始数据", state.form );
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
    // console.log('最终展示', e)
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
    state.form = cloneForm
  }
  //  面料类型 赋值
  const change = (e: any) => {
    state.form.fabricType = e
    const cloneForm = cloneDeep(state.form)
    state.form = cloneForm
  }

  //关联面料
  const setFabric = (e: any) => {
    state.form.relationFabricList = e
  }

  // 保存table数据格式转换
  const changeStructure = (v: any) => {
    const getTable = (e: any) => {
      let condition = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
      let data: any = []
      condition.forEach((item: any) => {
        data.push(e[item])
      })
      return data.toString()
    }

    let cloneData = cloneDeep(v)

    cloneData.map((item: any) => {
      if (!isEmpty(item.spreadTemplateParam.bottomTable)) {
        item.spreadTemplateParam.minLevel = item.spreadTemplateParam.minLevel.toString()
        item.spreadTemplateParam.maxLevel = item.spreadTemplateParam.maxLevel.toString()
        item.spreadTemplateParam.uniform = getTable(item.spreadTemplateParam.bottomTable[0]) //匀速
        item.spreadTemplateParam.acceleration = getTable(item.spreadTemplateParam.bottomTable[1]) //加速
        item.spreadTemplateParam.reduce = getTable(item.spreadTemplateParam.bottomTable[2]) //减速
      }
    })

    return cloneData
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        const { fabricType, fabricWeightMax, fabricWeightMin, img, name, sn } = state.form
        // 格式处理
        let arr = {
          templateDTO: {
            id: props.row.id,
            fabricType: Number(fabricType),
            fabricWeightMax: Number(fabricWeightMax),
            fabricWeightMin: Number(fabricWeightMin),
            imageUrl: !isEmpty(img) ? img[0].url : '',
            name: name,
            sn: sn,
            relationFabricList: state.form.relationFabricList
          },
          levelParamVOList: changeStructure(state.form.levelParamVOList)
        }
        proxy.$baseService.post('/jack-ics-api/spreadTemplateParam/save', arr).then((res: any) => {
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

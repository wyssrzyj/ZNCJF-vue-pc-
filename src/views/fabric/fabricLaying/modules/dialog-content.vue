<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-02-02 16:13:20
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="fabricLaying">
    <el-row :gutter="70" style="margin: 2px 2px 0 20px">
      <!-- form -->
      <el-col :span="6">
        <div class="fabricLaying-left">
          <el-form ref="ruleFormRef" class="FabricLayingForm" label-position="top" :rules="state.prop" :inline="true" :model="state.form" label-width="130px">
            <el-form-item label="模板面料图片" prop="img">
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
      <el-col :span="18" class="dialogBottomRight">
        <Option :init-form="state.initForm" :type="state.type" :data="state.form" :get-list="getList" />
      </el-col>
    </el-row>
  </div>
  <div  class="fabricLayingBottom">

  </div>
  <div class="fabricLayingFoot">
    <el-button @click="resetForm(ruleFormRef)"> {{ state.type === false ? '取消' : '关闭' }}</el-button>
    <el-button v-if="state.type === false" type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)">确认</el-button>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { isEmpty, cloneDeep } from 'lodash'
  import { ElMessage } from 'element-plus'

  import { fabricType } from '@/components/conifgs'
  import UploadModule from '@/components/upload/index.vue'

  import { content } from './conifgs'
  import FabricWeight from './dialog-content-weight.vue'
  import Option from './dialog-content-right.vue'
  import RelatedFabric from './dialog-content-fabric.vue'
  import './index.less'
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
    initForm: cloneDeep(formData), //只用作初始展示
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
        arr.fabricType = arr.fabricType.toString()

        if (!isEmpty(arr.templateDTO)) {
          // if (!isEmpty(arr.templateDTO.relationFabricList)) {
          state.form.relationFabricList = arr.templateDTO.relationFabricList
          // }
        }
        state.form = processInitialData(arr)

        state.initForm = processInitialData(arr)
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

  //参数文件是否 填写
  // const parameterFile = (list: any) => {
  //   let arr = list.filter((item: any) => isEmpty(item.spreadTemplateParam.attachmentList))

  //   if (!isEmpty(arr)) {
  //     let title: any = []
  //     arr.forEach((v: any) => {
  //       title.push(v.title)
  //     })
  //     ElMessage({
  //       message: `必填项不能为空,【${title.join('，')}】`,
  //       type: 'warning'
  //     })

  //     return false
  //   } else {
  //     return true
  //   }
  // }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        const { fabricType, fabricWeightMax, fabricWeightMin, img, name, sn } = state.form
        // 格式处理
        // if (parameterFile(state.form.levelParamVOList)) {
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
      // }
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
    .fabricLayingBottom{
      height: 55px;
    }
</style>
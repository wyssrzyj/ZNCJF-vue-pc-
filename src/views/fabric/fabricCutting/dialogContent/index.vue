<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-08-29 10:59:30
 * @Description: 
 * @LastEditors: lyj
-->
<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2022-08-17 13:38:19
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
            <UploadModule v-model="state.form.img" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="state.form.img" />
          </el-form-item>
          <el-form-item label="参数模板编号" prop="templateNumber">
            <el-input v-model="state.form.templateNumber" :disabled="disable(false)" placeholder="请输入款式编号" type="text" />
          </el-form-item>
          <el-form-item label="参数模板名称" prop="templateName">
            <el-input v-model="state.form.templateName" :disabled="disable(false)" placeholder="请输入款式名称" type="text" />
          </el-form-item>
          <el-form-item label="面料类型" prop="fabricType">
            <el-select v-model="state.form.fabricType" :disabled="disable(false)">
              <el-option label="针织" value="1" />
              <el-option label="梭织" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="面料克重" prop="fabricWeight">
            <FabricWeight v-model="state.form.fabricWeight" :type="state.type" :fabric-weight="fabricWeight" />
          </el-form-item>
          <el-form-item label="关联面料">
            <RelatedFabric :type="state.type" :set-fabric="setFabric" />
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <!-- 自定义 -->
    <el-col :span="16" class="dialogBottomRight">
      <Option :type="state.type" :data="state.form.levelParamVOList" />
    </el-col>
    <div class="dialogBottom">
      <el-button type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)"> 确认 </el-button>
      <el-button @click="resetForm(ruleFormRef)">取消</el-button>
    </div>
  </el-row>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { formData, dataRule } from './conifgs'
  import './index.css'
  import UploadModule from './uploadModule/index.vue'
  import FabricWeight from './fabricWeight/index.vue'
  import Option from './option/index.vue'
  import RelatedFabric from './relatedFabric/index.vue'
  import { isEmpty } from 'lodash'

  const ruleFormRef = ref<any>()

  const props = defineProps<{
    dialogType: boolean
    close: any
    current: any
  }>()

  const state = reactive({
    form: formData,
    type: props.dialogType,
    dialogTableVisible: false,
    //提示信息
    prop: dataRule
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
        item.spreadTemplateParam = setSpreadTemplateParam(item.spreadTemplateParam)
      })
    }

    return data
  }
  const init = () => {
    //获取接口数据赋值form
    let res: any = {
      img: [
        {
          fileName: 'file.name',
          doc: 'data.src',
          url: 'http://localhost:9000/assets/dsrlogonav.20af6bbe.png',
          name: 'file.name'
        }
      ],
      templateNumber: '参数模板编号11',
      templateName: '参数模板名称',
      fabricType: '1',
      fabricWeight: '',
      relatedFabric: '关联面料',
      levelParamVOList: [
        {
          levelName: '1~20',
          spreadTemplateParam: {
            id: 1562968510160236545,
            creator: 1067246875800000001,
            createDate: '2022-08-26T01:01:46.000+00:00',
            updater: 1067246875800000001,
            updateDate: '2022-08-26T01:01:46.000+00:00',
            deletedFlag: 1,
            tenantCode: 1001,
            templateId: 1562968510021824514,
            minLevel: '1', //最小
            maxLevel: '20', //最大
            forwardSpeed: 20.5, //前进速度
            backSpeed: 7.0, //后退速度
            uniformTightness: '300', //匀速松紧值
            accelerationTightness: '加速松紧值', //加速松紧值
            reduceTightness: '减速松紧值', //减速松紧值
            crawlTightness: '爬行松紧值', //爬行松紧值
            crawlSpeed: '爬行速度', //爬行速度
            crawlDistance: '爬行距离', //爬行距离
            angle: '20', //部都目标角度
            accelerationWeight: '加速权重', //加速权重
            uniform: '10,20,2,3,4,5,6,7,8,9', //匀速
            acceleration: '85,1,2,3,4,5,6,7,8,9', //加速
            reduce: '66,1,2,3,4,5,6,7,8,9', //减速
            cutSpeed: 0.1,
            cutLength: 10.5,
            remark: ''
          }
        },
        {
          levelName: '1~20',
          spreadTemplateParam: {
            id: 1562968510160236545,
            creator: 1067246875800000001,
            createDate: '2022-08-26T01:01:46.000+00:00',
            updater: 1067246875800000001,
            updateDate: '2022-08-26T01:01:46.000+00:00',
            deletedFlag: 1,
            tenantCode: 1001,
            templateId: 1562968510021824514,
            minLevel: '50', //最小
            maxLevel: '70', //最大
            forwardSpeed: 20.5, //前进速度
            backSpeed: 7.0, //后退速度
            uniformTightness: '300', //匀速松紧值
            accelerationTightness: '加速松紧值', //加速松紧值
            reduceTightness: '减速松紧值', //减速松紧值
            crawlTightness: '爬行松紧值', //爬行松紧值
            crawlSpeed: '爬行速度', //爬行速度
            crawlDistance: '爬行距离', //爬行距离
            angle: '20', //部都目标角度
            accelerationWeight: '加速权重', //加速权重
            uniform: '55,1,2,3,4,5,6,7,8,9', //匀速
            acceleration: '55,1,2,3,4,5,6,7,8,9', //加速
            reduce: '75,1,2,3,4,5,6,7,8,9', //减速
            cutSpeed: 0.1,
            cutLength: 10.5,
            remark: ''
          }
        }
      ]
    }

    // console.log(processInitialData(res))
    //赋值
    state.form = processInitialData(res)
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
  }
  //关联面料
  const setFabric = (e: any) => {
    state.form.relatedFabric = e
    // console.log(e)
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        // console.log('成功', state.form)
        // close()
      }
    })
  }

  //弹窗事件
  // const operation = (e: any) => {
  //   if (e.type === 'cancel') {
  //     state.dialogTableVisible = false
  //   }
  //   if (e.type === 'confirm') {
  //     //获取子项数据 proportions
  //     // form.proportions = e.data
  //     state.dialogTableVisible = false
  //   }
  // }

  // 取消
  const resetForm = (formEl: any) => {
    props.close()
    // if (!formEl) return
    formEl.resetFields()
  }
</script>

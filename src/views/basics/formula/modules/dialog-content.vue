<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-03-15 08:46:12
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="ruleFormRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form">
    <el-row :gutter="20" style="margin: 2px 2px 0 10px">
      <el-col :span="16">
        <div class="equipment">
          <div class="equipment-top">
            <div>
              <div v-for="(item, index) in state.middle" :key="index">
                <div v-if="item.type === 'input'">
                  <el-form-item :label="`${item.name}`" :prop="item.prop">
                    <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
                  </el-form-item>
                </div>

                <div v-if="item.type === 'type'">
                  <el-form-item :label="item.name" :prop="item.prop" class="buttonContainer">
                    <el-select v-model="state.form[item.model]" :placeholder="`请选择${item.name}`" :disabled="disable(item.disabled)" @change="(e:any)=>{change(e,'new')}">
                      <el-option v-for="v in state.equipmentType" :key="v.id" :label="v.name" :value="v.id" />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>
            <!-- right -->
            <div>
              <div v-for="(item, index) in state.right" :key="index">
                <div v-if="item.type === 'input'">
                  <el-form-item :label="`${item.name}`" :prop="item.prop">
                    <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
                  </el-form-item>
                </div>

                <div v-if="item.type === 'resourceFormulaList'">
                  <el-form-item :label="item.name" :prop="item.prop" class="buttonContainer">
                    <el-select v-model="state.form[item.model]" multiple collapse-tags :placeholder="`请选择${item.name}`" :disabled="state.form.type ? false : true">
                      <el-option v-for="v in state.applyList" :key="v.id" :label="v.name" :value="v.id" />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <!-- 公式选择 -->
          <el-form-item :label="`公式选择`" prop="remark" class="equipment-spec">
            <div class="equipment-bottom-top" @click="setDialogType"><span>公式</span><span :class="!state.type ? 'equipment-bottom-top-right' : 'equipment-bottom-top-right-no'">选择公式</span></div>
            <div class="equipment-bottom-bottom">
              <span>{{ state.formulaContent.value }}</span>
            </div>
            <div class="equipment-bottom-checkbox"><el-checkbox v-model="state.form.defaultFlag" label="设为默认公式" size="large" :disabled="disable(false)" /></div>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="formula-right">
          <div>公式参数(自动获取)</div>
          <br />
          <div v-for="(item, index) in state.parameters" :key="index" class="parameters">
            <div class="parameters-left">{{ item.name }} :</div>
            <el-input v-model="item.value" type="text" :disabled="item.type" />
          </div>
        </div>
      </el-col>
    </el-row>
  </el-form>

  <div class="formula-foot"></div>
  <div class="equipmentFoot">
    <el-button @click="resetForm(ruleFormRef)"> {{ state.type === false ? '取消' : '关闭' }}</el-button>
    <el-button v-if="state.type === false" type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)">确认</el-button>
  </div>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :draggable="false" :close-on-click-modal="false" title="公式选择" width="800px">
    <Dialog :operation="operation" :value="state.formulaContent" :form="state.form" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import { isEmpty, cloneDeep } from 'lodash'

  import { equipmentType } from '@/components/conifgs'
  import Dialog from './dialog-formula.vue'
  import { content, parameters } from './conifgs'

  import './index.less'

  const { formData, formMiddleData, formRightData, dataRule } = content

  const ruleFormRef = ref<any>()
  const { proxy } = getCurrentInstance() as any
  const props = defineProps<{
    dialogType: boolean
    close: any
    row: any
  }>()

  const state: any = reactive({
    form: formData,

    applyList: [], //适用资源
    parameters: parameters, //右侧公式参数

    type: props.dialogType,
    middle: formMiddleData,
    right: formRightData,
    equipmentType: equipmentType,
    prop: dataRule,

    dialogTableVisible: false, //公式弹窗
    formulaContent: { name: '', value: 'init' }
  })

  const init = () => {
    state.form.defaultFlag = false
    if (props.row.id) {
      proxy.$baseService.get('/jack-ics-api/formulaContainer/get', { containerId: props.row.id }).then((res: any) => {
        // 回显
        state.formulaContent.value = res.data.showContent
        res.data.defaultFlag = res.data.defaultFlag ? true : false
        res.data.type = res.data.type.toString()
        state.form = res.data
        // 公式参数
        let paramList = state.form.formulaParamList
        if (!isEmpty(paramList)) {
          let data: any = []
          paramList.forEach((item: any) => {
            if (item.paramValue === '0') {
              data.push({ name: item.paramName, value: item.paramValue, type: true })
            } else {
              //查看全部不可操作
              if (state.type) {
                data.push({ name: item.paramName, value: item.paramValue, type: true })
              } else {
                data.push({ name: item.paramName, value: item.paramValue, type: false })
              }
            }
          })
          state.parameters = data
          //获取适用资源
          let type = state.form.type
          if (type) {
            change(type, 'init')
          }
        }
      })
    }
    //获取适用设备
  }
  init()
  //获取适用设备
  const change = (e: any, type: any) => {
    proxy.$baseService.get('/jack-ics-api/formulaContainer/getResource', { type: e }).then((res: any) => {
      state.applyList = res.data
    })
    if (type === 'new') {
      state.form.resourceFormulaList = []
    }
  }
  // 是否可用
  const disable = (type: any) => {
    return state.type === true ? true : type
  }

  // 表单提交
  const submitForm = async (formEl: any | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
      let formData = cloneDeep(state.form)
      if (valid) {
        // 显示的公式
        formData.showContent = state.formulaContent.value
        // 公式id
        formData.formulaId = state.formulaContent.id
        // 默认公式标识
        formData.defaultFlag = Number(formData.defaultFlag)
        
        // 公式参数
        let parameters: any = []
        if (!isEmpty(state.parameters)) {
          state.parameters.forEach((item: any) => {
            if (item.value>0) {
              parameters.push({
                paramName: item.name,
                paramValue: Number(item.value)
              })
            }
          })
        }
        formData.formulaParamList = parameters
        // 适用资源
        let newResourceFormulaList: any = [] //适用资源的数据
        let formResourceFormula: any = [] //form保存使用的适用资源的数据

        if (!isEmpty(state.form.resourceFormulaList)) {
          state.form.resourceFormulaList.forEach((item: any) => {
            let arr = state.applyList.filter((v: any) => v.id == item)
            newResourceFormulaList = [...newResourceFormulaList, ...arr]
          })
        }

        newResourceFormulaList.forEach((item: any) => {
          formResourceFormula.push({
            resourceId: item.id,
            resourceType: item.type
          })
        })
        formData.resourceFormulaList = formResourceFormula
        // 准备处理数据
        // formulaParamList 公式参数
        // resourceFormulaList 多选的那个
        proxy.$baseService.post('/jack-ics-api/formulaContainer/save', formData).then((res: any) => {
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
  //打开弹窗
  const setDialogType = () => {
    if (!state.type) {
      if (state.form.type) {
        state.dialogTableVisible = true
      } else {
        ElMessage({
          message: '请选择计算类型',
          type: 'warning'
        })
      }
    }
  }
  //处理公式参数
  const setParameters = (e: any) => {
    let list = e.data.formulaParam.split(',')
    if (!isEmpty(list)) {
      let data: any = []
      list.map((item: any) => {
        let value = item.split(':')
        if (value[1] === '0') {
          data.push({ name: value[0], value: '', type: true })
        } else {
          data.push({ name: value[0], value: '', type: false })
        }
      })
      state.parameters = data
    }
  }
  //弹窗事件
  const operation = (e: any) => {
    if (e.type===true) {
      //当前和上一次选中的不同【做处理】
      let current = e.data.value
      let last = state.formulaContent.value
      if (current !== last) {
        state.formulaContent = e.data
        if (!isEmpty(e.data)) {
          setParameters(e)
        }
      }
      state.dialogTableVisible = false
    } else {
      state.dialogTableVisible = false
    }
  }
  // 取消
  const resetForm = (formEl: any) => {
    formEl.resetFields()
    props.close('cancel')
  }
</script>
<style lang="less" scoped>

   /deep/ .el-input__inner {
        text-align: left !important; //输入框左对齐
      }

  .equipment{
    display: flex;
    flex-direction:column;
    // height: 450px;
    padding-bottom: 20px;
    overflow:auto
    // align-items: center;


  }

    .equipment-proportionsLeft {
      // width: 10px;
      font-size: 15px;
      position: absolute;
      top: -29px;
      right: 79px;
      color: rgb(69, 167, 231);
      cursor: pointer;
    }
    .defaultParam {
      width: 200px;
      height: 100px;
      overflow-y: scroll;
    }
    .relationOperaterList {
      transform: translateX(13px);
    }
    .equipment-left{
      width: 150px;
    }
    .formula-right{
      padding: 10px;
      background: #5faeff0d;
    }
    .parameters{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom:10px ;
    }
    .parameters-left{
      width: 25px;
    }


    .equipment-bottom-top{
    cursor: pointer;
    border: 1px solid #cecece;
    width: 445px;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
    }
    .equipment-bottom-bottom{
    border: 1px solid #cecece;
    border-top: 0;
    width: 445px;
    height: 100px;
    padding: 10px;
    background: #f3f3f3;
    color: #909399;

    }
    .equipment-bottom-top-right{
      color: #5faeff;
      cursor: pointer;
    }
    .equipment-bottom-top-right-no{
      color: #727374;
    }
    .equipment-bottom-checkbox{
      transform: translateX(330px);
    }
</style>

<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-02-02 09:10:40
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

                <div v-if="item.type === 'relationDevice'">
                  <el-form-item :label="item.name" prop="relationDevice" class="buttonContainer">
                    <el-select v-model="state.form.relationDevice" class="m-2" :disabled="disable(item.disabled)">
                      <el-option v-for="(item, index) in state.relationDevice" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>
            <!-- right -->
            <div>
              <div v-for="(item, index) in state.right" :key="index">
                <div v-if="item.type === 'type'">
                  <el-form-item :label="item.name" prop="type" class="buttonContainer">
                    <el-select v-model="state.form[item.model]" :placeholder="`请选择${item.name}`" :disabled="disable(item.disabled)" @change="change">
                      <el-option v-for="v in state.equipmentType" :key="v.id" :label="v.name" :value="v.id" />
                    </el-select>
                  </el-form-item>
                </div>

                <div v-if="item.type === 'input'">
                  <el-form-item :label="`${item.name}`" :prop="item.prop">
                    <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
                  </el-form-item>
                </div>
                <div v-if="item.type === 'inputNumber'">
                  <el-form-item :label="`${item.name}`" :prop="item.prop">
                    <el-input-number v-model="state.form[item.model]" class="equipment-number" :controls="false" :min="0" controls-position="right" :placeholder="`请输入${item.name}`" type="text" />
                  </el-form-item>
                </div>

                <div v-if="item.type === 'relationOperaterList'">
                  <el-form-item :label="item.name" prop="relationOperaterList" class="buttonContainer">
                    <div class="relationOperaterList">
                      <Tips :title="`请选择${item.name}`" />
                    </div>
                    <el-select v-model="state.form.relationOperaterList" multiple :disabled="disable(item.disabled)">
                      <el-option v-for="(item, index) in state.operatorData" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                    <template #append>
                      <el-tooltip class="box-item" effect="dark" content="铺布机关联贴标机  贴标机关联裁床 " placement="right-start">
                        <el-icon class="filledIcon" :size="20"><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </template>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <!-- 公式选择 -->
          <el-form-item :label="`公式选择`" prop="remark" class="equipment-spec">
            <div class="equipment-bottom-top"><span>公式</span><span class="equipment-bottom-top-right" @click="setDialogType">选择公式</span></div>
            <div class="equipment-bottom-bottom"><span>{{ state.formulaContent.value }}</span></div>
            <div class="equipment-bottom-checkbox"> <el-checkbox v-model="state.checkboxType" label="设为默认公式" size="large" /> </div>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="formula-right">
          <div>公式参数(自动获取)</div>
          <br />
          <div v-for="(item, index) in state.parameters" :key="index" class="parameters">
            <div class="parameters-left">{{ item.name }} :</div>
            <el-input v-model="item.value" type="text" />
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
    <Dialog :operation="operation" :value="state.formulaContent"/>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import { isEmpty, cloneDeep } from 'lodash'

  import { QuestionFilled } from '@element-plus/icons-vue'
  import { equipmentType } from '@/components/conifgs'
  import Tips from '@/components/tips/index.vue'
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
    type: props.dialogType,
    middle: formMiddleData,
    right: formRightData,
    equipmentType: equipmentType,
    parameters: parameters, //公式参数
     prop: dataRule,
     checkboxType:false,//默认公式
    dialogTableVisible: false,//公式弹窗
    formulaContent:{name:"",value:"展示所选公式内容"}

  })

  const init = () => {
    if (props.row.id) {
      proxy.$baseService.get('/jack-ics-api/device/get', { id: props.row.id }).then((res: any) => {
        res.data.type = res.data.type.toString()

        res.data.img = res.data.img !== '' ? [{ url: res.data.img }] : []

        state.form = res.data
        if (!isEmpty(res.data.defaultParam)) {
          let arr = res.data.defaultParam.split(',')
          state.title = arr
        }
      })
    }
    //关联操作员
    let data = {
      page: 1,
      limit: 999999,
      systemId: localStorage.getItem('v1@systemId'),
      tenantCode: localStorage.getItem('v1@tenantCode')
    }
    proxy.$baseService.get('/njp-plus-admin-api/sys/user/page', data).then((res: any) => {
      let data = res.data.list
      if (!isEmpty(data)) {
        data.map((item: any) => {
          ;(item.label = item.realName), (item.value = item.id)
        })
        state.operatorData = data
      } else {
        state.operatorData = []
      }
    })
  }
  init()

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
        if (!isEmpty(formData.img)) {
          formData.img = formData.img[0].url
        } else {
          formData.img = ''
        }

        if (!isEmpty(formData.relationOperaterList)) {
          let data = formData.relationOperaterList

          let list: any = []
          data.forEach((item: any) => {
            state.operatorData.forEach((v: any) => {
              if (item === v.id) {
                list.push({
                  operationName: v.realName,
                  operationId: v.id
                })
              }
            })
          })
          formData.relationOperaterList = list
        }

        //选择贴标清除 默认参数
        if (formData.type !== '1') {
          formData.defaultParam = ''
        }
        proxy.$baseService.post('/jack-ics-api/device/save', formData).then((res: any) => {
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
const setDialogType=()=>{
    state.dialogTableVisible = true
}
    //弹窗事件
  const operation = (e: any) => {
    if(e.type){
    state.formulaContent=e.data
    state.dialogTableVisible = false
    }else{
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
    .equipment-bottom-checkbox{
      transform: translateX(330px); 
    }
</style>

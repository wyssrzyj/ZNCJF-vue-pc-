<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-02-04 14:31:07
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="ruleFormRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form">
    <el-form-item :label="`班组名称`">
      <el-input v-model="state.form.sn" placeholder="请输入班组名称" type="text" />
    </el-form-item>
    <el-form-item :label="`班次周期`">
      <Cycle :set-data="setCycleData" />
    </el-form-item>
  </el-form>
  <div>
    <div class="shiftTitle"></div>
    <span class="shiftTXT">班组时间</span>
    <TeamTime :set-data="setTeamTime" />
  </div>
  <div>
    <div class="shiftTitle"></div>
    <span class="shiftTXT">适用范围</span>
    <div class="shift-transfer">
      <el-transfer v-model="state.value" class="transfer-high" :data="state.data" />
    </div>
  </div>

  <!-- 底部 -->
  <div class="equipmentBottom"></div>
  <div class="equipmentFoot">
    <el-button @click="resetForm(ruleFormRef)"> {{ state.type === false ? '取消' : '关闭' }}</el-button>
    <el-button v-if="state.type === false" type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)">确认</el-button>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import { isEmpty, cloneDeep } from 'lodash'
  import { content } from './conifgs'
  import Cycle from './cycle.vue'
  import TeamTime from './teamTime.vue'

  import './index.less'

  const { formData, formMiddleData } = content

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
    // 穿梭
    data: [
      {
        key: 1,
        label: '数据1',
        disabled: false
      },
      {
        key: 2,
        label: '数据2',
        disabled: false
      }
    ],
    value: []
  })

  const init = () => {
    if (props.row.id) {
      proxy.$baseService.get('/jack-ics-api/device/get', { id: props.row.id }).then((res: any) => {
        res.data.type = res.data.type.toString()
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

  const setCycleData = (e: any) => {
    // console.log('班次周期~~~~~~~~', e)
  }
  const setTeamTime = (e: any) => {
    // console.log('时间数据~~~~~~~~', e)
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
        //穿梭框高度
       // Transfer Element
  .transfer-high{
     /deep/ .el-transfer-panel__body{
      height: 200px;
    }
  }
</style>

<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-02-20 16:58:35
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="ruleFormRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form">
    <el-form-item :label="`班次名称`">
      <el-input v-model="state.form.name" placeholder="请输入班组名称" type="text" />
    </el-form-item>
    <el-form-item :label="`班次周期`">
      <Cycle :data="state.form" :set-data="setCycleData" />
    </el-form-item>
  </el-form>
  <div>
    <div class="shiftTitle"></div>
    <span class="shiftTXT">班次时间</span>
    <TeamTime :data="state.form" :set-data="setTeamTime" />
  </div>
  <div>
    <div class="shiftTitle"></div>
    <span class="shiftTXT">适用范围</span>
    <div class="shift-transfer">
      <el-transfer v-model="state.form.workTeamIdList" :titles="['所有资源', '已选资源']" class="transfer-high" :data="state.data" />
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
  import { isEmpty } from 'lodash'

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
    data: []
  })

  const init = () => {
    //获取适用范围
    proxy.$baseService.get('/jack-ics-api/formulaContainer/getResource').then((res: any) => {
      let data = res.data
      if (!isEmpty(data)) {
        data.map((item: any) => {
          item.key = item.id
          ;(item.label = item.name), (item.disabled = false)
        })
        state.data = data
      }
    })
    //回显
    if (props.row.id) {
      //适用范围
      proxy.$baseService.get('/jack-ics-api/teamSchedule/get', { id: props.row.id }).then((res: any) => {
        let data = res.data
        data.workDay
        state.form = data
      })
    }
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
      let formData = state.form
      if (valid) {
        proxy.$baseService.post('/jack-ics-api/teamSchedule/save', formData).then((res: any) => {
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
  // 班次周期
  const setCycleData = (e: any) => {
    if (!isEmpty(e)) {
      let data = e.filter((item: any) => item.type)
      let list: any = []
      data.forEach((item: any) => {
        list.push(item.value)
      })
      state.form.workDay = list
    }
    // workDay
  }
  // 班组时间
  const setTeamTime = (e: any) => {
    state.form.workTime = e
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
      // height: 180px;
      //  overflow: auto;
    }
  }
</style>

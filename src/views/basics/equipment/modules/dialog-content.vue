 <!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-01-04 13:31:12
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <el-form ref="ruleFormRef" label-position="top" :rules="state.prop" :inline="true" :model="state.form">
    <el-row :gutter="20" style="margin: 2px 2px 0 10px">
      <!-- left1 -->
      <el-col :span="8" class="equipment-left">
        <el-form-item label="设备图片" class="layclothImg" prop="img">
          <UploadModule v-model="state.form.img" :disabled="disable(false)" :type="'img'" :get-data="getData" :value="state.form" />
        </el-form-item>
        
        <el-form-item label="设备默认参数" prop="defaultParam" class="log-defaultParam"  v-if="state.form.type!=='2'" >
          <el-icon class="equipment-proportionsLeft" :size="20" @click="shippingMarks"><Edit /></el-icon>
          <br />

          <div class="defaultParam" v-if="state.titleType">
            <span  v-for="(item, index) in state.title" :key="index" class="title">{{ item }}， <br /></span>
          </div>
        </el-form-item>
      </el-col>

      <el-col :span="16">
        <div class="equipment">
          <div class="equipment-top">
            <div>
              <div v-for="(item, index) in state.middle" :key="index">
                <div v-if="item.type === 'input'">
                  <el-form-item :label="`${item.name}`" :prop=item.prop>
                    <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
                  </el-form-item>
                </div>
                <!-- <div v-if="item.type === 'name'">
                  <el-form-item :label="`${item.name}`" prop="name">
                    <el-input v-model="state.form[item.model]" :placeholder="`请输入${item.name}`" :disabled="disable(item.disabled)" type="text" />
                  </el-form-item>
                </div> -->
                <div v-if="item.type === 'relationDevice'">
                  <el-form-item :label="item.name" prop="relationDevice" class="buttonContainer">
                    <Tips :title="`请选择${item.name}`" />
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
                  <el-form-item label="设备类型" prop="type" class="buttonContainer">
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
                      <el-input-number
              v-model="state.form[item.model]"
              class="equipment-number"
              :controls="false"
              :min="0"
              controls-position="right"
              :placeholder="`请输入${item.name}`"
              type="text"
            />
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
          <!-- bottom -->
          <el-form-item :label="`备注`" prop="remark" class="equipment-spec">
            <el-input v-model="state.form.remark" :placeholder="`请输入备注`" :rows="2" type="textarea" :disabled="disable(false)" />
          </el-form-item>
        </div>
      </el-col>
    </el-row>
  </el-form>

  
  <div class="equipmentFoot">
    <el-button @click="resetForm(ruleFormRef)"> {{ state.type === false ? '取消' : '关闭' }}</el-button>
    <el-button v-if="state.type === false" type="primary" :disabled="disable(false)" class="preservation" @click="submitForm(ruleFormRef)">确认</el-button>
  </div>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :draggable="false" :close-on-click-modal="false" :title="state.messageTitle" width="500px">
    <DialogForms :list="state.echoDefaultParam" :row="props.row" :type="state.type" :operation="operation" :form="state.form" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import { isEmpty, cloneDeep } from 'lodash'

  import { QuestionFilled } from '@element-plus/icons-vue'
  import { equipmentType } from '@/components/conifgs'
  import UploadModule from '@/components/upload/index.vue'
  import Tips from '@/components/tips/index.vue'

  import DialogForms from './dialog-forms.vue'
  import { content } from './conifgs'

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
    dialogTableVisible: false,
    equipmentType: equipmentType,
    title: '',
    titleType:true,
    echoDefaultParam: {}, //设备默认参数未保存暂存回显数据
    //提示信息
    prop: dataRule,
    messageTitle: '铺布建议参数',
    relationDevice: [],
    operator: [],
    operatorData: []
  })

  //获取关联设备
  const setRelationDevice = (id: any) => {
    state.form.associatedEquipment = '' //将选中的清空
    if(id==="1"){
    state.titleType = true

    }else{
    state.titleType = false

    }
    const data = {
      deviceType: id
    }

    proxy.$baseService.get('/jack-ics-api/device/relationDevice', data).then((res: any) => {
      if (!isEmpty(res.data)) {
        let list: any = []
        res.data.forEach((item: any) => {
          list.push({
            label: item.name,
            value: item.id
          })
        })

        state.relationDevice = list
      } else {
        state.relationDevice = []
      }
    })
  }

  const init = () => {
    if (props.row.id) {
      proxy.$baseService.get('/jack-ics-api/device/get', { id: props.row.id }).then((res: any) => {
        res.data.type = res.data.type.toString()
        setRelationDevice(res.data.type)

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

  // 上传
  const getData = (e: any) => {
    if (e.type === 'img') {
      if (!isEmpty(e.data)) {
        state.form.img = e.data
      } else {
        state.form.img = ''
      }
    }
  }

  // 设备类型更改
  const change = (e: any) => {
    setRelationDevice(e)
    state.echoDefaultParam = {}
    //关联设备初始
    state.form.relationDevice = null
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

  //设备默认参数
  const shippingMarks = () => {
    if (state.form.type === '') {
      ElMessage({
        message: '请选择设备类型',
        type: 'warning'
      })
    }

    if (state.form.type === '2') {
      ElMessage({
        message: '贴标暂无设备默认参数',
        type: 'warning'
      })
    }
    if (state.form.type === '1') {
      state.messageTitle = '铺布建议参数'
      state.dialogTableVisible = true
    }
    if (state.form.type === '3') {
      state.messageTitle = '裁剪建议参数'
      state.dialogTableVisible = true
    }
  }

  //弹窗事件
  const operation = (e: any) => {

    if (e.type === 'layCloth') {
      state.form.paramId=e.data.paramId

      let arr = e.data.title.split(',')
      state.title = arr
      state.form.defaultParam = e.data.title
      // 新增的时候 需要传递一个设备默认保存返回的id
      state.form.paramId = e.data.paramId
      //暂存回显数据
      state.echoDefaultParam = e.data.list

      state.dialogTableVisible = false
    }

    if (e.type === 'crop') {
      state.form.paramId=e.data.paramId
      state.dialogTableVisible = false
    }

     if (e.type === 'cancel') {
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
</style>

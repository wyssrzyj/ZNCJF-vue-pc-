<!--
 * @Author: lyj
 * @Date: 2022-08-17 09:49:26
 * @LastEditTime: 2022-08-29 13:07:02
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
  <el-form ref="dataFormRef" class="dialogContentForm" :rules="dataRule" :inline="true" :model="form" label-width="130px">
    <el-row :gutter="20" style="margin: 2px 2px 0 10px">
      <!-- left -->
      <el-col :span="8">
        <el-form-item label="款图" class="layclothImg" prop="img">
          <UploadModule v-model="form.img" :type="'img'" :get-data="getData" :value="form.img" />
        </el-form-item>
        <el-form-item label="款式编号">
          <el-input v-model="form.name" placeholder="请输入款式编号" type="text" />
        </el-form-item>
        <el-form-item label="款式名称">
          <el-input v-model="form.username" placeholder="请输入款式名称" type="text" />
        </el-form-item>
        <el-form-item label="唛架图">
          <UploadModule :type="'file'" :get-data="getData" :value="form.file" />
        </el-form-item>
        <el-form-item label="其他附件">
          <UploadModule :type="'file'" :get-data="getData" :value="form.file" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <div v-for="(item, index) in state.middle" :key="index">
          <div v-if="item.type === 'bedSchedule'">
            <el-form-item label="床次计划号" prop="bedSchedule">
              <el-input v-model="form.bedSchedule" type="text" />
            </el-form-item>
          </div>

          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="item.model" :disabled="item.disable" type="text" />
            </el-form-item>
          </div>
        </div>
      </el-col>
      <!-- right -->
      <el-col :span="8">
        <div v-for="(item, index) in state.right" :key="index">
          <div v-if="item.type === 'equipment'">
            <el-form-item :label="item.name" prop="equipment" class="buttonContainer">
              <el-select v-model="form.equipment">
                <el-option label="CJoo1" value="1" />
                <el-option label="PBJ001" value="2" />
              </el-select>
              <button class="LayButton" @click="state.dialogTableVisible = true">按钮q</button>
            </el-form-item>
          </div>
          <div v-if="item.type === 'lossRate'">
            <el-form-item :label="`${item.name}`" class="buttonContainer">
              <el-input v-model="item.model" :disabled="item.disable" type="text" />
              <button class="LayButton">按钮w</button>
            </el-form-item>
          </div>
          <div v-if="item.type === null">
            <el-form-item :label="`${item.name}`">
              <el-input v-model="item.model" :disabled="item.disable" type="text" />
            </el-form-item>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="dialogBottom">
      <el-button type="primary" class="preservation" @click="dataFormSubmitHandle()">确认</el-button>
      <el-button @click="resetForm(formRef)">取消</el-button>
    </div>
  </el-form>

  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" title="模板弹窗" width="1000px">
    <PopModule :operation="operation" />
  </el-dialog>
</template>

<script>
  import { defineComponent, reactive } from 'vue'
  import { formData, formMiddleData, formRightData } from './conifgs'
  import './index.css'
  import UploadModule from './uploadModule/index.vue'
  import PopModule from './popModule/index.vue'
  export default defineComponent({
    components: {
      //声明新增组件
      PopModule,
      UploadModule
    },
    setup() {
      const form = reactive(formData)
      const state = reactive({
        middle: formMiddleData,
        right: formRightData,
        dialogTableVisible: false
      })

      const gitUrl = e => {
        // console.log(e)
      }

      const submitForm = formEl => {
        if (!formEl) return
        formEl.validate(valid => {
          if (valid) {
            // console.log('submit!', form)
          } else {
            return false
          }
        })
      }

      const resetForm = formEl => {
        if (!formEl) return
        formEl.resetFields()
      }

      const operation = e => {
        if (e.type === 'cancel') {
          state.dialogTableVisible = false
        }
        if (e.type === 'confirm') {
          // console.log('确认', e)
          state.dialogTableVisible = false
        }
      }

      return { state, form, operation, resetForm, submitForm, gitUrl }
    },
    //提示信息
    computed: {
      dataRule() {
        return {
          equipment: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
          bedSchedule: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
          img: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }]
        }
      }
    },
    created() {
      // this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle)
    },
    methods: {
      // 表单提交
      dataFormSubmitHandle() {
        this.$refs['dataFormRef'].validate(valid => {
          // console.log(valid)
          if (!valid) {
            return false
          }
          // console.log(this.form)
        })
      },
      getData(e) {
        // console.log('最终展示', e)
        if (e.type === 'img') {
          this.form.img = e.data
        }
      }
    }
  })
</script>

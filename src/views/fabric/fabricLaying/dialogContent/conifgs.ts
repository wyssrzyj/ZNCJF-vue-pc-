/*
 * @Author: lyj
 * @Date: 2022-08-12 13:12:08
 * @LastEditTime: 2022-08-27 13:22:29
 * @Description:
 * @LastEditors: lyj
 */

export const formData = {
  img: [{}],
  templateNumber: '',
  templateName: '',
  fabricType: '',
  fabricWeight: '',
  relatedFabric: '',
  fabric: '',
  right: []
}

export const dataRule = {
  templateNumber: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  templateName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  fabricType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  fabricWeight: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

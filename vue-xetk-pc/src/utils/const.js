const SunApi = '/SunApi'

const regExp = {
  mobile: /^0?(13|14|15|17|18|19)[0-9]{9}$/, // 手机
  mobile_11: /^[1]([3-9])[0-9]{9}$/, // 手机
  business_license_15: /^[a-zA-Z0-9]{15}$/, // 营业执照15位
  business_license_18: /^[a-zA-Z0-9]{18}$/, // 营业执照18位
  envDistinguishSn: /^[(A-HJ-NP-Z0-9)]{8}$/, // 环保识别号码
  envLicence: /^[X123]-[A-HJ-NP-Z0-9]{8}$/, // 环保号码
  ID_card_1: /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/, // 第一代身份证
  ID_card_2: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, // 第二代身份证
  email_1: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, //邮箱1
}
// 验证手机号格式
const checkSJH = (str) => {
  return (regExp.mobile.test(str) || regExp.mobile_11.test(str))
}
// 验证营业执照(统一社会信用代码)
const checkYYZZ = (str) => {
  return (regExp.business_license_15.test(str) || regExp.business_license_18.test(str))
}
// 验证身份证
const checkSFZ = (str) => {
  return (regExp.ID_card_1.test(str) || regExp.ID_card_2.test(str))
}
// 验证环保识别号码 / 环保号码
const checkByKey = (str, key) => {
  return (regExp[key] || '').test(str)
}
// 验证邮箱
const checkEmail = (str) => {
  return regExp.email_1.test(str)
}

// 日期转化字段 yyyy-MM-dd HH:mm:ss -> 	yyyy/MM/dd HH:mm:ss
const dateForamtKeys = [
  'projectStartTime',
  'projectEndTime',
]

export {
  SunApi,
  checkSJH,
  checkYYZZ,
  checkSFZ,
  checkByKey,
  checkEmail,
  dateForamtKeys
}
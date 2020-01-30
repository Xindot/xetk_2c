import {
  SunApi
} from '@/utils/const'

import request from '@/utils/request'

// 小鹅题库
// 获取题目列表
export function SunApi_xetk_question_list(params) {
  return request({
    url: `${SunApi}/xetk/question/list`,
    method: 'GET',
    params,
  });
}

// 获取分类列表
export function SunApi_xetk_category_list(params) {
  return request({
    url: `${SunApi}/xetk/category/list`,
    method: 'GET',
    params,
  });
}

// 用户
// 获取验证码
export function SunApi_user_vcode(params) {
  return request({
    url: `${SunApi}/user/vcode`,
    method: 'GET',
    params,
  });
}

// 注册
export function SunApi_user_register(data) {
  return request({
    url: `${SunApi}/user/register`,
    method: 'POST',
    data,
  });
}

// 登录
export function SunApi_user_login(params) {
  return request({
    url: `${SunApi}/user/login`,
    method: 'GET',
    params,
  });
}

// 修改密码
export function SunApi_user_modifyPwd(data) {
  return request({
    url: `${SunApi}/user/modifyPwd`,
    method: 'POST',
    data,
  });
}
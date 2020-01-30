import {
  dateForamtKeys
} from './const'
import dayjs from 'dayjs'

// Javascript中检验字符串、数组、json的方法：
export function isString(str) {
  return str instanceof String || typeof str == 'string';
}
export function isArray(arr) {
  return arr instanceof Array;
}
export function isJson(obj) {
  return obj.constructor == Object;
}

// 清除对象中值为空的属性
export function filterParams(obj) {
  var _newPar = {};
  for (var key in obj) {
    if ((obj[key] === 0 || obj[key] === false || obj[key]) && obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
      if (dateForamtKeys.includes(key)) {
        obj[key] = dayjs(obj[key]).format("YYYY/MM/DD HH:mm:ss")
      }
      _newPar[key] = obj[key];
    }
  }
  return _newPar;
}
// filterParams({a:true,b:false,c:null,d:undefined,e:0,f:1,g:-1,h:Object,i:[]})

// 手机号加星 11位加星4位
export function addStar_11_4(str) {
  return (str || '').replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2")
}

// js 数字转换成英文字母
// https://www.cnblogs.com/987364-wu/p/11069909.html
export function numToAlpha(str) {
  var numArr = (str ? str + '' : '').replace(/[^0-9]/ig, "").split('')
  var arr = []
  for (let i = 0; i < numArr.length; i++) {
    const num = Number(numArr[i]);
    arr.push(String.fromCharCode(num + 65))
  }
  return arr.join('')
}

/**
 * 字符串是否含有html标签的检测
 * @param htmlStr
 */
export function checkHtml(htmlStr) {
  var reg = /<[^>]+>/g;
  return reg.test(htmlStr);
}
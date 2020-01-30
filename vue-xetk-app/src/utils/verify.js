import {
    regExp
} from '@/utils/const';

// 判断手机号 11匹配
export function verifyMobile11(str) {
    const {
        COMMON
    } = regExp.mobile
    return COMMON.test(str)
}
// 判断手机号类型 前3位匹配
export function verifyMobile3Type(str) {
    const {
        chinaMobile,
        chinaUnicom,
        chinaTelecom
    } = regExp.mobile
    if (chinaMobile.test(str)) {
        return 'chinaMobile'
    }
    if (chinaUnicom.test(str)) {
        return 'chinaUnicom'
    }
    if (chinaTelecom.test(str)) {
        return 'chinaTelecom'
    }
    return null
}
// 判断手机号类型 11位匹配
export function verifyMobile11Type(str) {
    const {
        CHINAMOBILE,
        CHINAUNICOM,
        CHINATELECOM
    } = regExp.mobile
    if (CHINAMOBILE.test(str)) {
        return 'CHINAMOBILE'
    }
    if (CHINAUNICOM.test(str)) {
        return 'CHINAUNICOM'
    }
    if (CHINATELECOM.test(str)) {
        return 'CHINATELECOM'
    }
    return null
}

// 清除对象中值为空的属性
export function filterParams(obj) {
    var _newPar = {};
    for (var key in obj) {
        if ((obj[key] === 0 || obj[key] === false || obj[key]) && obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
            _newPar[key] = obj[key];
        }
    }
    return _newPar;
}
// filterParams({a:true,b:false,c:null,d:undefined,e:0,f:1,g:-1,h:Object,i:[]})

// 验证url
export function isUrl(str) {
    const {
        COMMON
    } = regExp.url
    return COMMON.test(str)
}

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

export function isJSON(str) {
    if (typeof str == 'string') {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            // console.log(e);
            return false;
        }
    }
    // console.log('It is not a string!')
}
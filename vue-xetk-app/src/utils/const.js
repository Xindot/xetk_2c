const envIndex = 0
const version = '1.0.0'
const QnUpUrl = '//up.qbox.me';
const OilManApiPrefix = ['/OilManApi', '/OilManTestApi'][0] // 
const SunApiPrefix = '/SunApi'
const RestapiAmapPrefix = '/RestapiAmap'
const pageMaxWidth = 500

const ua = window.navigator.userAgent.toLowerCase();
const deviceName = (() => {
  if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
    return 'ios';
  } else if (/(Android)/i.test(ua)) {
    return 'android';
  }
  return 'pc';
})();
const browserName = (() => {
  if (/MicroMessenger/i.test(ua)) {
    return 'wx';
  } else if (/QQ/i.test(ua)) {
    return 'qq';
  } else if (/WeiBo/i.test(ua)) {
    return 'wb';
  } else if (ua.indexOf('dingtalk') >= 0) {
    return 'dd';
  }
  return '*';
})();

const regExp = {
  mobile: {
    COMMON: /^0?(13|14|15|17|18)[0-9]{9}$/, // 匹配手机号
    // 匹配移动手机号
    CHINAMOBILE: /^1(3[4-9]|5[012789]|8[23478]|4[7]|7[8])\d{8}$/, // 11位
    chinaMobile: /^1(3[4-9]|5[012789]|8[23478]|4[7]|7[8])\d{0,8}$/, // 前3位
    // 匹配联通手机号
    CHINAUNICOM: /^1(3[0-2]|5[56]|8[56]|4[5]|7[6])\d{8}$/, // 11位
    chinaUnicom: /^1(3[0-2]|5[56]|8[56]|4[5]|7[6])\d{0,8}$/, // 前3位
    // 匹配电信手机号
    CHINATELECOM: /^1(3[3])|(8[019])\d{8}$/, // 11位
    chinaTelecom: /^1(3[3])|(8[019])\d{0,8}$/, // 前3位
  },
  url: {
    COMMON: /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/,
  }
}

const iOS = () => {
  return window.webkit &&
    window.webkit.messageHandlers &&
    window.webkit.messageHandlers.iOS;
}
const Android = () => {
  return window.Android;
}

const demock = false // demo mock 默认flase 开启将不请求api

export {
  envIndex,
  demock,
  version,
  deviceName,
  browserName,
  iOS,
  Android,
  QnUpUrl,
  OilManApiPrefix,
  SunApiPrefix,
  RestapiAmapPrefix,
  regExp,
  pageMaxWidth
};
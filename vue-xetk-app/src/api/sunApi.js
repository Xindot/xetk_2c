// 接口前缀
import {
  SunApiPrefix
} from '@/utils/const'
// 请求中转
import request from '@/utils/request';

// 微信相关
// 微信分享SDK
export function api_wx_config(params) {
  return request({
    url: `${SunApiPrefix}/wx/wxConfig`,
    method: 'get',
    params,
  });
}
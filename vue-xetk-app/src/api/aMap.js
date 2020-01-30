// 高德地图
// 接口前缀
import {
  RestapiAmapPrefix
} from '@/utils/const'
const restapi_amap_v3 = RestapiAmapPrefix + '/v3'
// 请求中转
import request from '@/utils/request';

// 周边搜索
export function api_place_around(params) {
  return request({
    url: `${restapi_amap_v3}/place/around`,
    method: 'get',
    params,
  });
}
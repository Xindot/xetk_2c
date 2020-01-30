import axios from 'axios'
// import { deviceName, browserName, OilManApiPrefix } from '@/utils/const'
import {
  filterParams
} from '@/utils/verify'
// import $store from '@/store'
// console.log($store.getters.token)
// $store.dispatch('nameSync',{token:''})

// console.log(process)
const service = axios.create({
  baseURL: process.env.BASE_API || '', // api的base_url
  timeout: 100000, // 100s
})

// request拦截器
service.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token') || ''
  Object.assign(config.headers, {
    token,
    'app-platform': 'weixin',
    // 'device-id': '',
    // 'app-channel': '',
    // 'app-version': ''
  })
  if (config.data) {
    config.data = filterParams(config.data)
    // if (String(config.method).toLowerCase() === 'post') {
    //   // config.data = qs.stringify(config.data);
    // }
  }
  return config;
}, (error) => {
  const err = error;
  return Promise.reject(err);
});

// respone拦截器
service.interceptors.response.use((res) => {
  if (!(res && res.data)) {
    return Promise.reject(res);
  }
  if (Number(res.data.code) === 403) {
    window.localStorage.setItem('token', '')
  }
  return res.data
}, (error) => {
  const err = error;
  return Promise.reject(err);
});

export default service
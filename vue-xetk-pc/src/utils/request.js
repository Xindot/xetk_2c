import {
  Notification
} from 'element-ui'

import axios from 'axios'
import {
  filterParams
} from '@/utils/verify'

const axiosServer = axios.create({
  baseURL: process.env.BASE_API || '', // api的base_url
  timeout: 100000
})

// request拦截器
axiosServer.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token') || ''
  Object.assign(config.headers, {
    token,
  })
  config.params = filterParams(config.params)
  return config;
}, (err) => {
  return Promise.reject(err);
});

// respone拦截器
axiosServer.interceptors.response.use((response) => {
  const res = response;
  // console.log('interceptors=>', res);
  if (!(res && res.data)) {
    return Promise.reject(res);
  }
  return res.data
}, (err) => {
  // console.log('interceptors response error=>', err); // for debug
  Notification.closeAll()
  Notification.error({
    title: "错误",
    message: err
  });
  return Promise.reject(err);
});


export default axiosServer;
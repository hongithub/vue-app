import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { Indicator, Toast } from 'mint-ui'
import api from '@/api'

Vue.use(VueAxios, axios)

// 接口的版本号
const v = 'v1'
// 所有接口的公共前缀
const prefix = `/port/${v}`
// 载入状态码
const code = api.code
// 设置 baseURL，若不是生产环境设置代理前缀( '/api' 对应 proxyTable 中的键名)
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? `${prefix}` : `/api/${prefix}`
// 请求超时时间
axios.defaults.timeout = 6000

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (config.params && !config.params.hide) {
    Indicator.open()
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  Indicator.close()
  Toast('请求错误')
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (res) {
  // 对响应数据做点什么
  Indicator.close()
  if (res.data.code !== code) {
    Toast(res.data.message)
  }
  return res
}, function (error) {
  // 对响应错误做点什么
  Indicator.close()
  Toast('响应错误')
  return Promise.reject(error)
})

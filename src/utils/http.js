import axios from 'axios';
import {message} from "antd"

let rootUrl = 'http://127.0.0.1:8888/forum/'                  
// 你的域名

const Axios = axios.create({
  //请求头默认配置
  headers: {
    token:localStorage.getItem('token')

  },

  // 覆写库的超时默认值
  // 现在，在超时前，所有请求都会等待 5 秒
  //timeout:1000
});


// get post请求封装
export function get(url, param) {
    return new Promise((resolve, reject) => {
      Axios.get(rootUrl + url, {params: param}).then(response => {
            resolve(response)
        }, err => {
            reject(err)
            err(err.response.data.msg)
        }).catch((error) => {
            
            reject(error)

                err(error.response.data.msg)
        
            
        })
    })
}

export function post(url, params) {
    return new Promise((resolve, reject) => {
      Axios.post(rootUrl + url, params).then(
            response => {
                resolve(response);
            }, error => {
                reject(error.response);
                err(error.response.data.msg)
            })
    })
}

export function put(url, params) {
    return new Promise((resolve, reject) => {
      Axios.put(rootUrl + url, params).then(
            response => {
                resolve(response);
            }, error => {
                reject(error.response);
                err(error.response.data.msg)
            })
    })
}

export function deletes(url, params) {
    return new Promise((resolve, reject) => {
      Axios.delete(rootUrl + url, params).then(
            response => {
                resolve(response);
            }, error => {
                reject(error.response);
                err(error.response.data.msg)
            })
    })
}

function err(msg){
    setTimeout(()=>{
        message.error(msg);
    },1000)
}

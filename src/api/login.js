import request from '@/utils/request'

const BASE_URL = 'http://127.0.0.1:8081'
// 导出的是普通成员函数

// 登录
export function login(username,password){
    return request({
        url: BASE_URL+'/api/user/login',
        method: 'post',
        data: {
            username,
            password
        }
    })
}

// 获取用户信息
export function getUserInfo(token){
    return request({
        url: BASE_URL + '/api/user/info', // 反单引号，动态获取token值
        method: 'get',
        headers:{
            "Authorization":"JWT "+token
        }
    })
}
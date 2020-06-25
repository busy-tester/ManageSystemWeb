import request from '@/utils/request'
import BASE_URL from '@/utils/common'
// 导出的是普通成员函数

// 注册
export function register(username,password,email,nick_name){
    return request({
        url: BASE_URL+'/api/user/register',
        method: 'post',
        data: {
            username,
            password,
            email,
            nick_name
        }
    })
}
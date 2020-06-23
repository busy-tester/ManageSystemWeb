// 修改密码接口

import request from '@/utils/request'
import BASE_URL from '@/utils/common'


export default {
    // 校验密码
    checkPwd(token,password){
        return request({
            url: BASE_URL+'/api/user/check/pwd',
            method: 'post',
            data:{
                password
            },
            headers:{
                "Authorization":"JWT "+token  // 请求头
            }
        })
    },

    // 修改密码
    updatePwd(token,password){
        return request({
            url: BASE_URL+'/api/user/update/pwd',
            method: 'put',
            data:{
                password
            },
            headers:{
                "Authorization":"JWT "+token  // 请求头
            }
        })
    }
}
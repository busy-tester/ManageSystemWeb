// 获取对应数据的总数接口

import request from '@/utils/request'
import BASE_URL from '@/utils/common'


export default {   
    getTotal(){
        return request({
            url: BASE_URL +'/api/manage/total', 
            method: 'get',

        })
    },

    
}


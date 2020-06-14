// 会员管理接口

import request from '@/utils/request'
import BASE_URL from '@/utils/common'


export default {
    // 获取会员列表数据,page 当前页码。size，每页查询条数,searchMap 搜索的参数
    getList(token,size,page,searchMap){
        return request({
            url: BASE_URL +`/api/manage/search/member?page=${page}&size=${size}`, // 反单引号
            method: 'post',
            data: searchMap,
            headers:{
                "Authorization":"JWT "+token
            }

        })
    },

    // 新增会员
    add(pojo,token){
        return request({
            url: BASE_URL + '/api/manage/member',
            method: 'post',
            data: pojo,
            headers:{
                "Authorization":"JWT "+token
            }
        })
    },

    // 根据会员 id 查询单条数据
    getById(id,token){
        return request({
            url: BASE_URL + `/api/manage/member?id=${id}`,
            method: 'get',
            headers:{
                "Authorization":"JWT "+token
            }
        })
    },

    // 修改数据
    update(pojo,token){
        return request({
            url: BASE_URL + '/api/manage/member',
            method: 'put',
            data: pojo,
            headers:{
                "Authorization":"JWT "+token
            }
        })
    },

    // 删除数据
    deleteById(id,token){
        return request({
            url: BASE_URL + `/api/manage/member?id=${id}`,
            method: 'delete',
            headers:{
                "Authorization":"JWT "+token,
                "content-type": "application/json"
            }
        })
    }

    
}


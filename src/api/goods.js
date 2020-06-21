// 商品管理接口

import request from '@/utils/request'
import BASE_URL from '@/utils/common'


export default {
    // page 当前页码。size，每页查询条数,searchMap 搜索的参数
    getList(token,size,page,searchMap){
        return request({
            url: BASE_URL +`/api/manage/search/goods?page=${page}&size=${size}`, // 反单引号
            method: 'post',
            data: searchMap,
            headers:{
                "Authorization":"JWT "+token
            }

        })
    },

    // 添加
    add(token,pojo){
        return request({
            url: BASE_URL +'/api/manage/goods',
            method: 'post',
            data: pojo,
            headers:{
                "Authorization":"JWT "+token
            }

        })
    },

    // 根据 id 查询单条数据
    getById(id,token){
        return request({
            url: BASE_URL + `/api/manage/goods?id=${id}`,
            method: 'get',
            headers:{
                "Authorization":"JWT "+token
            }
        })
    },

    // 修改数据
    update(token,pojo){
        return request({
            url: BASE_URL + '/api/manage/goods',
            method: 'put',
            data: pojo,
            headers:{
                "Authorization":"JWT "+token,
                'content-type': "application/json"
            }
        })
    },

 
    // 删除数据
    deleteById(id,token){
        return request({
            url: BASE_URL + `/api/manage/goods?id=${id}`,
            method: 'delete',
            headers:{
                "Authorization":"JWT "+token,
                "content-type": "application/json"
            }
        })
    },

    // 获取供应商
    getSupplier(token){
        return request({
            url: BASE_URL +'/api/manage/search/supplier',
            method: 'get',
            headers:{
                "Authorization":"JWT "+token
            }

        })
    },
    
}


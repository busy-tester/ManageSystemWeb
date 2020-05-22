// @就是src目录的路径
import request from '@/utils/request'


const BASE_URL = '/dev-api'

export default {
    getList(){
        const res = request({
            method: 'get',
            url: BASE_URL + '/db.json'
        })
        return res
    }
}
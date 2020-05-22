// @就是src目录的路径
import request from '@/utils/request'


// 下面的这种是使用最原始的方式来发送get请求
// request.get('/db.json').then(response =>{
//     console.log(response.data)
// })


// 以对象配置的方式进行指定请求方式
// request({
//     method: 'get',
//     url: '/db.json'
// }).then(response =>{
//     console.log('对象方式', response.data)
// })

export default {
    getList(){
        const res = request({
            method: 'get',
            url: '/db.json'
        })
        return res
    }
}
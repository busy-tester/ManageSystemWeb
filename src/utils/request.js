import axios from 'axios'



const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, //基础路径,.env.development
    timeout: 5000 //超时时间，5000毫秒
})

// request.get('./db.json').then(response =>{ // 使用request。而不是使用axios
//     console.log(response.data)
// })
export default request  // 导出自定义的axios对象
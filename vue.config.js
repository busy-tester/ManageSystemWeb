module.exports = {
    devServer: {
        port: 8888, // 端口号，如果端口被占用，会自动加1
        host: "127.0.0.1",  // 主机名，127.0.0.1  真机 0.0.0.0
        https: false,  // 协议
        open: true,  // 启动服务时自动打开浏览器访问
//         proxy: {  // 开发环境代理配置
//             '/dev-api':{  // 匹配 /dev-api 开头的请求，
//                 // 目标服务器地址，代理访问http://localhost:8001/
//                 target: 'http://127.0.0.1:8081',
//                 ws: true,
//                 changeOrigin: true,  // 开启代理服务器
//                 pathRewrite:{
//                     //  会将 /dev-api 替换为 '',也就是 /dev-api 会移除，
//                     // 如 /dev-api/db.json 代理到 https://localhost:8080/db.json
//                     '^/dev-api': ''
//                 }
//             }
//         }

    },
    lintOnSave: false,  // 关闭格式检查
    productionSourceMap: false // 打包时不会生成.map文件，加快打包速度
}

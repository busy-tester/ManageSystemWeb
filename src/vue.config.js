module.exports = {
    devServer: {
        port: 8888, // 端口号，如果端口被占用，会自动加1
        host: "localhost",  // 主机名，127.0.0.1  真机 0.0.0.0
        https: false,  // 协议
        open: true,  // 启动服务时自动打开浏览器访问
        proxy: {  // 开发环境代理配置
                   [process.env.VUE_APP_BASE_API]:{  // 自动获取，注意要[],在.env.development里配置的
                // 目标服务器地址，在.env.development里配置的。代理访问http://localhost:8001
                target: process.env.VUE_APP_SERVICE_URL,
                changeOrigin: true,  // 开启代理服务器
                pathRewrite:{
                    
                    ['^' + process.env.VUE_APP_BASE_API]: ''  // 自动获取
                }
            }
        }

    },
    lintOnSave: false,  // 关闭格式检查
    productionSourceMap: false // 打包时不会生成.map文件，加快打包速度
}
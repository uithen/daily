const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/api1', { // 遇见/api1前缀的请求，就会触发该代理配置
      target: 'http://localhost:5000', // 请求转发给谁
      changeOrigin: true, // 控制服务器那边收到的请求头中Host的值，true显示为设置代理时的端口（成功欺骗服务器），false为客户端实际请求的端口
      pathRewrite: {'^/api1': ''} //重写请求路径(必须)，不写的话，服务器端拿到的url则为/apixx/XXX，就拿不到正确的资源了，所以要重新设置为''
    }),
    createProxyMiddleware('/api2', {
      target: 'http://localhost:5001',
      changeOrigin: true,
      pathRewrite: {'^/api2': ''}
    }),
  )
}
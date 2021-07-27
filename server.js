const Vue = require('vue')
const express = require('express')
const renderer = require('vue-server-renderer').createRenderer()

//创建server实例
const server = express()

//添加路由 访问根路径
server.get('/', (req, res) => {

    //渲染vue实例
    const app = new Vue({
        template: `
          <div id="app">
            <h1>{{message}}</h1>
          </div>
          `,
        data: {
            message: 'yyds'
        }
    })

    //app实例 ，回调函数
    renderer.renderToString(app, (err, html) => {
        if (err) {
            res.status(500).end('Internal server Error')

            return
        }
        res.setHeader('Content-Type', 'text/html;charset=utf8')

        // res.end(html)
        res.end(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
            <meta charset="UTF-8">
            <title>Hello</title>
            </head>
            <body>${html}</body>
          </html>
        `)
    })
})

//启动web服务
server.listen(3000, () => {
    console.log('server running port 3000.')
})
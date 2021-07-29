const Vue = require('vue')
const express = require('express')
const fs = require('fs')

const renderer = require('vue-server-renderer').createRenderer({
    template: fs.readFileSync('./index.template.html', 'utf-8')
})

//创建server实例
const server = express()

//添加路由 访问根路径
server.get('/', (req, res) => {

    //渲染vue实例
    const app = new Vue({
        template: `
          <div id="app">
            <h1>{{message}}</h1>
            <h2>客户端动态交互</h2>
            <div>
                <input type="text" v-model="message">
            </div>
            <div>
                <button @click="onClick">btn</button>
            </div>
          </div>
        `,
        data: {
            message: 'yyds'
        },
        methods: {
            onclick() {
                console.log('test')
            }
        }
    })

    //app实例 ，回调函数
    renderer.renderToString(app, {
        //模板中使用的数据
        title: 'nmsl',
        meta: `
          <meta name="description" content="小日本nmsl">
        `
    }, (err, html) => {
        if (err) {
            res.status(500).end('Internal server Error')

            return
        }
        res.setHeader('Content-Type', 'text/html;charset=utf8')

        // res.end(html)
        res.end(html)
    })
})

//启动web服务
server.listen(3000, () => {
    console.log('server running port 3000.')
})
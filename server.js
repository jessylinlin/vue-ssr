const Vue = require('vue')
const express = require('express')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
const setupDevServer = require('./build/setup-dev-server')

const isPord = process.env.NODE_ENV === 'production'
let renderer
let onReady

//创建server实例
const server = express()

//挂载处理静态资源的中间件(物理磁盘)
server.use('/dist', express.static('./dist'))

//处理内存中静态资源


if (isPord) {
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    const template = fs.readFileSync('./index.template.html', 'utf-8')

    //createRenderer ==> createBundleRenderer
    //serverBundle == vue-ssr-server-bundle.json
    renderer = createBundleRenderer(serverBundle, {
        template,
        clientManifest
    })
} else {
    //开发模式 -- 监视打包构建 -- 重新生成renderer渲染器
    onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
        renderer = createBundleRenderer(serverBundle, {
            template,
            clientManifest
        })
    })
}

const render = (req, res) => {
    //渲染vue实例 --entry中已经创建
    //app实例 ，回调函数
    renderer.renderToString({
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
}

//添加路由 访问根路径 路由处理函数
server.get('/', isPord ?
    render : async(req, res) => {
        //等待有了 renderer 渲染器后 调用render函数渲染
        await onReady
        render(req, res)
    }
)

//启动web服务
server.listen(3000, () => {
    console.log('server running port 3000.')
})
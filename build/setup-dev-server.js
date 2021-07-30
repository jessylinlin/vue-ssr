const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const webpack = require('webpack')
const resolve = file => path.resolve(__dirname, file)
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

module.exports = (server, callback) => {
    let ready
    const onReady = new Promise(r => ready = r)

    //监视构建 -> 更新renderer
    let serverBundle
    let template
    let clientManifest

    const update = () => {
        if (template && serverBundle && clientManifest) {
            ready()
            callback(serverBundle, template, clientManifest)
        }
    }

    //监视构建 template --> update --> 更新 Renderer渲染器
    const templatePath = resolve('../index.template.html')
    template = fs.readFileSync(templatePath, 'utf-8')
    update()

    //fs.watch fs.watchFile 
    //第三方包 chokidar
    chokidar.watch(templatePath).on('change', (event, path) => {
        template = fs.readFileSync(templatePath, 'utf-8')
        update()
    })

    //监视构建 serverBundle --> update --> 更新 Renderer渲染器
    const serverConfig = require('./webpack.server.config')
    const serverCompiler = webpack(serverConfig) //webpack创建的编译器

    const serverDevMiddleware = devMiddleware(serverCompiler, {
        logLevel: 'silent' //关闭日志输出 由插件管理
    })
    serverCompiler.hooks.done.tap('server', () => {
        //require 有缓存 ，不建议使用require
        //读取内存中文件
        serverBundle = JSON.parse(serverDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8'))
        update()
    })

    // serverCompiler.watch({}, (err, stats) => {
    //     if (err) throw err

    //     // stats 构建出的结果模块
    //     if (stats.hasErrors()) return

    //     //require 有缓存 ，不建议使用require
    //     serverBundle = JSON.parse(fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8'))
    //     update()
    // })

    //监视构建 clientManifest --> update --> 更新 Renderer渲染器
    const clientConfig = require('./webpack.client.config')


    //客户端webpack 新增hmr
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
    clientConfig.entry.app = [
        './src/entry-client.js',
        'webpack-hot-middleware/client?quiet=true&reload=true'
    ]
    clientConfig.output.filename = '[name].js' //热更新模式下不设置hash

    const clientCompiler = webpack(clientConfig) //webpack创建的编译器

    const clientDevMiddleware = devMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        logLevel: 'silent' // 关闭日志输出，由 FriendlyErrorsWebpackPlugin 处理
    })
    clientCompiler.hooks.done.tap('client', () => {
        clientManifest = JSON.parse(
            //读取内存中文件
            clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
        )
        update()
    })

    //挂载热更新
    server.use(hotMiddleware(clientCompiler, {
        noInfo: true,
        publicPath: clientConfig.output.publicPath
    }))

    //将middleware 挂载到express服务中， 提供对其内部内存中数据的访问    
    server.use(clientDevMiddleware)

    return onReady
}
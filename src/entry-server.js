// entry-server.js
import { createApp } from './app'

// export default context => {
//     // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
//     // 以便服务器能够等待所有的内容在渲染前，
//     // 就已经准备就绪。
//     return new Promise((resolve, reject) => {
//         const { app, router } = createApp()

//         // 设置服务器端 router 的位置
//         router.push(context.url)

//         // 等到 router 将可能的异步组件和钩子函数解析完
//         router.onReady(() => {
//             const matchedComponents = router.getMatchedComponents()
//                 // 匹配不到的路由，执行 reject 函数，并返回 404
//             if (!matchedComponents.length) {
//                 return reject({ code: 404 })
//             }

//             // Promise 应该 resolve 应用程序实例，以便它可以渲染 服务器会调用返回vue实例
//             resolve(app)
//         }, reject)
//     })
// }

//改为async /await
export default async context => {
    // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
    // 以便服务器能够等待所有的内容在渲染前，
    // 就已经准备就绪。
    const { app, router, store } = createApp()
    const meta = app.$meta()

    // 设置服务器端 router 的位置
    router.push(context.url)

    context.meta = meta

    // 等到 router 将可能的异步组件和钩子函数解析完
    await new Promise(router.onReady.bind(router))

    //将服务端预拉取数据同步到客户端(vuex)
    //服务端渲染完毕后调用
    context.rendered = () => {
        // Rendere会把context.state内联到页面模板中（脚本）
        // 最终发送给客户端的页面中包含一段脚本： window.__INITIAL_STATE__ = context.state的内容
        // 客户端拿出页面数据 填充到客户端的store 容器中
        context.state = store.state
    }

    //async 把普通对象包装成promise返回
    return app
}
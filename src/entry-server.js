//服务器端路由匹配 (server-side route matching) 和数据预取逻辑 (data pre-fetching logic)。
import { createApp } from './app'


export default context => {
    //Vue实例
    const { app } = createApp()
    return app
}
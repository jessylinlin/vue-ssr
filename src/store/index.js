import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export const createStore = () => {
    return new Vuex.Store({
        state: () => ({
            posts: []
        }),
        mutations: {
            setPosts(state, data) {
                state.posts = data
            }
        },
        actions: {
            //服务器渲染期间 actionsb必须返回一个Promise
            async getPosts({ commit }) {
                const { data } = await axios({
                    method: 'GET',
                    url: 'https://cnodejs.org/api/v1/topics'
                })

                commit('setPosts', data.data)
            }
        }
    })
}
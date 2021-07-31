<template>
  <div>
    <h1>Posts list</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">{{post.title}}</li>
    </ul>
  </div>
</template>

<script>
// import axios from 'axios'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PostList',
  metaInfo: {
    title: 'Posts'
  },
  data() {
    return {
      // posts: []
    }
  },
  computed: {
    ...mapState(['posts'])
  },
  //serverPrefetch 服务器端钩子 渲染前
  serverPrefetch() {
    // this.$store.dispatch('getPost')
    return this.getPosts(0)
    
  },
  methods: {
    ...mapActions(['getPosts'])
  }
  //服务器端渲染 不起作用
  //只支持created beforeCreate
  //不会等待异步操作
  //不支持响应式数据
}
</script>

<style>

</style>
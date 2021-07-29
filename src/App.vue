<template>
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
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: 'yyds'
    }
  },
  methods: {
      onclick() {
          console.log('test')
      }
  }
}
</script>

<style>

</style>
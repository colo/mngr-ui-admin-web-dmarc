<template>
  <div>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
	<!-- <dmarc-app/> -->
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:educativa')
debug.log = console.log.bind(console) // don't forget to bind to console!

// import dmarcApp from '@apps/dmarc/Index'

export default {
  name: 'AppEducativa',

  components: {
    // dmarcApp
  },

  props: {

  },
  data () {
    return {

    }
  },
  created: function () {

  },
  computed: {

  },
  methods: {

  }
}

</script>

<style lang="scss">
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
//
// #nav {
//   padding: 30px;
//
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>

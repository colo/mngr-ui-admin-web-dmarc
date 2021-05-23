<template>
  <div>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
		<div class="container mx-auto py-6 px-4">
			<div class="btn-group">
				<router-link
				:to="{name: 'EducativaSizeInstalls'}"
				custom
				v-slot="{ href, route, navigate, isActive, isExactActive }"
				>
					<button @click="navigate" class="btn" :class="(isActive) ? 'btn-active': '' ">Installs</button>
				</router-link>

				<router-link
				:to="{name: 'EducativaSizeEmails'}"
				custom
				v-slot="{ href, route, navigate, isActive, isExactActive }"
				>
					<button @click="navigate" class="btn" :class="(isActive) ? 'btn-active': '' ">Emails</button>
				</router-link>

			</div>
		</div>
    <router-view/>
  </div>
	<!-- <dmarc-app/> -->
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:educativa:size')
debug.log = console.log.bind(console) // don't forget to bind to console!

// import dmarcApp from '@apps/dmarc/Index'

export default {
  name: 'App',

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

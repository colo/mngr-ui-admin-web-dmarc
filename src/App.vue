<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:educativa')
debug.log = console.log.bind(console) // don't forget to bind to console!

// import dmarcApp from '@apps/dmarc/Index'

export default {
  name: 'Educativa',

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

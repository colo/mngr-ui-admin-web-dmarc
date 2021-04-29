<template>
  <div
    :class="config.class"
    :style="config.style"
  >
    <!-- linear-gauge | radial-gauge -->
    <bars
      :ref="id"
      :id="id"
      :data="values"
      v-bind="graphOptions"
    >
    </bars>

  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('components:wrappers:vueBars')
debug.log = console.log.bind(console) // don't forget to bind to console!

import chartWrapperMixin from '@mixins/chartWrapper.vue'

import Bars from 'vuebars'

export default {
  mixins: [chartWrapperMixin],

  name: 'vue-bars-wrapper',

  _vuebars_wrapper_defaults: {
    gradient: ['#6fa8dc', '#42b983', '#2c3e50'],
    // width
    // height
    // padding
    // rounding
    // barWidth
    // labelRotate
    // labelSize
    // labelColor
    // labelData
    // minBarHeight
    autoDraw: true,
    autoDrawEasing: 'ease',
    // growDuration:
    // max
    min: 0
  },

  components: {
    Bars
  },

  data () {
    return {
      values: []
    }
  },
  // watch: {
  //   visible: function (val) {
  //     this.container_class_helper = (val == false) ? 'invisible' : ''
  //     // console.log('class visible', val, this.container_class_helper)
  //   }
  // },

  // created () {
  //   this.config = this
  // },
  computed: {
    // Augment passed options with defaults for Dygraphs
    graphOptions: function () {
      return Object.merge(Object.clone(this.$options._vuebars_wrapper_defaults), this.config.options)
    },
  },
  methods: {
    // create () {
    //   this.update()
    // },
    update (data) {
      debug('update', data, this.get_data(data))

      this.values = this.get_data(data)

      // console.log('update', this.$refs[this.id].)
      // this.$refs[this.id].$data.config.options['value'] = this.stat.data.getLast()[1]
    },
    // update (data) {
    //   data = this.get_data(data)
    //   console.log('vueBars update', data)
    //
    //   this.$set(this, 'values', data)
    //
    //   // Array.each(data, function(d){
    //   //   this.values.push(data[1])
    //   // }.bind(this))
    // },

  }
}
</script>

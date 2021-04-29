<template>
  <div
    :class="config.class"
    :style="config.style"
  >
    <!-- linear-gauge | radial-gauge -->
    <trend
      :ref="id"
      :id="id"
      :data="values"
      v-bind="graphOptions"
    >
    </trend>

  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('components:wrappers:vueTrend')
debug.log = console.log.bind(console) // don't forget to bind to console!

import Trend from 'vuetrend'

import chartWrapperMixin from '@mixins/chartWrapper.vue'

// import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  mixins: [chartWrapperMixin],

  name: 'vue-trend-wrapper',

  _vuetrend_wrapper_defaults: {
    // autoDrawDuration: 1000, // 2000
    autoDrawEasing: 'ease',
    // gradient: ['#6fa8dc', '#42b983', '#2c3e50'],
    // padding: 8,
    // radius: 10, // 100
    smooth: true,
    // strokeWidth: 50
    gradientDirection: 'top',
    gradient: ['#b8f2e6', '#6fa8dc', '#42b983'],
    // padding: 12,
    // radius: 8,
    // strokeWidth: 10,
    // strokeLinecap: 'butt'
  },

  components: {
    Trend
  },

  // config: null,
  freezed: false,

  // props: {
  //   EventBus: {
  //     type: [Object],
  //     default: () => ({})
  //   },
  //   id: {
  //     type: [String],
  //     default: () => ('')
  //   },
  //   config: {
  //     type: [Object],
  //     default: () => ({})
  //   },
  //
  //   stat: {
  //     type: [Object],
  //     default: () => ({})
  //   },
  //
  //   freezed: {
  //     type: [Boolean],
  //     default: () => (false)
  //   },
  //   visible: {
  //     type: [Boolean],
  //     default: () => (true)
  //   },
  // },
  data () {
    return {
      values: [],
      // container_class_helper: '',
      // config: null,
      // highlighted: false,
      // ready: false,
      // to_suspend: false,
    }
  },
  watch: {
    visible: function (val) {
      this.container_class_helper = (val === false) ? 'invisible' : ''
      // console.log('class visible', val, this.container_class_helper)
    }
  },

  computed: {
    // Augment passed options with defaults for Dygraphs
    graphOptions: function () {
      return Object.merge(Object.clone(this.$options._vuetrend_wrapper_defaults), this.config.options)
    },
  },
  // created () {
  //   this.config = this
  // },
  methods: {

    update (data) {
      debug('update', data, this.get_data(data))
      // data = this.get_data(data)
      // // if (Array.isArray(data) && Array.isArray(data[0])) { // array of array, remove [0] from each row as it's the timestamp
      // //   let _data = []
      // //   Array.each(data, function (row) {
      // //     _data.push(row[1])
      // //   })
      // //
      // //   data = _data
      // // }
      //
      // this.values = data

      this.values = this.get_data(data)
    },

    // update () {
    //   this.$set(this, 'values', [])
    //
    //   Array.each(this.stat.data, function (data) {
    //     this.values.push(data[1])
    //   }.bind(this))
    //
    //   // console.log('this.values', this.values)
    // },
    // updateOptions (options, block_redraw){
    //
    //   let self = this
    //
    //   if(this.highlighted == false && this.ready == true
    //     // && this.$options.freezed <= 2//needed number of iterations to update data 'onRange'
    //     // && this.freezed == false
    //   ){
    //
    //       this.config.updateOptions(
    //         Object.merge(
    //           {
    //             'file': self.stat.data
    //           },
    //           options
    //         ),
    //         block_redraw
    //       );
    //
    //       this.config.setSelection(this.config.numRows() - 1, {}, false)
    //
    //
    //   }
    //
    // }
  }
}
</script>

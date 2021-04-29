<template>

  <div
  :class="config.class"
  :style="config.style"
  >

    <vue-apex-charts
      v-if="Object.getLength(options) > 0 && options.chart"
      :options="options"
      :series="series"
      v-bind="config.props"
      :id="id"
      :ref="id"
    >
    </vue-apex-charts>
  </div>

</template>

<script>

import * as Debug from 'debug'
const debug = Debug('components:wrappers:VueApexCharts')
debug.log = console.log.bind(console) // don't forget to bind to console!

import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
// Vue.component('apexchart', VueApexCharts)

import chartWrapperMixin from '@mixins/chartWrapper.vue'

import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  mixins: [chartWrapperMixin],

  name: 'vue-apex-charts-wrapper',

  components: {
    VueApexCharts
  },

  // chart: null,
  // freezed: false,

  props: {
    // container: {
    //   type: Object,
    //   default: () => ({
    //     class: undefined,
    //     style: undefined,
    //   })
    // },

  },

  data () {
    return {
      // ready: true,
      // value: undefined,
      // percent: undefined,
      // max: undefined,
      series: [],
      options: {}
    }
  },
  computed: {
    // Augment passed options with defaults for Dygraphs
    // graphOptions: function () {
    //   let options = Object.merge(this.defaultOptions, this.config.options)
    //
    //   // let line = Math.floor(options.size / 22)
    //   // if (line < 3) {
    //   //   line = 2
    //   // }
    //   //
    //   // // this.$set(options, 'line-width', line)
    //   // options['line-width'] = line
    //   return options
    // },
    defaultOptions: function () {
      return {
        // 'unit': '%',
        // 'scale-length': 5,
        // 'line-cap': 'round',
        // 'line-width': 7,
        // 'track-width': undefined,
        // 'size': 150,
        // 'rotate': 0,
        // // 'animate': {duration: 500, enabled: true},
        // 'animate': 500,
        // 'easing': undefined,
        // // 'track-color': '#f0f0f0', // easypiechart_track
        // // 'scale-color': '#dfe0e0', // easypiechart_scale
        // 'bar-color': dbColors.getColors(this.dark, this.colorScheme).getRandom(),
        // // 'track-color': dbColors.getColors(this.dark, this.colorScheme).getRandom(),
        // 'track-color': this.dark ? '#373b40' : '#dfe0e0',
        // 'scale-color': this.dark ? '#373b40' : '#dfe0e0',
      }
    },
    // elementClass: function() {
    //   return this.dark ? 'db-dygraphs db-dark' : 'db-dygraphs';
    // }
  },
  watch: {
    visible: function (val) {
      this.container_class_helper = (val === false) ? 'invisible' : ''
      // console.log('class visible', val, this.container_class_helper)
    },
    // dark: function () {
    //   // this.optionsChanged = true
    //   this.options = Object.merge(this.graphOptions, this.config.options)
    // },
    // colorScheme: function () {
    //   this.options = Object.merge(this.graphOptions, this.config.options)
    // },
    // config: {
    //   handler: function (val) {
    //     debug('config.options updated', this.id, this.options)
    //     this.options = Object.merge(this.graphOptions, this.config.options)
    //   },
    //   deep: true
    // }
  },

  // created () {
  //   let params = Object.merge(this.params, this.config.params)
  //   let line = Math.floor(params.size / 22)
  //   if (line < 3) {
  //     line = 2
  //   }
  //
  //   this.$set(this.params, 'line-width', line)
  // },

  methods: {
    create () {
      let options = Object.merge(this.defaultOptions, this.config.options)
      // Object.each(options, function (value, prop) {
      //   this.$set(this.options[prop], value)
      // }.bind(this))
      this.options = Object.assign({}, this.options, options)
      debug('create', this.id, this.options)
    },
    // format_value: function (percent) {
    //   let num = Number(percent).toFixed(1)
    //   return (isNaN(num)) ? '' : num
    // },

    update (data) {
      // debug('update', this.id, data, this.get_data(data).getLast())
      this.series = this.get_data(data)

      let options = Object.merge(this.defaultOptions, this.config.options)
      this.options = Object.assign({}, this.options, options)

      // // Object.each(options, function (value, prop) {
      // //   this.$set(this.options, prop, value)
      // // }.bind(this))
      //
      // this.$set(this.options, 'labels', options.labels)
      // let _options = this.options
      // this.options = _options
      // Object.each(options, function (value, prop) {
      //   this.$set(this.options, prop, value)
      // }.bind(this))

      debug('updated', this.id, this.series, this.options)
      // let val = this.get_data(data).getLast()
      // if (val && (!Array.isArray(val) || val.length === 2)) {
      //   if (Array.isArray(val) || val.length === 2) {
      //     this.value = val[1] // 0 => timestamp
      //   } else {
      //     this.value = val
      //   }
      // } else if (val) {
      //   this.max = val[val.length - 1]
      //   this.percent = val[val.length - 2]
      //   this.value = val[val.length - 3]
      // }
    },

  }
}
</script>

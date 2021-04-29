<template>
  <!-- <div
    :class="config.class"
    :style="config.style"
  > -->
    <component
      v-bind:is="component"
      :data="values"
      :dark="dark"
      v-on:db-event="handleDbEvent"
      :options="config.options"
      :plugins="plugins"
      :styles="config.style"
      :cssClasses="config.class"
      :width="width"
      :height="height"
      >
    </component>
    <!-- :chartId="id" -->

  <!-- </div> -->
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('components:wrappers:dbChartsjs')
debug.log = console.log.bind(console) // don't forget to bind to console!

import {
  DbChartjsBar,
  DbChartjsHorizontalBar,
  DbChartjsDoughnut,
  DbChartjsLine,
  DbChartjsPie,
  DbChartjsPolarArea,
  DbChartjsRadar,
  DbChartjsBubble,
  DbChartjsScatter
} from '@dashblocks/src/components/chartjs'

import chartWrapperMixin from '@mixins/chartWrapper.vue'

// import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  mixins: [chartWrapperMixin],

  components: {
    DbChartjsBar,
    DbChartjsHorizontalBar,
    DbChartjsDoughnut,
    DbChartjsLine,
    DbChartjsPie,
    DbChartjsPolarArea,
    DbChartjsRadar,
    DbChartjsBubble,
    DbChartjsScatter
  },
  name: 'db-chartsjs-wrapper',

  props: {
    // chartId: {
    //   default: chartId,
    //   type: String
    // },
    width: {
      default: 100,
      type: Number
    },
    height: {
      default: 100,
      type: Number
    },
    // cssClasses: {
    //   type: String,
    //   default: ''
    // },
    plugins: {
      type: Array,
      default () {
        return []
      }
    },
    component: {
      type: String,
      default: 'DbChartjsDoughnut',
    },
    // dbspec: Object,
    // dbdata: Object,
    // dark: {
    //   type: Boolean,
    //   default: false
    // },
    // themeClass: {
    //   type: String,
    //   default: ''
    // },
    // loglevel: {
    //   type: String,
    //   default: 'debug'
    // }
  },
  // _vuetrend_wrapper_defaults: {
  //   // autoDrawDuration: 1000, // 2000
  //   autoDrawEasing: 'ease',
  //   // gradient: ['#6fa8dc', '#42b983', '#2c3e50'],
  //   // padding: 8,
  //   // radius: 10, // 100
  //   smooth: true,
  //   // strokeWidth: 50
  //   gradientDirection: 'top',
  //   gradient: ['#b8f2e6', '#6fa8dc', '#42b983'],
  //   // padding: 12,
  //   // radius: 8,
  //   // strokeWidth: 10,
  //   // strokeLinecap: 'butt'
  // },

  // chart: null,
  freezed: false,

  data () {
    return {
      values: {},
    }
  },
  watch: {
    visible: function (val) {
      this.container_class_helper = (val === false) ? 'invisible' : ''
      // console.log('class visible', val, this.container_class_helper)
    }
  },

  // computed: {
  //   // Augment passed options with defaults for Dygraphs
  //   graphOptions: function () {
  //     return Object.merge(Object.clone(this.$options._vuetrend_wrapper_defaults), this.config.options)
  //   },
  // },
  // created () {
  //   this.config = this
  // },
  methods: {
    handleDbEvent (payload) {
      // log.debug(`DbDashboard: db-event:${payload.type || 'NO-TYPE'}`);
      this.$emit('db-event', payload)
    },
    update (data) {
      debug('update', data, this.get_data(data))

      this.values = this.get_data(data).getLast()
    },

  }
}
</script>

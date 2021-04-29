<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <div class="subheader">NET {{type}}</div>
      </div>
      <div class="d-flex align-items-baseline">
        <div class="h1 mb-0 mr-2">{{net}} {{unit}}</div>
        <div class="mr-auto">
          <span class="d-inline-flex align-items-center lh-1" :class="(diff_bytes > 0) ? 'text-red' : (diff_bytes < 0) ? 'text-green' : 'text-yellow'">
            {{diff_bytes}}
            <svg v-if="diff_bytes > 0" xmlns="http://www.w3.org/2000/svg" class="icon ml-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"/><polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" /></svg>
            <svg v-else-if="diff_bytes < 0" data-v-2a169e26="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-md"><path data-v-2a169e26="" stroke="none" d="M0 0h24v24H0z"></path><polyline data-v-2a169e26="" points="3 7 9 13 13 9 21 17"></polyline><polyline data-v-2a169e26="" points="21 10 21 17 14 17"></polyline></svg>
            <svg v-else data-v-2a169e26="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon icon-md"><path data-v-2a169e26="" stroke="none" d="M0 0h24v24H0z"></path><line data-v-2a169e26="" x1="5" y1="12" x2="19" y2="12"></line></svg>
          </span>
        </div>
      </div>
    </div>
    <chart
      v-if="chart"
      :wrapper="{
        type: wrapper,
        props: chart.props
      }"
      :always_update="false"
      :ref="'net.'+type"
      :id="'net.'+type"
      :EventBus="eventbus"
      :stat="chart_stat"
      :config="chart"
      :reactive="false"
      :no_buffer="false"
    >
    </chart>
  </div>

</template>
<script>
import * as Debug from 'debug'
const debug = Debug('apps:hosts:components:net')
debug.log = console.log.bind(console) // don't forget to bind to console!

import { BProgress, BProgressBar } from 'bootstrap-vue'

import { EventBus } from '@libs/eventbus'
// import chartTabular from 'components/chart.tabular'
import chart from 'components/chart'

import chartConfigNet from './config/net.apexchart'
import vueApexChartsWrapper from 'components/wrappers/vueApexCharts'

export default {
  name: 'AppHostsNet',

  components: {
    BProgress,
    BProgressBar,
    // chartTabular,
    chart
  },

  props: {
    stat: {
      type: Array,
      default: function () { return [] }
    },
    type: {
      type: String,
      default: 'In'
    }
  },

  watch: {
    'stat': {
      handler: function (newVal, oldVal) {
        debug('stat.data', oldVal, newVal)
        // let totalmem = 0
        let val = (newVal !== undefined && newVal[0] && newVal[0].value) ? newVal[0] : (oldVal !== undefined && oldVal[0] && oldVal[0].value) ? oldVal[0] : { value: 0}

        if (this.prev_value === undefined && val.timestamp !== undefined) {
          this.prev_value = val
        } else if (this.prev_value !== undefined) {
          let bytes = val.value
          let timediff = (val.timestamp - this.prev_value.timestamp) / 1000
          bytes = ((bytes - this.prev_value.value) / timediff).toFixed(2) * 1 // derive

          debug('stat.data BYTES', val.value, this.prev_value.value, bytes)

          if (bytes >= 0 && bytes !== null) {
            // let percentage = (((val.value.totalmem - val.value.freemem) * 100) / val.value.totalmem).toFixed(2) * 1
            this.prev_bytes = this.bytes
            this.bytes = (isNaN(bytes)) ? 0 : bytes
            this.diff_bytes = this.bytes - this.prev_bytes

            // totalmem = val.value.totalmem

            // let info = 'Bytes'
            let unit = 'Bs'
            let divider = 1
            if (this.bytes > 1099511627776) {
              unit = 'Tb'
              // info = 'MBytes'
              divider = 1099511627776
            } else if (this.bytes > 1073741824) {
              unit = 'Gb'
              // info = 'MBytes'
              divider = 1073741824
            } else if (this.bytes > 1048576) {
              unit = 'Mb'
              // info = 'MBytes'
              divider = 1048576
            } else if (this.bytes > 1024) {
              unit = 'Kb'
              // info = 'KBytes'
              divider = 1024
            }

            debug('stat.data', this.bytes, divider, unit)

            this.net = (this.bytes / divider).toFixed(1)
            this.chart_stat.data = [{ timestamp: Date.now(), value: (this.bytes / divider).toFixed(0) * 1}]// always in MB
            this.diff_bytes = (this.diff_bytes === this.bytes) ? 0 : (this.diff_bytes / divider).toFixed(1)

            this.unit = unit
          }

          this.prev_value = val
        }
      },
      deep: true,
      immediate: true
    }
  },
  // computed: {
  //   percentage: function () {
  //     let percentage = 0
  //     debug('percentage', this.stat)
  //     return percentage
  //   }
  // },
  data () {
    return {
      // height: '0px',
      diff_bytes: 0,
      prev_bytes: undefined,

      bytes: 0,
      net: 0,
      unit: 'bytes',
      prev_value: undefined,

      /**
      * dataSources
      **/
      // store: false,
      // pipeline_id: ['input.hosts.periodical'],
      //
      // id: 'input.hosts.memory.periodical',
      // path: 'all',

      // host: 'draco',
      // components: {
      //   'all': [
      //     {
      //       // some_data: {
      //       //   hosts: true
      //       // },
      //       source: {
      //         requests: requests,
      //         store: store
      //       }
      //     }
      //
      //   ]
      // },

      eventbus: EventBus,

      chart: chartConfigNet,
      wrapper: vueApexChartsWrapper,
      chart_stat: {
        data: [],
        length: 15
      },

    }
  },
  methods: {
    /**
    * @start pipelines
    **/
    // create_pipelines: function (create_id, next) {
    //   debug('create_pipelines %o', JSON.parse(JSON.stringify(this.$options.pipelines)))
    //
    //   let template = Object.clone(Pipeline)
    //
    //   let pipeline_id = template.input[0].poll.id
    //
    //   if (!create_id || create_id === undefined || create_id === pipeline_id) {
    //     // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
    //     let components_requests = {}
    //
    //     if (this.$options.pipelines[pipeline_id]) {
    //       components_requests = this.__merge_requests(pipeline_id, this.__components_sources_to_requests(this.components, pipeline_id))
    //
    //       this.destroy_pipelines(pipeline_id)
    //     } else {
    //       components_requests = this.__components_sources_to_requests(this.components, pipeline_id)
    //     }
    //
    //     debug('create_pipelines REQUESTS %o', components_requests)
    //
    //     Array.each(template.input[0].poll.conn, function (conn, index) {
    //       template.input[0].poll.conn[index].requests = components_requests
    //     })
    //
    //     let pipe = new JSPipeline(template)
    //
    //     this.$options.__pipelines_cfg[pipeline_id] = {
    //       ids: [],
    //       connected: [],
    //       suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
    //     }
    //
    //     this.$options.pipelines[pipeline_id] = pipe
    //   }
    //   debug('create_pipelines %o', this.$options.pipelines)
    //
    //   if (next) { next() }
    // }

    /**
    * @end pipelines
    **/

  }
}
</script>

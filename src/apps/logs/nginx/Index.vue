<template>
	<div class="container mx-auto py-6 px-4">
	</div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:nginx')
debug.log = console.log.bind(console) // don't forget to bind to console!

import JSPipeline from '../../../../modules/js-pipeline'

import Pipeline from '@libs/pipelines'
import InputIO from './pipelines/input/io'
// import InputIO from '@libs/pipelines/input/graphql.io'
// import IO from '@libs/pipelines/default.io'
import IO from './pipelines/io'
// import IO from '@libs/pipelines/default.graphql.io'
import DocIDFilter from '@libs/pipelines/filters/doc_id'
import OutputEventbus from '@libs/pipelines/output/eventbus'

import { requests, store } from './sources/index'
import {SECOND, MINUTE, HOUR, DAY, WEEK} from '@libs/time/const'
import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'
import DataSourcesMixin from '@mixins/dataSources'
import DashboardMixin from '@mixins/dashboard'

import { EventBus } from '@libs/eventbus'

// import dataTable from '@components/dataTable'
// import chart from '@components/chart'
// import chartTabular from '@components/chart.tabular'
// import frappeChartsWrapper from '@components/wrappers/frappeCharts'
// import frappeChartsConfig from '../../../../modules/mngr-ui-admin-charts/defaults/frappeCharts'
//
// import { format } from 'date-fns'
// import { es } from 'date-fns/locale'
// import flatPickr from 'vue-flatpickr-component'
// import 'flatpickr/dist/flatpickr.css'
// import 'flatpickr/dist/themes/material_blue.css'
//
// // import JsonViewer from 'json-viewer-js'
//
// import Treemap from '@components/Treemap'
//
// const formatSize = function (val) {
//   if (val > 1099511627776) {
//     val = (val / 1099511627776).toFixed(2) + ' Tb'
//   } else if (val > 1073741824) {
//     val = (val / 1073741824).toFixed(2) + 'Gb'
//   } else if (val > 1048576) {
//     val = (val / 1048576).toFixed(2) + ' Mb'
//   } else if (val > 1024) {
//     val = (val / 1024).toFixed(2) + ' Kb'
//   } else {
//     val += 'B'
//   }
//
//   return val
// }
export default {
  mixins: [DataSourcesMixin, DashboardMixin],
  name: 'AppLogsNginx',

  components: {
    // frappeChartsWrapper,
    // chartTabular,
    // chart,
    // dataTable,
    // flatPickr,
    // Treemap
  },

  props: {
    // dark: {
    //   type: Boolean,
    //   default: false,
    // },
    // fluid: {
    //   type: Boolean,
    //   default: false,
    // },
    // mode: {
    //   type: String,
    //   default: '',
    // },
  },

  data () {
    return {
      DAY: DAY,
      //
      // date: null,
      // datePickerMinDate: 0,
      //
      // filters_debounce: {
      //   domain: undefined,
      //   host: undefined,
      // },
      //
      // filters: {
      //   domain: [],
      //   host: []
      // },
      //
      // // servers: [],
      // hosts: [],
      // domains: [],
      //
      // rangeReportsTableOptions: {},

      height: '0px',
      /**
      * dataSources
      **/
      store: false,
      pipeline_id: ['input.logs.nginx.periodical'],

      id: 'input.logs.nginx.periodical',
      path: '/nginx',

      // host: 'perseus',
      components: {
        'all': [
          {
            // some_data: {
            //   size: true
            // },
            source: {
              requests: requests,
              store: store
            }
          }

        ]
      },

      EventBus: EventBus,
      //
      // size_info: [],
      // size_data: [],

      refresh: MINUTE,
      period: 'day',

    }
  },
  created: function () {
    let allow_filters = /(host|domain)/
    Object.each(this.$route.query, function (data, prop) {
      if (allow_filters.test(prop)) {
        // let selected = data
        debug('created selected_hosts', prop, data)
        if (data) {
          if (!Array.isArray(data)) data = [data]

          this.$set(this.filters, prop, data)
        } else {
          this.$set(this.filters, prop, [])
        }
      }
    }.bind(this))

    if (this.$route.query.report_id && this.$route.query.report_id !== 'undefined') { this.report_id = this.$route.query.report_id }

    if (this.$route.query.start_time && this.$route.query.start_time !== 'undefined') { this.start_time = this.$route.query.start_time * 1 }

    if (this.$route.query.current_time && this.$route.query.current_time !== 'undefined') {
      this.current_time = this.$route.query.current_time * 1 - HOUR
    } else {
      this.current_time = Date.now()
    }
  },
  mounted: function () {

  },
  watch: {
    'filters.host': function (val) {
      debug('filters.host', val)
      // if (this.filters_debounce.host.ts + 1000 < Date.now()) {
      //   debug('filters.host inmediate', val)
      //   this.setHosts()
      // } else {
      //   debug('filters.host setTimeout', val )
      if (this.filters_debounce.host !== undefined) clearTimeout(this.filters_debounce.host)
      this.filters_debounce.host = setTimeout(this.setHosts.bind(this), 500)
      // }

      // this.filters_debounce.host.ts = Date.now()
    },
    'filters.domain': function (val) {
      debug('filters.domain', val)
      // if (this.filters_debounce.domain.ts + 1000 < Date.now()) {
      //   debug('filters.domain inmediate', val)
      //   this.setDomains()
      // } else {
      //   debug('filters.domain setTimeout', val )
      if (this.filters_debounce.domain !== undefined) clearTimeout(this.filters_debounce.domain)
      this.filters_debounce.domain = setTimeout(this.setDomains.bind(this), 500)
      // }

      // this.filters_debounce.domain.ts = Date.now()
    },
    size_info: function (val) {
      debug('size_info', val)
      let hosts = []
      Array.each(val, function (row) {
        let domain = row.metadata.domain
        let host = row.metadata.host
        hosts.combine([host])
      })

      this.hosts = hosts
    },

  },
  computed: {
  },
  methods: {
    // formatSize: formatSize,
    roundHours: roundHours,
    setDates: function (dates) {
      // debug('setDates', dates)
      if (dates.length > 1 && dates[0].getTime() !== dates[1].getTime()) {
        debug('setDates both', dates)
        this.start_time = dates[0].getTime()
        this.current_time = dates[1].getTime() + DAY - MINUTE// + DAY to include full day on selected day
      } else {
        debug('setDates current', dates)
        this.current_time = dates[0].getTime() + DAY - MINUTE// + DAY to include full day on selected day
        this.start_time = undefined
      }

      if (this.$route.query.start_time !== this.start_time || this.$route.query.current_time !== this.current_time) {
        this.$router.replace({ query: { ...this.$route.query, start_time: this.start_time, current_time: this.current_time}}).catch(err => { debug('setDates', err) })
      }

      this.$options.pipelines[this.id].fireEvent('onOnce')
    },
    setHosts: function () {
      let query_host = (this.$route.query.host) ? JSON.parse(JSON.stringify(this.$route.query.host)) : ''
      let filter_host = JSON.parse(JSON.stringify(this.filters.host))
      debug('filters.host setHosts',
        filter_host,
        query_host,
        (!Array.isArray(query_host)),
        (Array.isArray(query_host) && (query_host.every(function (item) { return filter_host.contains(item) }) !== true || filter_host.every(function (item) { return query_host.contains(item) }) !== true))
      )
      if (
        !query_host ||
				(!Array.isArray(query_host) && (filter_host.length > 1 || !filter_host.contains(query_host))) === true ||
				(Array.isArray(query_host) &&
				(query_host.every(function (item) { return filter_host.contains(item) }) !== true || filter_host.every(function (item) { return query_host.contains(item) }) !== true))
      ) {
        this.$router.replace({ query: { ...this.$route.query, host: filter_host}}).catch(err => { debug('setHosts', err) })
        this.$options.pipelines[this.id].fireEvent('onOnce')
        // this.destroy_pipelines(this.id)
        // this.create_pipelines(this.id)
      }

      // this.filters_debounce.host.ts = Date.now()
      if (this.filters_debounce.host !== undefined) {
        clearTimeout(this.filters_debounce.host)
        this.filters_debounce.host = undefined
        // this.filters_debounce.host.ts = 0
      }
    },
    setDomains: function () {
      let query_domain = (this.$route.query.domain) ? JSON.parse(JSON.stringify(this.$route.query.domain)) : ''
      let filter_domain = JSON.parse(JSON.stringify(this.filters.domain))
      debug('filters.domain setDomains',
        filter_domain,
        query_domain,
        (!Array.isArray(query_domain)),
        (Array.isArray(query_domain) && (query_domain.every(function (item) { return filter_domain.contains(item) }) !== true || filter_domain.every(function (item) { return query_domain.contains(item) }) !== true))
      )
      if (
        !query_domain ||
				(!Array.isArray(query_domain) && (filter_domain.length > 1 || !filter_domain.contains(query_domain))) === true ||
				(Array.isArray(query_domain) &&
				(query_domain.every(function (item) { return filter_domain.contains(item) }) !== true || filter_domain.every(function (item) { return query_domain.contains(item) }) !== true))
      ) {
        this.$router.replace({ query: { ...this.$route.query, domain: filter_domain}}).catch(err => { debug('setDomains', err) })
        this.$options.pipelines[this.id].fireEvent('onOnce')
        // this.destroy_pipelines(this.id)
        // this.create_pipelines(this.id)
      }

      // this.filters_debounce.domain.ts = Date.now()
      if (this.filters_debounce.domain !== undefined) {
        clearTimeout(this.filters_debounce.domain)
        this.filters_debounce.domain = undefined
        // this.filters_debounce.domain.ts = 0
      }
    },
    formatMinStats: function (val) {
      if (val > 1000) {
        val = '+' + Math.round(val / 1000) + 'K'
      } else if (val > 1000000) {
        val = '+' + Math.round(val / 1000000) + 'M'
      }
      return val
    },

    /**
    * @start pipelines
    **/
    create_pipelines: function (create_id, next) {
      debug('create_pipelines %o', JSON.parse(JSON.stringify(this.$options.pipelines)), create_id, this.components)

      if (!create_id || create_id === undefined || create_id === this.id) {
        // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[this.id], this.id)
        let components_requests = {}

        if (this.$options.pipelines[this.id]) {
          components_requests = this.__merge_requests(this.id, this.__components_sources_to_requests(this.components, this.id))

          this.destroy_pipelines(this.id)
        } else {
          components_requests = this.__components_sources_to_requests(this.components, this.id)
        }

        let keys = this.components_to_keys(this.components)

        debug('create_pipelines REQUESTS %o', components_requests, keys)

        Array.each(keys, function (key) {
          if (
            EventBus &&
            (
              !EventBus._events['sent:' + this.id + '[' + key + ']'] ||
              (EventBus._events['sent:' + this.id + '[' + key + ']'] && EventBus._events['sent:' + this.id + '[' + key + ']'].length === 0)
              // (EventBus._events[pipeline_id + '.' + this.path] && !EventBus._events[pipeline_id + '.' + this.path].contains(this.__process_input_data))
            )
          ) {
            EventBus.$on('sent:' + this.id + '[' + key + ']', function (emit_query) {
              debug('start loader for', emit_query.params.id, emit_query)
            })
            EventBus.$on('received:' + this.id + '[' + key + ']', function (payload) {
              debug('stop loader for', payload)
            })
          }
        }.bind(this))

        let clients = []
        Array.each(IO(), function (io, index) {
          clients.push(
            new InputIO({
              requests: components_requests,
              // id: 'input.default' + index,
              id: this.id + index,
              index: index
            })
          )
        }.bind(this))

        let template = Pipeline({
          input: {
            // id: 'input.size',
            id: this.id,

            clients: clients,
            // clients: new InputIO({
            //   requests: components_requests,
            //   id: this.id + 0,
            //   index: 0
            // }),

            // type: 'minute', // second || minute || hour || day || once
            requests: {
              periodical: this.refresh,
              // periodical: function (dispatch) {
              //   // return cron.schedule('14,29,44,59 * * * * *', dispatch);//every 15 secs
              //   return cron.schedule('*/10 * * * * *', dispatch)// every 20 secs
              // },
            },
            suspended: false,
          },

          filters: [DocIDFilter],

          output: [OutputEventbus],

        })
        // debug('TEMPLATE', template)
        //
        // Array.each(template.input[0].clients, function (conn, index) {
        //   template.input[0].clients[index].requests = components_requests
        // })

        debug('TEMPLATE REQs', template)
        let pipe = new JSPipeline(template)

        this.$options.__pipelines_cfg[this.id] = {
          ids: [],
          connected: [],
          suspended: pipe.inputs.every(function (input) {
            debug('input', input)
            return input.options.suspended
          }, this)
        }

        this.$options.pipelines[this.id] = pipe
      }
      debug('create_pipelines %o', this.$options.pipelines)

      if (next) { next() }
    }

    /**
    * @end pipelines
    **/

  }
}
</script>

<style>
.dropdown:focus-within .dropdown-menu {
	transform: translate(0) scale(1);
	visibility: visible;
}
</style>

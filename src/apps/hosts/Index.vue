<template>
	<div class="container mx-auto py-6 px-4">
		<div class="card shadow-lg">
			<div class="card-body">
				<data-table id="hostsTable" :options="hostsTableOptions" :dataSet="hostsTableData" />
			</div>
		</div>
	</div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:hosts')
debug.log = console.log.bind(console) // don't forget to bind to console!

import JSPipeline from '../../../modules/js-pipeline'
import Pipeline from '@libs/pipelines'
import InputIO from '@libs/pipelines/input/io'
// import InputIO from '@libs/pipelines/input/graphql.io'
import IO from '@libs/pipelines/default.io'
// import IO from '@libs/pipelines/default.graphql.io'
import DocIDFilter from '@libs/pipelines/filters/doc_id'
import OutputEventbus from '@libs/pipelines/output/eventbus'

import { requests, store } from './sources/index'
import {SECOND, MINUTE, HOUR, DAY, WEEK} from '@libs/time/const'
import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'
import DataSourcesMixin from '@mixins/dataSources'
import DashboardMixin from '@mixins/dashboard'

import { EventBus } from '@libs/eventbus'

import dataTable from '@components/dataTable'
export default {
  mixins: [DataSourcesMixin, DashboardMixin],
  name: 'AppHosts',

  components: {
    dataTable
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
      hosts_data: [],
      reportTableData: [],
      reportTableOptions: {},

      filters_debounce: {
        domain: undefined,
        host: undefined,
      },

      filters: {
        domain: [],
        host: []
      },

      hosts: [],

      height: '0px',
      /**
      * dataSources
      **/
      store: false,
      pipeline_id: ['input.hosts.periodical'],

      id: 'input.hosts.periodical',
      path: 'all',

      // host: 'perseus',
      components: {
        'all': [
          {
            // some_data: {
            //   hosts: true
            // },
            source: {
              requests: requests,
              store: store
            }
          }

        ]
      },

      EventBus: EventBus,

      refresh: MINUTE,
      period: 'day',

    }
  },
  created: function () {
    /**
		* drawCallback needs to call "self.setReportID" so "rangeReportsTableOptions" are instantiated here
		**/
    this.hostsTableOptions = {
      deferRender: true,
      // stateSave: true,
      responsive: true,
      data: [],

      columns: [
        {
          title: 'Hostname',
          data: 'hostname',
          // render: function (data, type, row, meta) {
          //   // return format(data, 'E dd/MM/yyyy H:mm O')
          //   if (type === 'display') {
          //     // return `<a class="link link-primary open-item" href="javascript:void(0);" data-item-id=${row.id}>${data}</a>`
          //     return `<button class="btn btn-ghost  open-item" data-item-id=${data}>
          // 			<!-- Download SVG icon from http://tabler-icons.io/i/eye -->
          // 			<svg xmlns="http://www.w3.org/2000/svg" class="icon" data-item-id=${data} width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="2" /><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" /></svg>
          // 			${data}
          // 		</button>`
          //   } else {
          //     return data
          //   }
          // }
        },
        {
          title: '# CPUS',
          data: 'cpus',
          'width': '10%',
          render: function (data, type, row, meta) {
            // return format(data, 'E dd/MM/yyyy H:mm O')
            return data.length
          }
        },
        {
          title: 'CPUS DETAIL',
          data: 'cpus_detail',
          // render: function (data, type, row, meta) {
          //   // return format(data, 'E dd/MM/yyyy H:mm O')
          //   if (type === 'display') {
          //     // debug('table timestamp', row, meta)
          //     return format(data, 'PPPP HH:MM', {locale: es})
          //   } else {
          //     return data
          //   }
          // }
        },
        {
          title: 'Memory (GB)',
          data: 'totalmem',
          'width': '10%',
          // render: function (data, type) {
          //   // return format(data, 'E dd/MM/yyyy H:mm O')
          //   return `<div class="badge badge-success">${data}</div> `
          // }
          render: function (data, type, row, meta) {
            // return format(data, 'E dd/MM/yyyy H:mm O')
            if (type === 'display') {
              // return `<a class="link link-primary open-item" href="javascript:void(0);" data-item-id=${row.id}>${data}</a>`
              return Math.round(data / 1073741824) // GB 1073741824
            } else {
              return data
            }
          }
        },
        {
          title: 'platform',
          data: 'platform',
          'width': '10%',
          // render: function (data, type) {
          //   // return format(data, 'E dd/MM/yyyy H:mm O')
          //   return `<div class="badge badge-warning">${data}</div> `
          // }
        },
        {
          title: 'release',
          data: 'release',
          // 'width': '10%',
          // render: function (data, type) {
          //   // return format(data, 'E dd/MM/yyyy H:mm O')
          //   return `<div class="badge badge-error">${data}</div> `
          // }
        },
        {
          title: 'Arch',
          data: 'arch',
          'width': '5%',
          // render: function (data, type) {
          //   // return format(data, 'E dd/MM/yyyy H:mm O')
          //   return `<div class="badge badge-error">${data}</div> `
          // }
        },
      ],
      'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
      'columnDefs': [
        // {
        //   targets: [1, 2, 3],
        //   className: 'dt-center'
        // },
        // { 'visible': false, 'targets': 0 },
        {
          'targets': [0, 1, 2, 3, 4, 5, 6],
          // 'searchable': false,
          className: 'dt-body-center'
        }

      ],
      'order': [[ 0, 'asc' ]],
      'displayLength': 25,
      'drawCallback': function (settings) {
        let els = document.getElementsByClassName('open-item')
        debug('ELS', els)
        Array.each(els, function (el) {
          el.addEventListener('click', function (e) {
            debug('open-item', e.target.dataset.itemId)
            self.setReportID(e.target.dataset.itemId)
          })
        })

        let api = this.api()
        let rows = api.rows({page: 'current'}).nodes()
        let last = null

        // api.column(0, {page: 'current'}).data().each(function (group, i) {
        //   if (last !== group) {
        //     $(rows).eq(i).before(
        //       '<tr class="group"><td colspan="6">' + group + '</td></tr>'
        //     )
        //
        //     last = group
        //   }
        // })
      }
    }

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

  },
  computed: {
    hostsTableData: function () {
      let data = []
      Array.each(this.hosts_data, function (host, index) {
        let _data = host.data
        _data.cpus_detail = host.data.cpus[0].model
        data.push(_data)
      })
      debug('computed rangeReportsTableData', this.hosts_data, data)
      return data
    },

    // allDmarcSelected: {
    //   get: function () {
    //     if (this.selected_dmarc.length === 0) { return true }
    //
    //     return false
    //   },
    //   set: function (val) {
    //     debug('allDmarcSelected', val)
    //     if (val === true) {
    //       this.$router.replace({ query: { ...this.$route.query, selected_dmarc: []}}).catch(err => { debug('allDmarcSelected set', err) })
    //       this.selected_dmarc = []
    //     }
    //   }
    // },
  },
  methods: {
    roundHours: roundHours,
    // setReportID: function (id) {
    //   debug('setReportID', id)
    //   this.report_id = id
    //   this.$router.replace({ query: { ...this.$route.query, report_id: this.report_id}}).catch(err => { debug('setDates', err) })
    //
    //   if (id !== undefined) { this.$options.pipelines[this.id].fireEvent('onOnce') }
    // },
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
    // formatMinStats: function (val) {
    //   if (val > 1000) {
    //     val = '+' + Math.round(val / 1000) + 'K'
    //   } else if (val > 1000000) {
    //     val = '+' + Math.round(val / 1000000) + 'M'
    //   }
    //   return val
    // },
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
            // id: 'input.hosts',
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

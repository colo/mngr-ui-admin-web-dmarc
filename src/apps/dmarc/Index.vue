<template>
	<div class="container mx-auto py-6 px-4">
<!-- https://tailwindcomponents.com/component/pure-css-dropdown-using-focus-within-with-animation -->
<!-- <section class="text-gray-600 body-font"> -->
<div class="container  mx-auto flex items-center md:flex-row flex-col">
  <!-- <div class="flex flex-col md:pr-10 md:mb-0 mb-6 pr-0 w-full md:w-auto md:text-left text-center">
    <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">ROOF PARTY POLAROID</h2>
    <h1 class="md:text-3xl text-2xl font-medium title-font text-gray-900">Master Cleanse Reliac Heirloom</h1>
  </div> -->

	<!-- {{Object.keys(filters)}}
	Hosts: {{ (filters.host.length === 0 ) ? 'All' : filters.host.join(',')}} -->

  <div class="flex md:ml-auto md:mr-0 mx-auto items-center flex-shrink-0 space-x-4">

		<div class="z-50 relative inline-block text-left dropdown">
			<span class="rounded-md shadow-sm">
			<button class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
				<span>Domains</span>
				<svg class="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
			</button>
			</span>
			<div class="invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
				<div class="bg-white bg-opacity-100 absolute right-0 w-56 mt-2 origin-top-right border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
					<div class="px-4 py-3">
						<!-- <p class="text-sm leading-5">Signed in as</p>
						<p class="text-sm font-medium leading-5 text-gray-900 truncate">tom@example.com</p> -->
						<!-- <div class="form-control"> -->
						<label class="cursor-pointer label" v-for="domain in domains" :key="domain">
							<span class="label-text">{{domain}}</span>
							<div>
								<input type="checkbox" :value="domain" v-model="filters.domain" class="checkbox checkbox-primary">
								<!-- @input="addHost(domain)" :checked="(filters.domain && filters.domain.indexOf(domain) > -1) ? true : false" -->
								<span class="checkbox-mark"></span>
							</div>
						</label>
						<!-- </div> -->
					</div>
					<!-- <div class="py-1">
						<a href="javascript:void(0)" tabindex="0" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Account settings</a>
						<a href="javascript:void(0)" tabindex="1" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Support</a>
						<span role="menuitem" tabindex="-1" class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 cursor-not-allowed" aria-disabled="true">New feature (soon)</span>
						<a href="javascript:void(0)" tabindex="2" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >License</a>
					</div>
					<div class="py-1">
						<a href="javascript:void(0)" tabindex="3" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Sign out</a>
					</div> -->
				</div>
			</div>
		</div>

		<div class="z-50 relative inline-block text-left dropdown">
			<span class="rounded-md shadow-sm">
			<button class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
				<span>Hosts</span>
				<svg class="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
			</button>
			</span>
			<div class="invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
				<div class="bg-white bg-opacity-100 absolute right-0 w-56 mt-2 origin-top-right border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
					<div class="px-4 py-3">
						<!-- <p class="text-sm leading-5">Signed in as</p>
						<p class="text-sm font-medium leading-5 text-gray-900 truncate">tom@example.com</p> -->
						<!-- <div class="form-control"> -->
						<label class="cursor-pointer label" v-for="host in hosts" :key="host">
							<span class="label-text">{{host}}</span>
							<div>
								<input type="checkbox" :value="host" v-model="filters.host" class="checkbox checkbox-primary">
								<!-- @input="addHost(host)" :checked="(filters.host && filters.host.indexOf(host) > -1) ? true : false" -->
								<span class="checkbox-mark"></span>
							</div>
						</label>
						<!-- </div> -->
					</div>
					<!-- <div class="py-1">
						<a href="javascript:void(0)" tabindex="0" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Account settings</a>
						<a href="javascript:void(0)" tabindex="1" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Support</a>
						<span role="menuitem" tabindex="-1" class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 cursor-not-allowed" aria-disabled="true">New feature (soon)</span>
						<a href="javascript:void(0)" tabindex="2" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >License</a>
					</div>
					<div class="py-1">
						<a href="javascript:void(0)" tabindex="3" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Sign out</a>
					</div> -->
				</div>
			</div>
		</div>

		<div class="z-50 relative inline-block text-left dropdown">
			<span class="rounded-md shadow-sm">
				<flat-pickr
					v-model="date"
					:config="{
						position: 'auto right',
						minDate: datePickerMinDate,
						maxDate: 'today',
						mode: 'range',
						defaultDate: [roundHours(start()), roundHours(end())]
					}"
					@on-change="setDates"
					class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
				</flat-pickr>
			</span>
		</div>
    <!-- <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 512 512">
        <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
      </svg>
      <span class="ml-4 flex items-start flex-col leading-none">
        <span class="text-xs text-gray-600 mb-1">GET IT ON</span>
        <span class="title-font font-medium">Google Play</span>
      </span>
    </button>
    <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 305 305">
        <path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
        <path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
      </svg>
      <span class="ml-4 flex items-start flex-col leading-none">
        <span class="text-xs text-gray-600 mb-1">Download on the</span>
        <span class="title-font font-medium">App Store</span>
      </span>
    </button> -->
  </div>
</div>
<!-- </section> -->
		<div class="grid grid-cols-3 gap-4">
			<div class="card shadow-lg">
				<figure>
					<chart-tabular
						id="domainsPieFrappe"
						:wrapper="{
							type: frappeChartsWrapper,
							props: Object.merge({ options: Object.clone(frappePieConfig.options) }, {options: { data: { labels: domainsPieLabels } }})
						}"
						:config="Object.clone(frappePieConfig)"
						:dataset="{
							/* length: 1, */
							numeric: false,
							data: domainsPieDatasetsTabular,
						}"
						:buffer="false"

					>
					</chart-tabular>
				</figure>
				<div class="card-body">
					<h2 class="card-title">Domains
						<div class="badge mx-2 badge-primary">{{ formatMinStats(total_domains_count) }}</div>
					</h2>

				</div>
			</div>

			<div class="card shadow-lg">
				<figure>
					<chart
						id="hostsPieFrappe"
						:wrapper="{
							type: frappeChartsWrapper,
							props: { options: Object.clone(frappePieConfig.options) }
						}"
						:config="Object.clone(frappePieConfig)"
						:dataset="{
							length: 1,
							numeric: false,
							data: hostsPieDatasets,
						}"
						:buffer="false"
					>
					</chart>
				</figure>
				<div class="card-body">
					<h2 class="card-title">Hosts
						<div class="badge mx-2 badge-primary">{{ formatMinStats(total_hosts_count) }}</div>
					</h2>
				</div>
			</div>

			<div class="card shadow-lg">
				<figure>
					<chart
						id="dispositionPieFrappe"
						:wrapper="{
							type: frappeChartsWrapper,
							props: { options: Object.merge(Object.clone(frappePieConfig.options), { colors: ['#31C4DD', '#FCB10E', '#FE7289'] }) }
						}"
						:config="Object.clone(frappePieConfig)"
						:dataset="{
							length: 1,
							numeric: false,
							data: dispositionDatasets,
						}"
						:buffer="false"
					>
					</chart>
				</figure>
				<div class="card-body">
					<h2 class="card-title">Total dispositions
					<div class="badge mx-2 badge-primary">{{ formatMinStats(total_diposition_count) }}</div>
					</h2>
				</div>
			</div>
		</div>

		<!-- <section class="text-gray-600 body-font"> -->
			<!-- <div class="container px-5 py-24 mx-auto"> -->
			<div class="card">
				<div class="card-body">
					<div class="flex flex-wrap -m-4 text-center">
						<div class="p-3 sm:w-1/3 w-1/2">
							<h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">{{dmarc_data.length}}</h2>
							<p class="leading-relaxed">Reports</p>
						</div>
						<div class="p-3 sm:w-1/3 w-1/2">
							<h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">{{ formatMinStats(total_records_count)}}</h2>
							<p class="leading-relaxed">Records count</p>
						</div>
						<div class="p-3 sm:w-1/3 w-1/2">
							<h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">{{ formatMinStats(total_ips.length )}}</h2>
							<p class="leading-relaxed">IPs count</p>
						</div>
						<!-- <div class="p-4 sm:w-1/4 w-1/2">
							<h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">4</h2>
							<p class="leading-relaxed">Products</p>
						</div> -->
					</div>
				</div>
			</div>

			<!-- </div> -->
		<!-- </section> -->

		<div class="card shadow-lg">
			<div class="card-body">
				<data-table :options="tableOptions" :dataSet="tableData" :groupColumn="0" />
			</div>
		</div>

		<!-- <frappe-charts-wrapper
			:options="{
				title: 'My Awesome Chart',
				data: {
					labels: domainsPieLabels,
					datasets: []
				},
				type: 'donut', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
				height: 250,
			}"
			:datasets="domainsPieDatasets"
		/> -->

		<!-- {{dmarc}} -->
		<!-- <button class="btn btn-primary">DaisyUI Button</button>
		<ul>
			<li v-for="(report, index) in dmarc_data" :key="index">
				{{index + 1}}: {{report.metadata.domain}} : {{report.metadata.host}}
			</li>
		</ul> -->
	</div>

</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:dmarc')
debug.log = console.log.bind(console) // don't forget to bind to console!

import JSPipeline from '../../../modules/js-pipeline'
// import Pipeline from '@apps/dmarc/pipelines/periodical'
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
// import chartTabular from 'components/chart.tabular'
// import chart from 'components/chart'

import dataTable from '@components/dataTable'
import chart from '@components/chart'
import chartTabular from '@components/chart.tabular'
import frappeChartsWrapper from '@components/wrappers/frappeCharts'
// import frappeChartsWrapper from './components/frappeCharts'
import frappeChartsConfig from '../../../modules/mngr-ui-admin-charts/defaults/frappeCharts'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
// import { debounce } from 'debounce'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import 'flatpickr/dist/themes/material_blue.css'

export default {
  mixins: [DataSourcesMixin, DashboardMixin],
  name: 'AppDmarc',

  components: {
    frappeChartsWrapper,
    chartTabular,
    chart,
    dataTable,
    flatPickr
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
      // datepicker
      DAY: DAY,
      date: null,
      datePickerMinDate: 0,

      filters_debounce: {
        domain: undefined,
        host: undefined,
      },

      filters: {
        domain: [],
        host: []
      },

      hosts: [],
      domains: [],

      total_domains_count: 0,
      total_hosts_count: 0,
      total_diposition_count: 0,
      total_records_count: 0,
      total_ips: [],
      // domainsPieDatasets: [],
      domainsPieDatasetsTabular: [],
      domainsPieLabels: [],

      hostsPieDatasets: undefined,
      dispositionDatasets: undefined,

      // hostsPieDatasetsTabular: [],
      // hostsPieLabels: [],

      frappeChartsWrapper: frappeChartsWrapper,

      frappePieConfig: Object.merge(Object.clone(frappeChartsConfig), {
        interval: 1,
        watch: {
          skip: 0
        },

        options: {
          /* title: 'My Awesome Chart', */
          data: {
          },
          type: 'donut', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
          maxSlices: 6,
          /* height: 400, */
          /* colors: ['#7cd6fd', '#743ee2'] */
        }

      }),

      tableOptions: {
        deferRender: true,
        // stateSave: true,
        responsive: true,
        data: [],

        columns: [
          { data: 'domain' },
          // {
          //   title: 'Domain',
          //   data: 'domain',
          //   render: function (data, type) {
          //     // return format(data, 'E dd/MM/yyyy H:mm O')
          //     return `<a class="link link-primary">${data}</a>`
          //   }
          // },
          {
            title: 'Host',
            data: 'host'
          },
          // {
          //   title: 'Host',
          //   data: 'host',
          //   render: function (data, type) {
          //     // return format(data, 'E dd/MM/yyyy H:mm O')
          //     if (type === 'display') {
          //       // return `<a class="link link-primary" v-on:click="addHost(${data})">${data}</a>`
          //       return createElement('a', {
          //         class: {
          //           link: true,
          //           'link-primary': true
          //         },
          //         on: {
          //           click: this.addHost(data)
          //         }
          //
          //       }, data)
          //     } else {
          //       return data
          //     }
          //   }
          // },
          // { data: 'range' },
          {
            title: 'Time',
            data: 'timestamp',
            render: function (data, type) {
              // return format(data, 'E dd/MM/yyyy H:mm O')
              if (type === 'display') {
                return format(data, 'PPPP p', {locale: es})
              } else {
                return data
              }
            }
          },
          {
            title: 'None',
            data: 'none',
            'width': '10%',
            render: function (data, type) {
              // return format(data, 'E dd/MM/yyyy H:mm O')
              return `<div class="badge badge-success">${data}</div> `
            }
          },
          {
            title: 'Quarantine',
            data: 'quarantine',
            'width': '10%',
            render: function (data, type) {
              // return format(data, 'E dd/MM/yyyy H:mm O')
              return `<div class="badge badge-warning">${data}</div> `
            }
          },
          {
            title: 'Reject',
            data: 'reject',
            'width': '10%',
            render: function (data, type) {
              // return format(data, 'E dd/MM/yyyy H:mm O')
              return `<div class="badge badge-error">${data}</div> `
            }
          },
        ],
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        'columnDefs': [
          // {
          //   targets: [1, 2],
          //   className: 'dt-center'
          // },
          {
            targets: [1, 2],
            className: 'dt-center'
          },
          // {
          //   targets: [3, 4, 5],
          //   className: 'dt-body-center'
          // },
          // {
          //   // targets: -1,// not working
          //   targets: [3, 4, 5],
          //   className: 'dt-head-center'
          // },
          { 'visible': false, 'targets': 0 },
          {
            'targets': [3, 4, 5],
            'searchable': false,
            className: 'dt-body-center'
          }
          // { 'visible': false, 'targets': -1 }
        ],
        'order': [[ 2, 'desc' ], [ 0, 'asc' ]],
        'displayLength': 10,
        'drawCallback': function (settings) {
          let api = this.api()
          let rows = api.rows({page: 'current'}).nodes()
          let last = null

          api.column(0, {page: 'current'}).data().each(function (group, i) {
            if (last !== group) {
              $(rows).eq(i).before(
                '<tr class="group"><td colspan="5">' + group + '</td></tr>'
              )

              last = group
            }
          })
        }
      },
      height: '0px',

      // dmarc: [],
      //
      // selected_dmarc: [],
      /**
      * dataSources
      **/
      store: false,
      pipeline_id: ['input.dmarc.periodical'],

      id: 'input.dmarc.periodical',
      path: 'all',

      // host: 'perseus',
      components: {
        'all': [
          {
            // some_data: {
            //   dmarc: true
            // },
            source: {
              requests: requests,
              store: store
            }
          }

        ]
      },

      EventBus: EventBus,

      // stats: {
      //   all: {},
      // },
      //
      // // stat_memory: [],
      // // stat_cpus: [],
      // // stat_loadavg: [],
      // // stat_uptime: [],
      // // stat_blocks: [],
      // // stat_net_in: [],
      // // stat_net_out: [],
      //
      // // stat_world_map_country_counter: [],
      // // stat_world_map_city_counter: [],
      // geodata: {
      //   city_counter: [],
      //   country_counter: [],
      //   top_city_counter: [],
      //   top_country_counter: [],
      //   continent_counter: [],
      //   world_map_city_counter: [],
      //   top_world_map_city_counter: [],
      //   world_map_country_counter: [],
      //   top_world_map_country_counter: []
      // },
      //
      // traffic: {
      //   host_counter: [],
      //   domain_counter: [],
      //   top_host_counter: [],
      //   top_domain_counter: []
      // },

      dmarc_info: [],
      dmarc_data: [],

      top: 5,

      refresh: SECOND * 5,
      period: 'DAY',

      // // chart: Object.merge(chartConfig, {skip: 5}),
      // /**
      // * vGauge
      // **/
      // domains_chart: chartConfigDomains,
      // cpus_chart: chartConfigCpus,
      //
      // domainsWrapper: dygraphBarWrapper,
      // cpusWrapper: dygraphWrapper,
      // // cpusWrapper: vuePeityWrapper,
      // cpus_stat: {
      //   data: [],
      //   length: 360
      // },
      //
      // domains_stat: {
      //   data: [],
      //   length: 360
      // }
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

    if (this.$route.query.start_time && this.$route.query.start_time !== 'undefined') { this.start_time = this.$route.query.start_time * 1 }

    if (this.$route.query.current_time && this.$route.query.current_time !== 'undefined') {
      this.current_time = this.$route.query.current_time * 1 - HOUR
    } else {
      this.current_time = Date.now()
    }
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
    dmarc_info: function (val) {
      debug('dmarc_info', val)
      let count_domains = {}
      let count_hosts = {}
      let count_disposition = {none: 0, quarantine: 0, reject: 0}
      // this.total_records_count = 0
      // this.total_ips = []

      Array.each(val, function (row) {
        let domain = row.metadata.domain
        let host = row.metadata.host

        // count_disposition.none += (row.data.records && row.data.records.none) ? row.data.records.none.length : 0
        // count_disposition.quarantine += (row.data.records && row.data.records.quarantine) ? row.data.records.quarantine.length : 0
        // count_disposition.reject += (row.data.records && row.data.records.reject) ? row.data.records.reject.length : 0
        //
        // Object.each(row.data.records, function (disposition) {
        //   Array.each(disposition, function (record) {
        //     this.total_records_count += record.count
        //     this.total_ips.combine([ record.ip])
        //   }.bind(this))
        // }.bind(this))

        if (!count_domains[domain]) count_domains[domain] = 0
        count_domains[domain]++
        // this.domainsPieLabels.combine([domain])

        if (host && host !== undefined && host !== null) {
          if (!count_hosts[host]) count_hosts[host] = 0
          count_hosts[host]++
          // this.hostsPieLabels.combine([host])
        }
      })

      // this.total_diposition_count += count_disposition.none + count_disposition.quarantine + count_disposition.reject

      this.hosts = Object.keys(count_hosts)

      this.domains = Object.keys(count_domains)

      // this.domainsPieLabels.sort()
      // this.hostsPieLabels.sort()

      // let domains_dataset = []
      // Array.each(this.domainsPieLabels, function (domain) {
      //   domains_dataset.push(count_domains[domain])
      // })
      // // this.domainsPieDatasets = [{values: domains_dataset}]
      // this.domainsPieDatasetsTabular = domains_dataset // [{values: domains_dataset}]

      // let hosts_dataset = []
      // Array.each(this.hostsPieLabels, function (host) {
      //   // this.hostsPieDatasets
      //   hosts_dataset.push(count_hosts[host])
      // })

      // this.hostsPieDatasets = [count_hosts]
      // this.dispositionDatasets = [count_disposition]
      // this.hostsPieDatasets = [{values: hosts_dataset}]
      // this.hostsPieDatasetsTabular = hosts_dataset // [{values: hosts_dataset}]

      // debug('dmarc_info domains', this.domainsPieLabels, count_domains, domains_dataset)
      // debug('dmarc_data hosts', this.hostsPieLabels, count_hosts, hosts_dataset)
    },

    dmarc_data: function (val) {
      debug('dmarc_data', val)
      let count_domains = {}
      let count_hosts = {}
      let count_disposition = {none: 0, quarantine: 0, reject: 0}
      this.total_records_count = 0
      this.total_ips = []
      this.domainsPieLabels = []

      Array.each(val, function (row) {
        let domain = row.metadata.domain
        let host = row.metadata.host

        count_disposition.none += (row.data.records && row.data.records.none) ? row.data.records.none.length : 0
        count_disposition.quarantine += (row.data.records && row.data.records.quarantine) ? row.data.records.quarantine.length : 0
        count_disposition.reject += (row.data.records && row.data.records.reject) ? row.data.records.reject.length : 0

        Object.each(row.data.records, function (disposition) {
          Array.each(disposition, function (record) {
            this.total_records_count += record.count
            this.total_ips.combine([ record.ip])
          }.bind(this))
        }.bind(this))

        if (!count_domains[domain]) count_domains[domain] = 0
        count_domains[domain]++
        this.domainsPieLabels.combine([domain])

        if (host && host !== undefined && host !== null) {
          if (!count_hosts[host]) count_hosts[host] = 0
          count_hosts[host]++
          // this.hostsPieLabels.combine([host])
        }
      }.bind(this))

      this.total_diposition_count += count_disposition.none + count_disposition.quarantine + count_disposition.reject
      this.total_hosts_count = Object.keys(count_hosts).length
      this.total_domains_count = Object.keys(count_domains).length

      this.domainsPieLabels.sort()
      // this.hostsPieLabels.sort()

      let domains_dataset = []
      Array.each(this.domainsPieLabels, function (domain) {
        domains_dataset.push(count_domains[domain])
      })
      // this.domainsPieDatasets = [{values: domains_dataset}]
      this.domainsPieDatasetsTabular = domains_dataset // [{values: domains_dataset}]

      // let hosts_dataset = []
      // Array.each(this.hostsPieLabels, function (host) {
      //   // this.hostsPieDatasets
      //   hosts_dataset.push(count_hosts[host])
      // })

      this.hostsPieDatasets = [count_hosts]
      this.dispositionDatasets = [count_disposition]
      // this.hostsPieDatasets = [{values: hosts_dataset}]
      // this.hostsPieDatasetsTabular = hosts_dataset // [{values: hosts_dataset}]

      debug('dmarc_data domains', this.domainsPieLabels, count_domains, domains_dataset)
      // debug('dmarc_data hosts', this.hostsPieLabels, count_hosts, hosts_dataset)
    }
  },
  computed: {
    tableData: function () {
      let data = []
      Array.each(this.dmarc_data, function (report, index) {
        let _data = Object.merge(report.metadata, {
          none: (report.data.records && report.data.records.none) ? report.data.records.none.length : 0,
          quarantine: (report.data.records && report.data.records.quarantine) ? report.data.records.quarantine.length : 0,
          reject: (report.data.records && report.data.records.reject) ? report.data.records.reject.length : 0
        })
        data.push(_data)
      })
      debug('computed tableData', this.dmarc_data, data)
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
    setDates: function (dates) {
      // debug('setDates', dates)
      if (dates.length > 1 && dates[0].getTime() !== dates[1].getTime()) {
        debug('setDates both', dates)
        this.start_time = dates[0].getTime()
        this.current_time = dates[1].getTime() + DAY // + DAY to include full day on selected day
      } else {
        debug('setDates current', dates)
        this.current_time = dates[0].getTime() + DAY // + DAY to include full day on selected day
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
    // setDmarc: function (val) {
    //   this.$router.replace({ query: { ...this.$route.query, selected_dmarc: this.selected_dmarc}}).catch(err => { debug('setDmarc', err) })
    // },
    // setAllDmarc: function (val) {
    //   debug('setAllDmarc', val)
    //   // if (true) {
    //   //   this.selected_dmarc = []
    //   // }
    //   // // else{
    //   // //
    //   // // }
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
            // id: 'input.dmarc',
            id: this.id,

            clients: clients,
            // clients: new InputIO({
            //   requests: components_requests,
            //   id: this.id + 0,
            //   index: 0
            // }),

            // type: 'minute', // second || minute || hour || day || once
            requests: {
              periodical: 5000,
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

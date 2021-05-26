<!--
	https://codepen.io/diomed/pen/oNvMYgj
	https://datatables.net/
 -->
<template>

			<!-- <h2 class="card-title">no border with shadow</h2>
			<p>Rerum reiciendis beatae tenetur excepturi</p> -->
		<table :id="id" class="stripe hover" style="width:100%; padding-top: 1em;  padding-bottom: 1em;">
			<slot name="head"></slot>
			<slot></slot>
			<slot name="foot"></slot>
		</table>

	<!-- <div class="container mx-auto py-6 px-4">
		<h1 class="text-3xl py-4 border-b mb-10">Datatable</h1>

		<div x-show="selectedRows.length" class="bg-teal-200 fixed top-0 left-0 right-0 z-40 w-full shadow">
			<div class="container mx-auto px-4 py-4">
				<div class="flex md:items-center">
					<div class="mr-4 flex-shrink-0">
						<svg class="h-8 w-8 text-teal-600"  viewBox="0 0 20 20" fill="currentColor">  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
					</div>
					<div x-html="selectedRows.length + ' rows are selected'" class="text-teal-800 text-lg"></div>
				</div>
			</div>
		</div>

		<div class="mb-4 flex justify-between items-center">
			<div class="flex-1 pr-4">
				<div class="relative md:w-1/3">
					<input type="search"
						class="w-full pl-10 pr-4 py-2 rounded-lg shadow focus:outline-none focus:shadow-outline text-gray-600 font-medium"
						placeholder="Search...">
					<div class="absolute top-0 left-0 inline-flex items-center p-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-400" viewBox="0 0 24 24"
							stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
							stroke-linejoin="round">
							<rect x="0" y="0" width="24" height="24" stroke="none"></rect>
							<circle cx="10" cy="10" r="7" />
							<line x1="21" y1="21" x2="15" y2="15" />
						</svg>
					</div>
				</div>
			</div>
			<div>
				<div class="shadow rounded-lg flex">
					<div class="relative">
						<button v-on:click.stop="open = !open"
							class="rounded-lg inline-flex items-center bg-white hover:text-blue-500 focus:outline-none focus:shadow-outline text-gray-500 font-semibold py-2 px-2 md:px-4">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 md:hidden" viewBox="0 0 24 24"
								stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
								stroke-linejoin="round">
								<rect x="0" y="0" width="24" height="24" stroke="none"></rect>
								<path
									d="M5.5 5h13a1 1 0 0 1 0.5 1.5L14 12L14 19L10 16L10 12L5 6.5a1 1 0 0 1 0.5 -1.5" />
							</svg>
							<span class="hidden md:block">Display</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 ml-1" width="24" height="24"
								viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
								stroke-linecap="round" stroke-linejoin="round">
								<rect x="0" y="0" width="24" height="24" stroke="none"></rect>
								<polyline points="6 9 12 15 18 9" />
							</svg>
						</button>

						<div v-show="open" v-click-outside="close" class="z-40 absolute top-0 right-0 w-40 bg-white rounded-lg shadow-lg mt-12 -mr-1 block py-1 overflow-hidden">
							<template v-for="(heading, index) in headings">
								<label
									class="flex justify-start items-center text-truncate hover:bg-gray-100 px-4 py-2"
									:key="index"
									>
									<div class="text-teal-600 mr-3">
										<input type="checkbox" class="form-checkbox focus:outline-none focus:shadow-outline" checked @click="toggleColumn(heading.key)">
									</div>
									<div class="select-none text-gray-700" >{{heading.value}}</div>
								</label>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative"
			style="height: 405px;">
			<table class="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
				<thead>
					<tr class="text-left">
						<th class="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">
							<label
								class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer">
								<input type="checkbox" class="form-checkbox focus:outline-none focus:shadow-outline" @click="selectAllCheckbox($event);">
							</label>
						</th>
						<template v-for="(heading, index) in headings">
							<th
								:key="heading.key"
								class="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs"
								:ref="heading.key" :class="{ [heading.key]: true }"
							>
								{{heading.value}}
							</th>
						</template>
					</tr>
				</thead>
				<tbody>
					<template v-for="(user) in users">
						<tr :key="user.userId">
							<td class="border-dashed border-t border-gray-200 px-3">
								<label
									class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer">
									<input type="checkbox" class="form-checkbox rowCheckbox focus:outline-none focus:shadow-outline" :name="user.userId"
											@click="getRowDetail($event, user.userId)">
								</label>
							</td>
							<td class="border-dashed border-t border-gray-200 userId">
								<span class="text-gray-700 px-6 py-3 flex items-center">{{user.userId}}</span>
							</td>
							<td class="border-dashed border-t border-gray-200 firstName">
								<span class="text-gray-700 px-6 py-3 flex items-center" >{{user.firstName}}</span>
							</td>
							<td class="border-dashed border-t border-gray-200 lastName">
								<span class="text-gray-700 px-6 py-3 flex items-center" >{{user.lastName}}</span>
							</td>
							<td class="border-dashed border-t border-gray-200 emailAddress">
								<span class="text-gray-700 px-6 py-3 flex items-center"
									>{{user.emailAddress}}</span>
							</td>
							<td class="border-dashed border-t border-gray-200 gender">
								<span class="text-gray-700 px-6 py-3 flex items-center"
									>{{user.gender}}</span>
							</td>
							<td class="border-dashed border-t border-gray-200 phoneNumber">
								<span class="text-gray-700 px-6 py-3 flex items-center"
									>{{user.phoneNumber}}</span>
							</td>
						</tr>
					</template>
				</tbody>
			</table>
		</div>
	</div> -->

</template>

<script>
import * as Debug from 'debug'
const debug = Debug('components:dataTable')
debug.log = console.log.bind(console) // don't forget to bind to console!

import jquery from 'jquery'
import dt from 'datatables.net'
import 'datatables.net-responsive/js/dataTables.responsive.js'
import 'datatables.net-dt/css/jquery.dataTables.css'

export default {
  name: 'dataTable',
  props: {
    id: {
      type: String,
      default: 'dataTable',
    },
    dataSet: {
      type: [Array, Object],
      default: function () {
        return []
      }
    },
    options: {
      type: Object,
      default: function () {
        return {
          // data: [],
          columns: [
            { title: 'id' },
          ],
          'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']]
        }
      }
    },
    groupColumn: {
      type: Number,
      default: undefined
    }
  },

  data () {
    return {
      table: undefined,

    }
  },

  watch: {
    dataSet: function (val, old) {
      debug('watch dataSet', val, old)
      if (this.table !== undefined) {
        this.table.clear()
        this.table.rows.add(val)
        this.table.draw()
      }
    }
  },
  mounted: function () {
    let self = this
    // $(document).ready(function () {
    self.table = $('#' + self.id).DataTable(self.options).columns.adjust()
    if (self.options.responsive === true) { self.table.responsive.recalc() }

    // .responsive.recalc()
    // })

    if (this.groupColumn !== undefined) {
      // Order by the grouping
      $('#' + self.id).on('click', 'tr.group', function () {
        let currentOrder = self.table.order()[0]
        if (currentOrder[0] === self.groupColumn && currentOrder[1] === 'asc') {
          self.table.order([ self.groupColumn, 'desc' ]).draw()
        } else {
          self.table.order([ self.groupColumn, 'asc' ]).draw()
        }
      })
    }
  },
  methods: {
    // close: function () {
    //   this.open = false
    // },
    // toggleColumn: function (key) {
    //   // Note: All td must have the same class name as the headings key!
    //   let columns = document.querySelectorAll('.' + key)
    //
    //   debug('toggleColumn', key, this.$refs, columns)
    //
    //   if (this.$refs[key][0].classList.contains('hidden') && this.$refs[key][0].classList.contains(key)) {
    //     columns.forEach(column => {
    //       column.classList.remove('hidden')
    //     })
    //   } else {
    //     columns.forEach(column => {
    //       column.classList.add('hidden')
    //     })
    //   }
    // },
    //
    // getRowDetail: function ($event, id) {
    //   let rows = this.selectedRows
    //
    //   if (rows.includes(id)) {
    //     let index = rows.indexOf(id)
    //     rows.splice(index, 1)
    //   } else {
    //     rows.push(id)
    //   }
    // },
    //
    // selectAllCheckbox: function ($event) {
    //   let columns = document.querySelectorAll('.rowCheckbox')
    //
    //   this.selectedRows = []
    //
    //   if ($event.target.checked === true) {
    //     columns.forEach(column => {
    //       column.checked = true
    //       this.selectedRows.push(parseInt(column.name))
    //     })
    //   } else {
    //     columns.forEach(column => {
    //       column.checked = false
    //     })
    //     this.selectedRows = []
    //   }
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
	tr.group,
	tr.group:hover {
		background-color: #d2d6dc !important; /** #8da2fb **/
	}

/* Overrides to match the Tailwind CSS */

	.dataTables_wrapper {
		padding-top: 0.25rem;
		padding-bottom: 0.25rem
	}

	table.dataTable.no-footer {
		border-bottom-width: 1px;
		border-color: #d2d6dc
	}

	/* table.dataTable tbody td, table.dataTable tbody th {
		padding: 0.75rem 1rem;
		border-bottom-width: 1px;
		border-color: #d2d6dc
	} */

	div.dt-buttons {
		padding: 1rem 1rem 1rem 0;
		display: flex;
		align-items: center
	}

	.dataTables_filter, .dataTables_info {
		padding: 1rem
	}

	.dataTables_wrapper .dataTables_paginate {
		padding: 1rem
	}

	.dataTables_wrapper .dataTables_filter label input {
		padding: 0.5rem;
		/* border-width: 2px; */
		border-radius: 0.5rem;
		background-color: #edf2f7;
	}

	.dataTables_wrapper .dataTables_filter label input:focus {
		box-shadow: 0 0 0 3px rgba(118, 169, 250, 0.45);
		outline: 0;
	}

	table.dataTable thead tr {
		border-radius: 0.5rem
	}

	/* table.dataTable thead tr th:not(.text-center) {
		text-align: left
	} */

	table.dataTable thead tr th {
		background-color: #edf2f7;
		border-bottom-width: 2px;
		border-top-width: 1px;
		border-color: #d2d6dc
	}

	.dataTables_wrapper .dataTables_paginate .paginate_button.current:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button.next:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button.previous:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button:not(.disabled), button.dt-button {
		transition-duration: 150ms;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #374151 !important;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		font-size: 0.75rem;
		font-weight: 600;
		align-items: center;
		display: inline-flex;
		border-width: 1px !important;
		border-color: #d2d6dc !important;
		border-radius: 0.375rem;
		background: #ffffff;
		overflow: visible;
		margin-bottom: 0
	}

	.dataTables_wrapper .dataTables_paginate .paginate_button.next:focus:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button.next:hover:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button.previous:focus:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button.previous:hover:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button:focus:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button:hover:not(.disabled), button.dt-button:focus, button.dt-button:focus:not(.disabled), button.dt-button:hover, button.dt-button:hover:not(.disabled) {
		background-color: #edf2f7 !important;
		border-width: 1px !important;
		border-color: #d2d6dc !important;
		color: #374151 !important
	}

	.dataTables_wrapper .dataTables_paginate .paginate_button.current:not(.disabled) {
		background: #6875f5 !important;
		color: #ffffff !important;
		border-color: #8da2fb !important
	}

	.dataTables_wrapper .dataTables_paginate .paginate_button.current:hover, .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {
		background-color: #8da2fb !important;
		color: #ffffff !important;
		border-color: #8da2fb !important
	}

	.dataTables_wrapper .dataTables_length select {
		/* padding: .25rem; */
		/* border-radius: .25rem; */
		/* background-color: #edf2f7; */
		color: #4a5568; 			/*text-gray-700*/
		padding-left: 1rem; 		/*pl-4*/
		padding-right: 1rem; 		/*pl-4*/
		padding-top: .5rem; 		/*pl-2*/
		padding-bottom: .5rem; 		/*pl-2*/
		line-height: 1.25; 			/*leading-tight*/
		border-width: 2px; 			/*border-2*/
		border-radius: .25rem;
		border-color: #edf2f7; 		/*border-gray-200*/
		background-color: #edf2f7; 	/*bg-gray-200*/
	}

	.dataTables_wrapper .dataTables_length {
		padding-top: 1.25rem;
	}

	/* .dt-body-center {
		text-align: center;
	}

	.dt-head-center {
		text-align: center;
	}

	.dt-center {
		text-align: center;
	} */
</style>

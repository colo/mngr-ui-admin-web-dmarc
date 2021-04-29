<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Hosts</h3>
    </div>
    <div class="card-body border-bottom py-3">
      <div class="d-flex">
        <div class="text-muted">
          Show
          <div class="mx-2 d-inline-block">
            <input type="text" class="form-control form-control-sm" v-model="perPage" size="3">
          </div>
          entries
        </div>
        <div class="ml-auto text-muted">
          Search:
          <div class="ml-2 d-inline-block">
            <!-- <input type="text" class="form-control form-control-sm"> -->
            <b-input-group size="sm">
              <b-form-input
                v-model="filter"
                type="search"
                id="filterInput"
                placeholder="Type to Search"
              ></b-form-input>
              <!-- <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append> -->
            </b-input-group>
          </div>
        </div>
      </div>
    </div>
    <b-table
      :items="hosts"
      :fields="fields_avatar_hidden"
      responsive
      table-class="table-vcenter table-mobile-md card-table"
      :per-page="perPage"
      :current-page="currentPage"
      :filter="filter"
      :filter-included-fields="filterOn"
      @filtered="onFiltered"
      show-empty
      :busy="isBusy"
      :dark="dark"
      sort-by="hostname"
      :sort-desc="false"
    >
      <template #table-busy>
        <div class="text-center text-info my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <!-- <template v-slot:thead-top="data">
        <b-tr>
          <b-th class="w-1"><input class="form-check-input m-0 align-middle" type="checkbox"></b-th>
          <b-th class="w-1">HOSTNAME</b-th>
          <b-th>TITLE</b-th>
          <b-th>ROLE</b-th>
          <b-th></b-th>
        </b-tr>
      </template> -->
      <!-- A custom formatted column -->
      <!-- <template v-slot:cell(input)="data">
        <input class="form-check-input m-0 align-middle" type="checkbox" aria-label="Select invoice">
      </template> -->

      <!-- <template v-slot:cell(person)="data">
        <div class="d-flex py-1 align-items-center">
          <span class="avatar mr-2" :style="(data.value.avatar !== '') ? { 'background-image': 'url('+data.value.avatar+')' } : {}">
            <template v-if="data.value.avatar === ''">
              SA
            </template>
          </span>
          <div class="flex-fill">
            <div class="font-weight-medium">{{data.value.name}}</div>
            <div class="text-muted"><a href="#" class="text-reset">{{data.value.email}}</a></div>
          </div>
        </div>
      </template>

      <template v-slot:cell(title)="data">
        <div>{{data.value.head}}</div>
        <div class="text-muted">{{data.value.sub}}</div>
      </template>

      <template v-slot:cell(edit)="data">
        <div class="btn-list flex-nowrap">
          <b-dropdown variant="white" text="Actions" right>
            <b-dropdown-item href="#">Action</b-dropdown-item>
            <b-dropdown-item href="#">Another action</b-dropdown-item>
          </b-dropdown>

        </div>
      </template> -->

      <!-- cpus -->
      <!-- <template #cell(cpus_detail)="row">
        <b-button variant="info" size="sm" @click="toggleDetails('cpus', row)" class="mr-2">
          {{ row.detailsShowing && showDetails === 'cpus' ? 'Hide: ' : 'Show: '}} {{ row.item.cpus_detail[0].model }}
        </b-button>
      </template> -->

      <!-- networkInterfaces -->
      <template #cell(networkInterfaces)="row">
        <!-- {{row.item.networkInterfaces}} -->
        <b-button variant="info" size="sm" @click="toggleDetails('networkInterfaces', row)" class="mr-2">
          {{ row.detailsShowing && showDetails === 'networkInterfaces' ? 'Hide' : 'Show: '}}
          {{ Object.keys(row.item.networkInterfaces).join(', ') }}
        </b-button>
      </template>

      <!-- showDetails -->
      <template #row-details="row">
        <b-card v-if="showDetails === 'networkInterfaces'">
          <template v-for="(data, iface) in row.item.networkInterfaces">
            <b-row class="mb-2" :key="iface+'.name'">
              <b-col sm="3" class="text-sm-right"><b>Iface:</b></b-col>
              <b-col>{{ iface }}</b-col>
            </b-row>
            <!-- {{ data }} -->
            <b-row class="mb-2" :key="iface+'.data.'+index" v-for="(values, index) in data.if">
              <b-col sm="3" class="text-sm-right"></b-col>
              <b-col>
                <b-card>
                  <template v-for="(val, prop) in values" >
                    <div :key="iface+'.data.'+index+'.'+prop+'.1'">
                      {{ prop }} : {{ val }}
                    </div>
                  </template>
                </b-card>
              </b-col>

            </b-row>
          </template>

          <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button>
        </b-card>
        <b-card v-else-if="showDetails === 'cpus'">
          <b-row class="mb-2" v-for="(cpu, index) in row.item.cpus_detail" :key="index">
            <b-col sm="3" class="text-sm-right"><b>{{ cpu.model }}</b></b-col>
            <b-col >{{ cpu.speed }}</b-col>
          </b-row>

          <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button>
        </b-card>
      </template>

      <template v-slot:cell(edit)="data">
        <!-- {{data}} -->
        <div class="btn-list flex-nowrap">
          <b-dropdown variant="link" toggle-class="text-decoration-none" text="Actions" right>
            <b-dropdown-item :to="{ name: 'system', query: {selected_hosts: [data.item.hostname]}}">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12h4l3 8l4 -16l3 8h4" /></svg>
              </span>
              System
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'logs', query: {selected_hosts: [data.item.hostname], group_by: 'path'}}">
              <span>
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" ><path  stroke="none" d="M0 0h24v24H0z"></path><path  d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1 -4 0v-13a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1v12a3 3 0 0 0 3 3h11"></path><line  x1="8" y1="8" x2="12" y2="8"></line><line  x1="8" y1="12" x2="12" y2="12"></line><line  x1="8" y1="16" x2="12" y2="16"></line></svg>
              </span>
              Logs Summary
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'logs_web', query: {selected_hosts: [data.item.hostname], group_by: 'domain', layout: 'row'}}">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"></path><path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"></path><path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"></path></svg>
              </span>
              Logs Web
            </b-dropdown-item>
          </b-dropdown>

        </div>
      </template>
    </b-table>

    <div class="card-footer d-flex align-items-center">
      <p class="m-0 text-muted">Showing <span> {{(perPage * currentPage) - (perPage -1 ) }}</span> to <span>{{ lastItem }}</span> of <span>{{hosts.length}}</span> entries</p>
      <b-pagination
        v-model="currentPage"
        :total-rows="hosts.length"
        :per-page="perPage"
        aria-controls="my-table"
        class="m-0 ml-auto"
        prev-text="prev"
        next-text="next"
      ></b-pagination>
    </div>
  </div>
</template>
<script>
import * as Debug from 'debug'
const debug = Debug('apps:hosts:components:table')
debug.log = console.log.bind(console) // don't forget to bind to console!

import { BTable, BRow, BCol, BCard, BButton, BDropdown, BDropdownItem, BInputGroup, BFormInput, BTr, BTh, BPagination, BSpinner } from 'bootstrap-vue'

export default {
  name: 'AppHostsTable',
  // mixins: [DataSourcesMixin],

  components: { BTable, BRow, BCol, BCard, BButton, BDropdown, BDropdownItem, BInputGroup, BFormInput, BTr, BTh, BPagination, BSpinner },

  props: {
    selected_hosts: {
      type: Array,
      default: function () { return [] }
    },
    dark: {
      type: Boolean,
      default: false,
    },
    fluid: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: '',
    },
    stat: {
      type: Array,
      default: function () { return [] }
    }
  },
  watch: {
    selected_hosts: function (val) {
      if (this.hosts.length > 0) {
        let new_hosts = []
        Array.each(val, function (host) {
          Array.each(this.hosts, function (_host, index) {
            if (_host.hostname === host) {
              new_hosts.push(_host)
            }
          })
        }.bind(this))
        this.hosts = new_hosts
      }
    },
    'stat': {
      handler: function (newVal, oldVal) {
        debug('stat.data', oldVal, newVal)
        // this.hosts = []

        Array.each(newVal, function (host) {
          let found = false
          Array.each(this.hosts, function (_host) {
            if (_host.hostname === host.hostname) found = true
          })
          if (found === false && (this.selected_hosts.contains(host.hostname) || this.selected_hosts.length === 0)) {
            this.hosts.push({
              hostname: host.hostname,
              cpus: host.cpus.length,
              // cpus_detail: host.cpus,
              cpus_detail: host.cpus[0].model,
              totalmem: Math.round(host.totalmem / 1073741824), // GB
              type: host.type,
              release: host.release,
              arch: host.arch,
              networkInterfaces: host.networkInterfaces
            })
          }
        }.bind(this))

        this.isBusy = false
      },
      deep: true,
      // immediate: true
    }
  },

  data () {
    return {
      showDetails: undefined,
      isBusy: true,
      hosts: [
        // { input: null, person: { name: 'Lorry Mion', email: 'lmiona@livejournal.com', avatar: '../static/avatars/006m.jpg'}, title: { head: 'Automation Specialist IV', sub: 'Accounting' }, role: 'Accounting', edit: null},
        // { input: null, person: {name: 'Leesa Beaty', email: 'lbeatyb@alibaba.com', avatar: '../static/avatars/004f.jpg'}, title: { head: 'Editor', sub: 'Services' }, role: 'Admin', edit: null},
        // { input: null, person: {name: 'Perren Keemar', email: 'pkeemarc@yahoo.com', avatar: '../static/avatars/007m.jpg'}, title: { head: 'Analog Circuit Design manager', sub: 'Services' }, role: 'User', edit: null},
        // { input: null, person: { name: 'Sunny Airey', email: 'saireyd@prlog.org', avatar: ''}, title: { head: 'Nuclear Power Engineer', sub: 'Engineering' }, role: 'Owner', edit: null},
        // { input: null, person: { name: 'Geoffry Flaunders', email: 'gflaunderse@loc.gov', avatar: '../static/avatars/009m.jpg' }, title: { head: 'Software Test Engineer II', sub: 'Accounting' }, role: 'Admin', edit: null},

      ],

      /**
      * hide fields headers (to use only 'thead-top' slot)
      * https://stackoverflow.com/questions/49842860/how-to-hide-bootstrap-vue-table-header-row
      **/
      fields_avatar_hidden: [
        // {
        //   key: 'input',
        //   label: '',
        //   headerTitle: 'Select',
        //   sortable: false,
        //   thStyle: {
        //     display: 'none'
        //   }
        // },
        {
          key: 'hostname',
          label: 'hostname',
          sortable: true,
          // thStyle: {
          //   display: 'none'
          // }
        },
        {
          key: 'cpus',
          label: '# cpus',
          tdClass: 'text-muted',
          sortable: true,
          // thStyle: {
          //   display: 'none'
          // }
        },
        {
          key: 'cpus_detail',
          label: 'cpus detail',
          tdClass: 'text-muted',
          // class: 'w-1',
          sortable: false,
          // thStyle: {
          //   display: 'none'
          // }
        },
        {
          key: 'totalmem',
          label: 'Memory (GB)',
          tdClass: 'text-muted',
          sortable: true,
          // thStyle: {
          //   display: 'none'
          // }
        },
        {
          key: 'type',
          tdClass: 'text-muted',
          sortable: true,
          // thStyle: {
          //   display: 'none'
          // }
        },
        {
          key: 'release',
          tdClass: 'text-muted',
          sortable: true,
          // thStyle: {
          //   display: 'none'
          // }
        },
        {
          key: 'arch',
          tdClass: 'text-muted',
          sortable: true,
          class: 'w-1',
          // thStyle: {
          //   display: 'none'
          // }
        },
        {
          key: 'networkInterfaces',
          tdClass: 'text-muted',
          sortable: false,
          // thStyle: {
          //   display: 'none'
          // }
        },

        // {
        //   key: 'role',
        //   tdClass: 'text-muted',
        //   sortable: false,
        //   thStyle: {
        //     display: 'none'
        //   }
        // },
        {
          key: 'edit',
          class: 'w-1',
          label: '',
          headerTitle: 'Edit',
          sortable: false,
          // thStyle: {
          //   display: 'none'
          // }
        },
      ],
      /**
      *
      **/
      perPage: 10,
      currentPage: 1,
      filter: null,
      filterOn: [],
    }
  },
  computed: {
    lastItem: function () {
      return (this.perPage * this.currentPage < this.hosts.length) ? this.perPage * this.currentPage : this.hosts.length
    }
  },
  methods: {
    toggleDetails: function (id, row) {
      debug('toggleDetails', id)
      if (row._showDetails === false && this.showDetails !== undefined && id !== this.showDetails) row.toggleDetails()
      this.showDetails = id
      row.toggleDetails()
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>

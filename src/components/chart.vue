
<script>

let data_to_tabular = require('../../modules/node-tabular-data').data_to_tabular

import * as Debug from 'debug'
const debug = Debug('components:chart')
debug.log = console.log.bind(console) // don't forget to bind to console!

import graph from '@mixins/graph'
import dataset from '@mixins/dataset'

export default {
  mixins: [graph, dataset],

  // _chart_componets_defaults: {
  //   tabular: {
  //     lastupdate: 0,
  //     data: []
  //   }
  // },

  name: 'chart',

  charts: {},

  _chart_component_defaults: {
    type: 'dataset'
  },

  methods: {
    create () {
      debug('create', this.id)
      if (!this.$options['charts'][this.id]) {
        this.$options['charts'][this.id] = {}
      }

      this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._chart_component_defaults))
    },

    __update_data: function (data) {
      // debug('__update_data %s %o %o', this.id, JSON.parse(JSON.stringify(data)), this.chart_initialized)
      data = JSON.parse(JSON.stringify(data))
      if (data && data.length > 0) {
        debug('__update_data %s %o %o', this.id, data, this.chart_initialized)

        // let pre_process_data = []
        // Array.each(data, function (row) {
        //   debug('__update_data row %o', row)
        //   if (row.value && row.value.length > 0) {
        //     pre_process_data.push(row.value)
        //   }
        // })
        // debug('__update_data pre_process_data %s %o', this.id, pre_process_data)

        // if(this.$options.__chart_init ==== false){
        if (this.chart_initialized === false) {
          this.config = this.__process_dataset(this.config, this.id, data)
          debug('__update_data ->__process_dataset %s %o %o', this.id, data, this.chart_initialized)
          data_to_tabular(data, this.config, this.id, (data) => this.update_chart_dataset(this.id, data, true))
        } else {
          data_to_tabular(data, this.config, this.id, (data) => this.update_chart_dataset(this.id, data))
        }
      }
    },
    /**
    * copied to mngr-ui-admin-app/os
    **/
    __process_dataset (config, name, dataset) {
      debug('__process_dataset', this.id, config, JSON.parse(JSON.stringify(dataset)))
      // console.log('__process_dataset', name, dataset)
      if (!Array.isArray(dataset)) { dataset = [dataset] }

      if (isNaN(dataset[0].value)) {
        // sdX.datasets.

        let filtered = false
        if (config.watch && config.watch.filters) {
          Array.each(config.watch.filters, function (filter) {
            let prop_to_filter = Object.keys(filter)[0]
            let value_to_filter = filter[prop_to_filter]

            if (
              dataset[0].value[prop_to_filter] &&
              value_to_filter.test(dataset[0].value[prop_to_filter]) === true
            ) {
              filtered = true
            }
          })
        } else {
          filtered = true
        }

        if (filtered === true && typeof config.pre_process === 'function') {
          config = config.pre_process(config, name, dataset)

          this.__process_chart(config, name, dataset)
        }
      } else {
        if (typeof config.pre_process === 'function') {
          config = config.pre_process(config, name, dataset)
        }

        this.__process_chart(config, name, dataset)
      }

      // this.$set(this, 'chart_initialized', true)
      return config
    },

    /**
    * copied to mngr-ui-admin-app/os
    **/
    __process_chart (config, name, dataset) {
      debug('__process_chart', this.id)

      if (config.init && typeof config.init === 'function') {
        config.init(this, config, name, dataset, 'chart')
        // this.$set(this, 'chart_init', true)
      }
      // else {
      this.$set(this, 'chart_initialized', true)
      // }

      return config
    }

  }
}
</script>

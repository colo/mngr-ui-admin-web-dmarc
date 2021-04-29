
<script>
import * as Debug from 'debug'
const debug = Debug('components:chart.tabular')
debug.log = console.log.bind(console) // don't forget to bind to console!

import graph from '@mixins/graph'
import dataset from '@mixins/dataset'

export default {
  mixins: [graph, dataset],

  name: 'chartTabular',

  charts: {},

  _chart_tabular_component_defaults: {
    type: 'tabular'
  },

  methods: {
    create () {
      debug('create', this.id)
      if (!this.$options['charts'][this.id]) {
        this.$options['charts'][this.id] = {}
      }

      this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._chart_tabular_component_defaults))
    },

    __update_data: function (data) {
      debug('__update_data %s %o', this.id, data, this.dataset)

      if (data) {
        let inmediate = false
        if (this.chart_initialized === false) {
          // this.__process_dataset(this.chart, this.id, val)
          this.config = this.__process_chart(this.config, this.id, JSON.parse(JSON.stringify(data)))
          inmediate = true
        }

        let current = []
        if (!Array.isArray(data)) data = [data]

        // debug('__update_data2 %s %o', this.id, data)

        Array.each(data, function (row) {
          let insert_value = []

          // if (Array.isArray(row.value) || this.dataset.numeric !== true) {
          //   // Array.each(row.value, function (value, index) {
          //   //   value = (value) ? value * 1 : 0 // int cast
          //   //   row.value[index] = value
          //   //   // if (!value || isNaN(value)) { row.value[index] = 0 } // or should be undefined?
          //   // })
          //   insert_value = row.value
          // } else {
          //   insert_value = [row.timestamp, row.value]
          // }
          insert_value = [row.timestamp, row.value]

          // if you are not using buffer, you are managing your data, you are in charge of fixing values
          if (this.buffer === true && this.dataset.numeric === true) {
            // fix for incorrect values like "" (empty)
            if (Array.isArray(insert_value)) {
              Array.each(insert_value, function (value, index) {
                value = (value) ? value * 1 : 0 // int cast
                insert_value[index] = value
                // if (!value || isNaN(value)) { row.value[index] = 0 } // or should be undefined?
              })
            }
          }

          current.push(insert_value)
        }.bind(this))

        // debug('__create_watcher->generic_data_watcher',this.id, current, inmediate)
        debug('__update_data3 %s %o %o %o', this.id, data, current, this.chart_initialized, this.buffer, inmediate)

        this.update_chart_dataset(this.id, current, inmediate)
      }
    },
    __process_chart (config, name, dataset) {
      debug('__process_chart', this.id)
      /// /console.log('__process_chart', this.$options.dataset_data, name, dataset)

      if (config.init && typeof config.init === 'function') {
        config.init(this, config, name, dataset, 'chart-tabular')
        // this.$set(this, 'chart_initialized', true)
      }
      // else {
      this.$set(this, 'chart_initialized', true)
      // }

      // this.__create_watcher(name, config)
      return config
    }

  }
}
</script>

<template>
  <!-- <div
    :id="id+'-container'"
    class="netdata-container-with-legend"
    v-bind:class="container_class_helper"
  > -->
     <div
       :ref="id"
       :id="id"
       :class="config.class"
       :style="config.style"
     >

    </div>
    <!-- <div
    class="netdata-chart-legend"
    :id="id+'-netdata-chart-legend'"
    >
    </div> -->
  <!-- </div> -->
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('components:wrappers:frappeCharts')
debug.log = console.log.bind(console) // don't forget to bind to console!

import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm'

import chartWrapperMixin from '@mixins/chartWrapper.vue'

// import netDataColors from '@libs/netdata/colors'

// import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  mixins: [chartWrapperMixin],

  name: 'frappe-charts-wrapper',

  _frappe_charts_wrapper_defaults: {
  },

  data () {
    return {
      // values: [],
      // labels: [],
      container_class_helper: '',
      frappe: undefined,
      // config: null,
      // highlighted: false,
      // ready: false,
      // to_suspend: false,
    }
  },
  // watch: {
  //   visible: function (val) {
  //     this.container_class_helper = (val == false) ? 'invisible' : ''
  //     // console.log('class visible', val, this.container_class_helper)
  //   }
  // },
  computed: {
    // Augment passed options with defaults for Dygraphs
    graphOptions: function () {
      let options = Object.merge(this.defaultOptions, this.config.options)
      return options
    },
    defaultOptions: function () {
      return {
        type: 'pie'
      }
    },

  },
  watch: {
    visible: function (val) {
      this.container_class_helper = (val === false) ? 'invisible' : ''
      // console.log('class visible', val, this.container_class_helper)
    },
    // dark: function () {
    //   // this.optionsChanged = true
    //   // this.params = Object.merge(this.graphOptions, this.config.options)
    //   this.create()
    //   this.update()
    // },
    // colorScheme: function () {
    //   // this.params = Object.merge(this.graphOptions, this.config.options)
    //   this.create()
    //   this.update()
    // }
  },

  // created () {
  //   let unwatch = this.$watch('stat.data', function (val, oldVal) {
  //     /// /console.log('created', this.id, this.stat.data)
  //
  //     // if(val.length > 1 && this.config == null){
  //     if (val.length > 1) {
  //       this._values()
  //       unwatch()
  //     }
  //   })
  // },
  methods: {
    create: function () {
      if (!this.$options['charts'][this.id]) {
        this.$options['charts'][this.id] = {}
      }

      this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._frappe_charts_wrapper_defaults))
      this.$options.charts[this.id].chart_options = this.graphOptions // Object.clone(this.config.options)
      // this.$options.charts[this.id].__unwatch_options = this.$watch('config.options', function (val) {
      //   // this.$options.charts[this.id].chart_options = this.graphOptions // Object.clone(val)
      //   this.create()
      // })//, { deep: true }
    },
    _create_frappe: function () {
      if (!this.$options['charts'][this.id].graph) {
        if (document.getElementById(this.id)) {
          let data = this.handle_data(this.get_data())
          this.$options.charts[this.id].chart_options.data = data

          debug('create', this.id, this.$options.charts[this.id].chart_options, data)

          this.$options['charts'][this.id].graph = new Chart(
            document.getElementById(this.id), // containing div
            this.$options.charts[this.id].chart_options
          )

          if (this.config.init) { this.config.init(this, this.$options.charts[this.id].graph, this.id, this.$options.charts[this.id].chart_options.data, 'frappe') }
        }

        // this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], this.defaultOptions)

        // let newData = this.format_values(this.values)
        // if (newData.length > 0) {
        //   this.init_chart(newData)
        // }
      }
    },
    detroy: function () {
      // if (this.$options['charts'][this.id].config !== undefined && this.$options['charts'][this.id].config.clear && typeof this.$options['charts'][this.id].config.clear === 'function') {
      //   this.$options['charts'][this.id].config.clear()
      // }
    },
    get_data: function (data) {
      data = (data && data.length > 0) ? data : (this.chart_data && this.chart_data.length > 0 && this.chart_data[0][0]) ? this.chart_data : this.$options.charts[this.id].buffered_data
      data = JSON.parse(JSON.stringify(data))
      return data
    },
    update: function (data) {
      debug('update', this.id, data, this.$options.charts[this.id].buffered_data, this.chart_data, this.$options.charts[this.id].graph)
      let last = this.get_data(data).getLast()
      if (last.labels && this.$options.charts[this.id].graph) {
        this.$options.charts[this.id].graph.update(this.handle_data(last))
      } else if (this.$options.charts[this.id].graph) {
        this.$options.charts[this.id].graph.update(this.handle_data(this.get_data(data)))
      }
      // this.handle_data(this.get_data(data).getLast())
      if (data && data.length > 0) {
        this.$options.charts[this.id].buffered_data = Array.clone(data)
      }

      if (!this.$options.charts[this.id].graph) {
        this._create_frappe()
      }

      // this.$options.charts[this.id].graph.draw()
    },
    handle_data: function (value) {
      debug('handle_data', value)

      let data = {labels: [], datasets: []}
      if (value && Array.isArray(value) && value.length === 1 && value[0].labels && value[0].datasets) { value = value[0] }

      if (value && value.labels && value.datasets) {
        data = value
      } else if (this.$options.charts[this.id].chart_options.labels) {
        data.labels = this.$options.charts[this.id].chart_options.labels
        data.datasets = value
      }
      debug('handle_data return', data)
      return data
    }
    // _values () {
    //   let options = Object.clone(this.graphOptions)
    //
    //   this.frappe = new Chart(
    //     document.getElementById(this.id), // containing div
    //     options
    //   )
    //
    //
    //   if (this.config.init) { this.config.init(this, this.config, 'frappe') }
    // },
    // update () {
    //   let data = {
    //     labels: [],
    //     datasets: []
    //   }
    //
    //   // const skip = 15
    //   Array.each(this.stat.data, function (column, index) {
    //     // if(index == 0 || (index % skip == 0)){
    //
    //     data.labels.push(new Date(column[0]).toLocaleTimeString())
    //
    //     Array.each(column, function (value, value_index) {
    //       if (value_index != 0) {
    //         if (!data.datasets[value_index - 1]) {
    //           data.datasets[value_index - 1] = {
    //             name: this.config.options.data.datasets[value_index - 1].name,
    //             chartType: this.config.options.data.datasets[value_index - 1].chartType,
    //             values: []
    //           }
    //         }
    //
    //         data.datasets[value_index - 1].values.push(parseFloat((value.toFixed) ? value.toFixed(2) : value))
    //       }
    //     }.bind(this))
    //
    //     // }
    //   }.bind(this))
    //
    //   // console.log(data)
    //   this.config.update(data)
    // },

  }
}
</script>

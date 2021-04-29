<template>
   <div
		:ref="id"
		:id="id"
		:class="config.class"
		:style="config.style"
   >
  </div>

</template>

<script>
import * as Debug from 'debug'
const debug = Debug('components:wrappers:frappeCharts')
debug.log = console.log.bind(console) // don't forget to bind to console!

import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm'

import chartWrapperMixin from '@mixins/chartWrapper.vue'

// import netDataColors from '@libs/netdata/colors'

// import dbColors from '@dashblocks/src/components/dbcolors'

import { v4 as uuidv4 } from 'uuid'

export default {
  mixins: [chartWrapperMixin],

  name: 'frappe-charts-wrapper',

  // _frappe_charts_wrapper_defaults: {
  // },
  props: {
    /**
     * Enable dark mode
     *
     * `true,false`
     */
    // dark: {
    //   type: Boolean,
    //   default: false
    // },
    /**
     * Color Scheme Name
     * App may define multiple color schemes for different charts
     * and use this prop to specify which colorScheme to use
     * default: "default" - refers to default dashblocks colorScheme which is always defined
     */
    // colorScheme: {
    //   type: String,
    //   default: 'default'
    // },
    // EventBus: {
    //   type: [Object],
    //   default: () => ({})
    // },
    // id: {
    //   type: [String],
    //   default: () => (uuidv4())
    // },
    // options: {
    //   type: [Object],
    //   default: () => ({})
    // },
    // config: {
    //   type: [Object],
    //   default: () => ({})
    // },
    // datasets: {
    //   type: [Array, Object],
    //   default: () => ([])
    // },
    // data_length: {
    //   type: [Number]
    //   // default: () => ([])
    // },
    // freezed: {
    //   type: [Boolean],
    //   default: () => (false)
    // }
    //
  },
  // data () {
  //   return {
  //     graph: undefined,
  //     buffer: []
  //   }
  // },
  computed: {
    // // Augment passed options with defaults for Dygraphs
    // graphOptions: function () {
    //   let options = Object.merge(this.defaultOptions, this.config.options)
    //   return options
    // },
    // defaultOptions: function () {
    //   return {
    //     type: 'pie'
    //   }
    // },

  },
  // watch: {
  //   // visible: function (val) {
  //   //   this.container_class_helper = (val === false) ? 'invisible' : ''
  //   //   // console.log('class visible', val, this.container_class_helper)
  //   // },
  //   // datasets: function (val) {
  //   //   this.update(val)
  //   // },
  //   options: function (val, old) {
  //     if (JSON.stringify(val) !== JSON.stringify(old)) {
  //       debug('watch options', this.id, JSON.parse(JSON.stringify(val)), JSON.parse(JSON.stringify(old)))
  //       this.graph = undefined
  //       this.create()
  //     }
  //   },
  //   // config: function (val) {
  //   //   debug('watch config', this.id, val)
  //   //   this.graph = undefined
  //   //   this.create()
  //   // },
  //   config: function (val, old) {
  //     if (JSON.stringify(val) !== JSON.stringify(old)) {
  //       debug('watch config', this.id, JSON.parse(JSON.stringify(val)), JSON.parse(JSON.stringify(old)))
  //       this.graph = undefined
  //       this.create()
  //     }
  //   },
  // },

  mounted () {
    this.create()
  },
  methods: {
    create: function () {
      debug('create', this.id)

      if (document.getElementById(this.id)) {
        // this.graph = new Chart(
        //   document.getElementById(this.id), // containing div
        //   this.options
        // )
        let data = this.__handle_data(this.get_data(this.options.data.datasets || {}))
        // this.options.data = data
        let options = Object.merge(Object.clone(this.config.options), Object.clone(this.options), {data: data})

        debug('creating...', this.id, options)
        if (data && data.datasets && data.datasets.length > 0) {
          this.graph = new Chart(
            document.getElementById(this.id), // containing div
            options
          )

          if (this.config && this.config.init) { this.config.init(this, this.graph, this.id, options.data, 'frappe') }
        }
      }
    },

    // detroy: function () {
    //   // if (this.$options['charts'][this.id].config !== undefined && this.$options['charts'][this.id].config.clear && typeof this.$options['charts'][this.id].config.clear === 'function') {
    //   //   this.$options['charts'][this.id].config.clear()
    //   // }
    // },
    update: function (data) {
      debug('update', this.id, data, this.$options.charts[this.id].buffer, this.datasets, this.graph)
      data = this.get_data(data)
      let last = data.getLast()
      if (last.labels && this.graph) {
        debug('updating LAST', this.id, this.__handle_data(last))
        this.graph.update(this.__handle_data(last))
      } else if (this.graph) {
        debug('updating', this.id, this.__handle_data(data))
        this.graph.update(this.__handle_data(data))
      }
      // this.__handle_data(this.get_data(data).getLast())
      // if (data && data.datasets && data.datasets.length > 0) {
      //   this.$options.charts[this.id].buffer = Array.clone(data.datasets)
      // } else if (data && Array.isArray(data)) {
      this.$options.charts[this.id].buffer = Array.clone(data)
      // }

      if (!this.graph) {
        this.create()
      }

      // this.graph.draw()
    },
    // get_data: function (data) {
    //   debug('get_data', data, this.datasets, this.$options.charts[this.id].buffer)
    //   data = (data && data.length > 0) ? data : (this.datasets && this.datasets.length > 0) ? this.datasets : this.$options.charts[this.id].buffer
    //   data = JSON.parse(JSON.stringify(data))
    //   debug('get_data return', data)
    //   return data
    // },
    __handle_data: function (value) {
      debug('__handle_data', this.id, value)
      let data = {labels: [], datasets: []}
      if (value && Array.isArray(value) && value.length === 1 && value[0].labels && value[0].datasets) { value = value[0] }

      if (value && value.labels && value.datasets) {
        data = value
      } else if (this.options.data.labels) {
        data.labels = this.options.data.labels
        if (Array.isArray(value)) {
          if (value[0] && Array.isArray(value[0])) {
            data.datasets = []
            Array.each(value, function (_val) {
              data.datasets.push({ values: _val })
            })
          } else {
            data.datasets = [{ values: value }]
          }
        } else {
          data.datasets = value
        }
        // if (value.values && value.values !== undefined) {
        //   debug('__handle_data', value, value.values)
        //   data.datasets = value
        // } else {
        //   data.datasets = [{ values: value }]
        // }
      }
      debug('__handle_data return', data)
      return data
    }
  }
}
</script>

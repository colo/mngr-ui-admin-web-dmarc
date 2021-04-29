<template>

<div
  :class="config.class"
  :style="config.style"
>
  <peity
    :key="id+'.'+dark+'.'+colorScheme"
    :ref="id"
    :id="id"
    :options="graphOptions"
    v-bind="config.props"
    :data="formattedData"
  />
</div>

</template>

<script>

import * as Debug from 'debug'
const debug = Debug('components:wrappers:vuePeity')
debug.log = console.log.bind(console) // don't forget to bind to console!

import Peity from 'vue-peity'

import chartWrapperMixin from '@mixins/chartWrapper.vue'

import netDataColors from '@libs/netdata/colors'

import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  mixins: [chartWrapperMixin],
  name: 'vue-peity-wrapper',

  components: { Peity },

  _vuepeity_wrapper_defaults: {

  },

  computed: {
    formattedData: function () {
      let value = (this.value && typeof this.value === 'string') ? this.value : (this.config && this.config.props && this.config.props.data) ? this.config.props.data : ''
      debug('formattedData', value)
      if (typeof value !== 'string') { value = '' }

      debug('formattedData', value)
      return value
    },
    // Augment passed options with defaults for Dygraphs
    graphOptions: function () {
      let options = Object.merge(this.defaultOptions, this.config.options)

      return options
    },
    defaultOptions: function () {
      let colorStart = dbColors.getColors(this.dark, this.colorScheme).getRandom()
      return {
        //
        // // colorStart: this.$options['_vuepeity_wrapper_defaults'].startColor, // Colors
        // // colorStop: this.$options['_vuepeity_wrapper_defaults'].stopColor, // just experiment with them
        // colorStart: colorStart, // Colors
        // colorStop: dbColors.getColors(this.dark, this.colorScheme).getRandom(), // just experiment with them
        // strokeColor: '#F0F0F0', // to see which ones work best for you (gauge_stroke)
        // generateGradient: true, // gmosx:
        // // colors: '#994499',
        // colors: dbColors.getColors(this.dark, this.colorScheme).getRandom(),
        // // after: -540,
        // // points: 540,

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
    //   this.options = this.graphOptions
    // },
    // colorScheme: function () {
    //   this.options = this.graphOptions
    // }
    config: {
      handler: function (val) {
        debug('config.options updated', this.id, this.options)
        this.options = Object.merge(this.graphOptions, this.config.options)
      },
      deep: true
    }
  },

  data () {
    return {
      value: '0/100',

      options: {

      }

    }
  },

  methods: {
    create () {
      this.options = this.graphOptions
    },
    update (data) {
      debug('update', data, this.get_data(data))
      data = this.get_data(data)
      if (Array.isArray(data)) {
        this.value = data.getLast()
      } else {
        this.value = data
      }

      // console.log('update', this.$refs[this.id].)
      // this.$refs[this.id].$data.config.options['value'] = this.stat.data.getLast()[1]
    },

  }
}
</script>

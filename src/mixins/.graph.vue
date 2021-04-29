<template>

  <component
    v-if="chart_init === true"
    v-observe-visibility="(chart_init === true) ? {
      callback: visibilityChanged,
      intersection: {
        rootMargin: '40px',
        threshold: 0,
      },
      throttle: 100,
      throttleOptions: {
        leading: 'visible',
      },
    } : false"
    :is="wrapper.type"
    :id="id"
    :ref="id"
    :EventBus="EventBus"
    v-bind="bindProps"
  >
  </component>

</template>

<script>

import * as Debug from 'debug'
const debug = Debug('mixins:graph')
debug.log = console.log.bind(console) // don't forget to bind to console!

// import { frameDebounce } from 'quasar'
import debounce from 'frame-debounce'

import {roundMilliseconds} from '@libs/time/round'
import { v4 as uuidv4 } from 'uuid'

export default {

  computed: {
    bindProps: function () {
      return Object.merge(
        this.wrapper.props,
        {
          config: this.config,
          'datasets': this.tabular.data,
          'length': (this.config.interval) ? this.dataset.length * this.config.interval : undefined
        }
      )
    }
  },

  _graph_mixin_defaults: {
    tabular: {
      lastupdate: 0,
      data: []
    },
    focus: true,

    firt_update: false,

    __skiped: 0,
    __data_unwatcher: undefined,
    __chart_init: false,

    visible: false
  },

  props: {
    EventBus: {
      type: [Object],
      default: () => ({})
    },
    config: {
      type: [Object],
      default: () => ({
        interval: 1,
      })
    },
    reactive: {
      type: Boolean,
      default: false
    },
    // dataset: {
    //   type: [Object],
    //   default: () => ({})
    // },
    // type:{
    //   type: [String],
    //   default: 'dygraph'
    // },
    id: {
      type: [String],
      default: () => (uuidv4())
    },
    wrapper: {
      type: [Object],
      default: () => ({
        // type: 'dygraph',
        type: undefined,
        props: {}
      })
    },
    always_update: {
      type: [Boolean],
      default: () => (false)
    }
    // wrapper_props: {
    //   type: [Object],
    //   default: () => ({})
    // },
    // merged: {
    //   type: [Boolean],
    //   default: false
    // }
  },

  data () {
    return {
      tabular: { lastupdate: 0, 'data': [[]] },
      chart_init: false
    }
  },

  created () {
    debug('created', this.id, this.wrapper, this.config, this.chart_data)

    if (!this.$options['charts'][this.id]) {
      this.$options['charts'][this.id] = {}
    }

    this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._graph_mixin_defaults))

    if (this.$refs[this.id] && typeof this.$refs[this.id].create === 'function') { this.$refs[this.id].create() }

    if (this.config && (!this.config.interval || this.config.interval === undefined)) { this.config.interval = 1 }

    /**
    * maybe set an app option to allow user to choose if its want to  NOT update graphs
    * when window.blur (loose focus it may be visible but not as primary window)
    * right now updates graphs if "appVisible" (even on not primary windows)
    **/
    // window.addEventListener('blur', function () {
    //   debug('$appVisible blur')
    //   this.$options['charts'][this.id].focus = false
    // }.bind(this), false)
    //
    // window.addEventListener('focus', function () {
    //   debug('$appVisible focus')
    //   this.$options['charts'][this.id].focus = true
    // }.bind(this), false)

    this.create()
  },

  destroyed () {
    this.destroy()

    if (this.$options['charts'][this.id]) {
      // this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._graph_mixin_defaults))
      delete this.$options['charts'][this.id]
    }

    this.$off()
  },
  methods: {

    reset: function () {
      this.destroy()
      this.create()
    },

    destroy: function () {
      /// ///////console.log('config.vue mixing destroy', this.id)
      if (this.$options['charts'][this.id]) {
        if (this.$options['charts'][this.id].__data_unwatcher) { this.$options['charts'][this.id].__data_unwatcher() }

        this.$options['charts'][this.id].tabular.data = [[]]

        this.$options['charts'][this.id].__chart_init = false
      }
      this.$set(this.tabular, 'data', [])

      if (this.$refs[this.id] && typeof this.$refs[this.id].destroy === 'function') { this.$refs[this.id].destroy() }
    },
    __create_watcher: function (name, chart) {},
    update_chart_dataset: function (name, data, inmediate) {
      debug('update_chart_dataset', this.id, name, data, inmediate)

      inmediate = (inmediate !== undefined) ? inmediate : (this.$options['charts'][this.id].firt_update === false)
      this.$options['charts'][this.id].firt_update = true

      // if you are not using buffer, you are managing your data, you are in charge splicing/sorting
      if (this.buffer === true) {
        if (data.length === 1) {
          this.$options['charts'][this.id].tabular.data.shift()
          this.$options['charts'][this.id].tabular.data.push(data[0])
        } else if (data.length > 0) {
          // let splice = data.length
          // let length = data.length
          // let splice = (this.dataset.length || this.$options['charts'][this.id].tabular.data.length) * this.config.interval
          this.$options['charts'][this.id].tabular.data = data

          // this.$options['charts'][this.id].tabular.data.splice(
          //   (splice * -1) + 1,
          //   length - splice
          // )
          //
          // debug('update_chart_dataset %s %d %d %d %o', this.id, this.dataset.length, splice, length, this.$options['charts'][this.id].tabular.data)
        }

        this.$options['charts'][this.id].tabular.data.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
      } else {
        this.$options['charts'][this.id].tabular.data = data
      }

      if (
        this.config.skip &&
        this.config.skip > 0
      // && inmediate !== true
      ) {
        // this.config.interval = this.config.skip
        let new_data = []

        debug('update_chart_dataset', this.id, this.$options['charts'][this.id].tabular.data)
        Array.each(this.$options['charts'][this.id].tabular.data, function (row, index) {
          let timestamp = roundMilliseconds(row[0])
          // if(index % this.config.skip === 0) new_data.push(row)
          // if (index === 0 || timestamp + (this.config.skip * 1000) >= this.$options['charts'][this.id].__skiped) {

          // data has to be in ascending order
          if (index === 0 || timestamp >= (this.config.skip * 1000) + this.$options['charts'][this.id].__skiped) {
            debug('NOT SKIPED %s %s %d', this.id, timestamp, this.config.skip)
            new_data.push(row)
            this.$options['charts'][this.id].__skiped = timestamp
          } else {
            debug('SKIPED %s %s %d', this.id, new Date(timestamp), this.config.skip)
          }
        }.bind(this))

        this.$options['charts'][this.id].tabular.data = new_data
        // this.$options['charts'][this.id].tabular.data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
      }

      /**
        * @config: this should be config options
        * this.$options['charts'][this.id].focus
        * this.$options['charts'][this.id].visible
        */

      // if(this.$options['charts'][this.id].visible === true){
      // debug('inmediate %s %o %o', this.id, inmediate, this.$options['charts'][this.id].visible)

      if (
        this.always_update === true ||
        (inmediate && inmediate === true) ||
          (
            (this.$options['charts'][this.id].focus === true && this.$options['charts'][this.id].visible === true) &&
            (
              !this.config.interval ||
              // (Date.now() - ((this.config.interval * 1000) - 200) >= this.$options['charts'][this.id].tabular.lastupdate) ||
              (Date.now() - (this.config.interval * 500) >= this.$options['charts'][this.id].tabular.lastupdate) ||
              this.$options['charts'][this.id].tabular.lastupdate === 0
            )
          )

      ) {
        /**
        * used to be in components/chart
        * @todo : reimplement all logic that was defined about 'match' & 'watch' etc...
        **/
        let update_data = []
        if (this.config.watch && this.config.watch.transform) {
          debug('updating %s - always %o - inmediate %o - focus %o - visible %o - interval %o - data %o',
            this.id,
            this.always_update,
            inmediate,
            this.$options['charts'][this.id].focus,
            this.$options['charts'][this.id].visible,
            this.config.interval,
            this.$options['charts'][this.id].tabular.data,
            this.config
          )
          // update_data = this.config.watch.transform(Array.clone(this.$options['charts'][this.id].tabular.data), this, this.config)
          update_data = this.config.watch.transform(this.$options['charts'][this.id].tabular.data, this, this.config)
        } else {
          // update_data = Array.clone(this.$options['charts'][this.id].tabular.data)
          update_data = this.$options['charts'][this.id].tabular.data
        }

        if (this.$refs[name]) {
          let clear_data = true

          if (this.$refs[name] && typeof this.$refs[name].update === 'function' && update_data.length > 0) {
            if (inmediate === true) {
              clear_data = this.$refs[name].update(update_data)
            } else {
              // frameDebounce(this.$refs[name].update(update_data))
              debounce(this.$refs[name].update(update_data))
            }
          } else if (this.reactive === true) {
            if (inmediate === true) {
              this.$set(this, 'tabular', update_data)
            } else {
              // frameDebounce(this.$set(this, 'tabular', update_data))
              debounce(this.$set(this, 'tabular', update_data))
            }
          }
          // debug('graph update_chart_dataset updating %s %o %d %d', name, this.$refs, this.tabular.data.length, this.$options['charts'][this.id].tabular.data.length)

          if (clear_data === true) { this.$options['charts'][this.id].tabular.data = [[]] }

          if (inmediate === true) {
            this.$options['charts'][this.id].tabular.lastupdate = 0
          } else {
            this.$options['charts'][this.id].tabular.lastupdate = Date.now()
          }
        } else {
          debug('no element', this.id, update_data)
        }

        // //console.log('graph.vue update', this.id, this.config.interval, new Date(this.$options['charts'][this.id].tabular.lastupdate), inmediate)
      }

      // }
    },
    /**
    * UI related
    **/
    visibilityChanged (isVisible, entry) {
      debug('visibilityChanged', this.id, this.$options['charts'])
      if (this.$options['charts'][this.id]) {
        debug('visibilityChanged', this.id, isVisible, this.$options['charts'][this.id].visible, JSON.parse(JSON.stringify(this.$options['charts'][this.id].tabular.data)))

        /**
        * update with current data is visibility changed from "unvisible" to visible
        **/
        let __visible = this.$options['charts'][this.id].visible
        this.$options['charts'][this.id].visible = isVisible
        let data = JSON.parse(JSON.stringify(this.$options['charts'][this.id].tabular.data))

        debug('visibilityChanged', this.id, __visible, isVisible, data)
        if (
          (!__visible || __visible === false) &&
          isVisible === true &&
          data.length > 0
        ) {
          // this.buffer === false &&
          // (this.dataset.numeric === false || (this.dataset.numeric === true && data[0][0]))
          this.update_chart_dataset(this.id, data, true)
        }
      }
    }
  }
}
</script>

<style scoped>
#reset-this-parent {
  all: initial;
  * {
    all: unset;
  }
}
</style>

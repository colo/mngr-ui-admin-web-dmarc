<script>
import * as Debug from 'debug'
const debug = Debug('mixins:chartWrapper')
debug.log = console.log.bind(console) // don't forget to bind to console!

import { v4 as uuidv4 } from 'uuid'

export default {

  charts: {},

  _chart_mixin_defaults: {
    graph: undefined,
    freezed: false,

    __unwatcher: undefined,
    visible: false,

    buffered_data: [],
  },

  props: {
    /**
     * Enable dark mode
     *
     * `true,false`
     */
    dark: {
      type: Boolean,
      default: false
    },
    /**
     * Color Scheme Name
     * App may define multiple color schemes for different charts
     * and use this prop to specify which colorScheme to use
     * default: "default" - refers to default dashblocks colorScheme which is always defined
     */
    colorScheme: {
      type: String,
      default: 'default'
    },
    EventBus: {
      type: [Object],
      default: () => ({})
    },
    id: {
      type: [String],
      default: () => (uuidv4())
    },
    config: {
      type: [Object],
      default: () => ({})
    },
    chart_data: {
      type: [Array],
      default: () => ([])
    },
    chart_data_length: {
      type: [Number]
      // default: () => ([])
    },
    freezed: {
      type: [Boolean],
      default: () => (false)
    }
    // visible: {
    //   type: [Boolean],
    //   default: () => (true)
    // },
  },
  data () {
    return {
      container_class_helper: '',
      highlighted: false,
      ready: false
    }
  },
  created: function () {
    if (!this.$options.charts[this.id]) { this.$options.charts[this.id] = {} }

    this.$options.charts[this.id] = Object.merge(this.$options.charts[this.id], Object.clone(this.$options._chart_mixin_defaults))
  },
  mounted () {
    this.create()
  },
  // updated () {
  //   this.create()
  // },
  destroyed () {
    this.$options.charts[this.id] = Object.merge(this.$options.charts[this.id], Object.clone(this.$options._chart_mixin_defaults))
    // this.$options['charts'][this.id].graph = undefined
    // this.$options['charts'][this.id].freezed = false
    //
    // this.$options['charts'][this.id].__unwatcher = undefined
    // this.$options['charts'][this.id].visible = false
    //
    // this.$options['charts'][this.id].buffered_data = []

    this.destroy()
    // if(this.$options['charts'][this.id].graph && typeof this.$options['charts'][this.id].graph.destroy == 'function'){
    //   // //////////console.log('destroying ...', this.id)
    //   this.$options['charts'][this.id].graph.destroy()
    //
    // }
    //
    // this.$options['charts'][this.id].graph = undefined
    this.$off()
  },
  methods: {

    /**
    * UI related
    **/
    reset: function () {
      /// /console.log('dygraph reset')
      this.destroy()
      this.create()
    },
    destroy: function () {

    },
    create () {

    },
    get_data: function (data) {
      // data = data || Array.clone(this.chart_data)
      data = data || this.chart_data
      return data
    },
    update (data) {
      data = this.get_data(data)
    }

  }
}
</script>

<template>
  <div
    :id="id+'-container'"
    class="netdata-container-with-legend"
    v-bind:class="container_class_helper"
    :style="config.style"
  >
  <!-- v-observe-visibility="visibilityChanged" -->
     <div
       :ref="id"
       :id="id"
       :class="config.class"
     >

    </div>
    <div
    class="netdata-chart-legend"
    :id="id+'-netdata-chart-legend'"
    >
    </div>
  </div>
</template>

<script>
/* global smoothPlotter */

import * as Debug from 'debug'

const debug = Debug('components:wrappers:dygraph')
debug.log = console.log.bind(console) // don't forget to bind to console!
// debug_internals = Debug('components:wrappers:dygraph:Internals'),
// debug_events = Debug('components:wrappers:dygraph:Events')

import chartWrapperMixin from '@mixins/chartWrapper.vue'

import Dygraph from 'dygraphs'
import 'dygraphs/src/extras/smooth-plotter'

import 'dygraphs/dist/dygraph.css'

import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  mixins: [chartWrapperMixin],

  name: 'dygraph-wrapper',

  _dygraph_wrapper_defaults: {
    // buffered_data: {},
    chart_options: {},
    __unwatch_options: undefined,
    __unwatch_smooth: undefined,
  },

  props: {
    // EventBus: {
    //   type: [Object],
    //   default: () => ({})
    // }
    smoothness: {
      type: [Boolean],
      default: false
    }
  },

  // data () {
  //   return {
  //     // graph: null,
  //     // needUpdate: false,
  //     // needOptionsUpdate: false,
  //     optionsChanged: false
  //   }
  // },

  /**
  * dashblocks DdDygraph.vue with some netdata values
  **/
  computed: {
    // Augment passed options with defaults for Dygraphs
    graphOptions: function () {
      let options = Object.merge(this.defaultOptions, this.config.options)
      // let options = Object.merge(this.config.options, this.defaultOptions)// right now force some default options like colours
      /**
      * should add an option for general smooth plotting (true | false)
      **/
      if (options.fillGraph !== true && this.smoothness === true) { options.plotter = smoothPlotter }

      /**
      * seting 'ticker' is a really performance improvement
      **/
      if (!options.axes || options.axes.x || options.axes.x.ticker) {
        options = Object.merge(options, {
          axes: {
            x: {
              ticker: Dygraph.dateTicker
            }
          }
        })
      }
      return options
    },
    defaultOptions: function () {
      return {
        colors: dbColors.getColors(this.dark, this.colorScheme),
        // animatedZooms: true,
        // labelsDiv: this.$refs.dbdylabels,
        labelsDiv: 'netdata-chart-legend',
        // legend: 'follow',
        legend: 'always', // 'onmouseover',
        // legendFormatter: this.legendFormatter,
        // zoomCallback: this.handleZoom,
        // clickCallback: this.handleClick,
        // highlightCallback: this.handleHighlight,
        // unhighlightCallback: this.handleUnHighlight,
        highlightSeriesBackgroundAlpha: this.dark ? 0.4 : 0.5,
        highlightSeriesBackgroundColor: this.dark ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)',
        // axisLineColor: this.dark ? 'rgba(255, 255, 255, 0.3)' : 'rgb(0, 0, 0, 0.3)'
        axisLineColor: this.dark ? '#283236' : '#F0F0F0',
        strokeBorderColor: this.dark ? '#272b30' : '#FFFFFF',
        gridLineColor: this.dark ? '#283236' : '#F0F0F0',
      }
    },
    // elementClass: function() {
    //   return this.dark ? 'db-dygraphs db-dark' : 'db-dygraphs';
    // }
  },

  watch: {
    'smoothness': function (val, old) {
      debug('smoothness', this.id, val)
      // if (val && Object.getLength(val) > 0 && val.options) {
      this.__chart_destroy()
      this.__chart_create()
    },
    // options: {
    //   handler() {
    //     this.optionsChanged = true;
    //     this.scheduleUpdate();
    //   },
    //   deep: true
    // },
    dark: function () {
      // this.optionsChanged = true
      this.$options.charts[this.id].chart_options = this.graphOptions
      debug('dark', this.dark, this.$options.charts[this.id].chart_options)
      this.update()
    },
    colorScheme: function () {
      // this.optionsChanged = true
      this.$options.charts[this.id].chart_options = this.graphOptions
      this.update()
    }
  },
  created () {
    if (!this.$options.charts[this.id]) { this.$options.charts[this.id] = {} }

    this.$options.charts[this.id] = Object.merge(this.$options.charts[this.id], Object.clone(this.$options._dygraph_wrapper_defaults))

    // if (!this.$options.charts[this.id].buffered_data) { this.$options.charts[this.id].buffered_data = [] }

    let self = this
    if (self.EventBus && typeof (self.EventBus.$on) === 'function') {
      self.EventBus.$on('highlightCallback', params => {
        self.highlighted = true
      })
      self.EventBus.$on('unhighlightCallback', event => {
        self.highlighted = false
      })
    }
  },
  // mounted () {
  //
  //   // if(this.$options.graph === null && this.chart_data && this.chart_data.length > 1){
  //   //
  //   //   this.__chart_create()
  //   //
  //   // }
  //   // this.__watcher()
  //
  //   this.create()
  //   // if(this.config && this.config.options){
  //   //   //console.log('mounted dygraph', this.id, this.config)
  //   //   this.create()
  //   // }
  //   // else{
  //   //   let unwatch = this.$watch('config', function(val){
  //   //     if(val && Object.getLength(val) > 0 && val.options){
  //   //       // this.__chart_create()
  //   //       this.create()
  //   //       unwatch()
  //   //     }
  //   //
  //   //   })
  //   // }
  // },
  // updated () {
  // //
  // //   // if(this.$options.graph === null && this.chart_data && this.chart_data.length > 1){
  // //   //
  // //   //   this.__chart_create()
  // //   //
  // //   // }
  // //   // this.__watcher()
  // //
  //   this.create()
  // },
  destroyed () {
    if (this.$options.charts[this.id]) delete this.$options.charts[this.id]

    // this.$options.buffered_data = {}
    // this.$options.chart_options = {}
    // this.$options.__unwatch_options = undefined
    // this.$options.__unwatch_smooth = undefined

  //   this.destroy()
  //   if(this.$options.graph && typeof this.$options.graph.destroy === 'function'){
  //     this.$options.graph.destroy()
  //
  //   }
  //
  //   this.$options.graph = undefined
  //   this.$off()
  },
  methods: {

    /**
    * UI related
    **/
    // reset: function(){
    //   this.destroy()
    //   this.create()
    // },
    destroy: function () {
      /// /////console.log('dygraph destroy', this.id)

      this.__chart_destroy()

      if (this.$options.__unwatcher) {
        this.$options.__unwatcher()
        this.$options.__unwatcher = undefined
      }

      if (this.$options.__unwatch_options) {
        this.$options.__unwatch_options()
        this.$options.__unwatch_options = undefined
      }
    },
    __chart_destroy () {
      if (this.$options.graph && typeof this.$options.graph.destroy === 'function') {
        // //////////console.log('destroying ...', this.id)
        this.$options.graph.destroy()
      }

      this.$options.graph = undefined
      this.ready = false
    },
    create () {
      // console.log('create dygraph', this.id, this.config)

      if (this.config) { // && this.config.options
        // this.create()
        this.__chart_create()
      } else {
        let unwatch = this.$watch('config', function (val) {
          if (val && Object.getLength(val) > 0 && val.options) {
            this.__chart_destroy()
            this.__chart_create()
            // this.create()
            unwatch()
          }
        })
      }

      // this.$options.__unwatch_smooth = this.$watch('config.smooth', function (val) {
      //   debug('config.smooth', this.id, val)
      //   // if (val && Object.getLength(val) > 0 && val.options) {
      //   this.__chart_destroy()
      //   this.__chart_create()
      //   // this.create()
      //   // unwatch()
      //   // }
      // }, { deep: true })
    },
    __chart_create () {
      // let unwatch_options = this.$watch('config.options', function(val){
      //   // if(val && Object.getLength(val) > 0 && val.options){
      //   //   this.__chart_create()
      //   //   // this.create()
      //   //   unwatch()
      //   // }
      //   console.log('dygraph config.options watcher', val)
      // }, {deep: true})
      this.$options.charts[this.id].chart_options = this.graphOptions // Object.clone(this.config.options)
      this.$options.charts[this.id].__unwatch_options = this.$watch('config.options', function (val) {
        // // if(val && Object.getLength(val) > 0 && val.options){
        // //   this.__chart_create()
        // //   // this.create()
        // //   unwatch()
        // // }
        // console.log('dygraph config.options watcher', val.labels)
        this.$options.charts[this.id].chart_options = this.graphOptions // Object.clone(val)
      }, { deep: true })

      // console.log('__chart_create', this.id, this.$options.charts[this.id].chart_options)

      if (this.$options.charts[this.id].chart_options.labels && document.getElementById(this.id)) {
        if (this.$options.charts[this.id].chart_options.labelsDiv) { this.$options.charts[this.id].chart_options.labelsDiv = this.id + '-' + this.$options.charts[this.id].chart_options.labelsDiv }

        // let data = []
        // if (this.chart_data[0] && this.chart_data[0].length === 0) {
        //   let row = []
        //   Array.each(this.$options.charts[this.id].chart_options.labels, function (label) {
        //     row.push(0)
        //   })
        //   data.push(row)
        // } else {
        //   data = this.get_data()
        //   // data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
        //   // data = []
        // }
        let data = this.get_data()

        // Array.each(this.chart_data, function(row){
        //   row[0] = new Date(row[0])
        //   data.push(row)
        // })

        // console.log('__chart_create', this.id, this.$options.charts[this.id].chart_options)

        // /**
        // * should add an option for general smooth plotting (true | false)
        // **/
        // if (this.$options.charts[this.id].chart_options.fillGraph !== true && this.smoothness === true) { this.$options.charts[this.id].chart_options.plotter = smoothPlotter }

        this.$options.charts[this.id].graph = new Dygraph(
          document.getElementById(this.id), // containing div
          data,
          this.$options.charts[this.id].chart_options
        )

        debug('__chart_create', this.id, this.$options.charts[this.id].chart_options, data)

        this.$options.charts[this.id].graph.ready(function () {
          // //////////////console.log('config '+this.id+' ready')
          debug('__chart_create ready', this.id)
          this.ready = true
          this.update()
        }.bind(this))

        if (this.config.init) { this.config.init(this, this.$options.charts[this.id].graph, 'dygraph') }

        // this.update()
      }
    },
    get_data: function (data) {
      let self = this
      debug('get_data', this.id, data, this.chart_data, this.$options.charts[this.id].buffered_data)
      if (this.$options.charts[this.id].buffered_data && Array.isArray(this.$options.charts[this.id].buffered_data) && this.$options.charts[this.id].buffered_data.length > 0 && this.$options.charts[this.id].buffered_data[0][0]) {
        if (data && Array.isArray(data) && data.length > 0 && data[0][0]) {
          data = this.$options.charts[this.id].buffered_data.append(data)
        } else {
          data = this.$options.charts[this.id].buffered_data
        }
      } else if (this.chart_data[0] && this.chart_data[0].length === 0 && (!data || data.length === 0)) {
        let row = []
        data = []
        Array.each(self.$options.charts[this.id].chart_options.labels, function (label) {
          row.push(0)
        })
        data.push(row)
      } else if (!data || data.length === 0) {
        data = JSON.parse(JSON.stringify(this.chart_data))
        // data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
        // data = []
      }

      // data = (data && Array.isArray(data) && data.length > 0 && data[0][0])
      //   ? data
      //   : Array.clone(this.chart_data)

      data = JSON.parse(JSON.stringify(data))

      // data.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
      //
      // Array.each(data, function (row) {
      //   if (row) { row[0] = new Date(row[0]) }
      //   // data.push(row)
      // })

      // return Array.clone(data)
      return data
    },
    update: function (data) {
      data = this.get_data(data)
      debug('update', this.id, this.ready, data, this.$options.charts[this.id].chart_options.labels)
      // let options = (this.ready === true && this.$options.charts[this.id].graph.numRows() > 1) ? { 'dateWindow': this.$options.charts[this.id].graph.xAxisExtremes() } : {}
      // if(this.$options.charts[this.id].visible === true && this.ready === true){
      if (this.ready === true && data && data[0] && data[0].length === this.$options.charts[this.id].chart_options.labels.length) {
        // //console.log('updateOptions', this.id, data)

        // this.updateOptions(
        //   data,
        //   Object.merge(this.$options.charts[this.id].chart_options, { 'dateWindow': this.$options.charts[this.id].graph.xAxisExtremes() }),
        //   false
        // )

        let end = data[data.length - 1][0]
        let start
        if (!this.chart_data_length) {
          start = data[0][0]
        } else {
          start = end - (this.chart_data_length * 1000)
        }

        debug('update start - end %s %d %s %s %o', this.id, this.chart_data_length, new Date(start), new Date(end), data)

        data.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })

        Array.each(data, function (row) {
          if (row) { row[0] = new Date(row[0]) }
          // data.push(row)
        })

        this.updateOptions(
          data,
          Object.merge(Object.clone(this.$options.charts[this.id].chart_options), { 'dateWindow': [start, end] }),
          false
        )
        // if (this.optionsChanged) {
        //   this.optionsChanged = false
        //   this.updateOptions(
        //     data,
        //     Object.merge(Object.clone(this.$options.charts[this.id].chart_options), { 'dateWindow': [start, end] }),
        //     false
        //   )
        // } else {
        //   this.updateOptions(data, undefined, false)
        // }

        this.$options.charts[this.id].buffered_data = []

        return true
      } else if (data && data[0] && data[0].length === this.$options.charts[this.id].chart_options.labels.length) {
        // this.$options.charts[this.id].buffered_data.append(data)
        // setTimeout(function () {
        //   this.update(data)
        // }.bind(this), 1000)
        if (data && Array.isArray(data) && data.length > 0 && data[0][0] && this.$options.charts[this.id].buffered_data && this.$options.charts[this.id].buffered_data.length > 0) {
          this.$options.charts[this.id].buffered_data.append(data)
        } else {
          this.$options.charts[this.id].buffered_data = data
        }
        return false
      }
    },
    updateOptions (data, options, block_redraw) {
      // debug('updateOptions', this.id, this.ready)
      // let self = this

      if (
        this.highlighted === false &&
        this.ready === true
        // && this.data.length > 1
        // && this.data[0].length > 1
        // && this.$options.charts[this.id].freezed <= 2//needed number of iterations to update data 'onRange'
        // && this.freezed === false
      ) {
        // if(self.data[0][0] === undefined && self.config.options && self.config.options.labels)//dygraph code, should be would
        //   Array.each(self.config.options.labels, function(label, index){
        //     if(index === 0){
        //       self.data[0].push(Date.now())
        //     }
        //     else{
        //       // data[0].push(0)
        //       self.data[0].push(null)
        //     }
        //
        //   })

        /**
          * should be sorted already
          **/
        // if(this.config.skip > 0)
        //   data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )

        // let data = []
        // console.log('updateOptions', data, options)

        this.$options.charts[this.id].graph.updateOptions(
          Object.merge(
            {
              'file': data
            },
            options
          ),
          block_redraw
        )

        // this.$options.charts[this.id].graph.updateOptions(
        //   { 'dateWindow': this.$options.charts[this.id].graph.xAxisExtremes() },
        //   block_redraw
        // );
        let selection = (this.config.skip && this.config.skip > 0) ? this.config.skip : 1

        debug('updateOptions selection', this.id, data, selection)

        this.$options.charts[this.id].graph.setSelection(this.$options.charts[this.id].graph.numRows() - selection, {}, false)
      }
    }
  }
}
</script>

<style>

.netdata-chart-alignment {
    margin-left: 55px;
}

.netdata-chart-row {
    width: 100%;
    text-align: center;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    align-items: flex-end;
    -moz-align-items: flex-end;
    -webkit-align-items: flex-end;
    justify-content: center;
    -moz--webkit-justify-content: center;
    -moz-justify-content: center;
    padding-top: 10px;
}

.netdata-container {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge:after {
    padding-top: 60%;
    display: block;
    content: '';
}

.netdata-container-easypiechart {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-easypiechart:after {
    padding-top: 100%;
    display: block;
    content: '';
}

.netdata-aspect {
    position: relative;
    width: 100%;
    padding: 0px;
    margin: 0px;
}

.netdata-container-with-legend {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* fix minimum scrollbar issue in firefox */
    min-height: 99px;

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-legend-resize-handler {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0px;
    height: 15px;
    width: 20px;
    background-color: #272b30;
    font-size: 15px;
    vertical-align: middle;
    line-height: 15px;
    cursor: ns-resize;
    color: #373b40;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;
}

.netdata-legend-toolbox {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 30px;
    height: 15px;
    width: 110px;
    background-color: #272b30;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #373b40;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-legend-toolbox-button {
    display: inline-block;
    position: relative;
    height: 15px;
    width: 18px;
    background-color: #272b30;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #474b50;
    text-align: center;
    overflow: hidden;
    z-index: 21;
    padding: 0px;
    margin: 0px;
    cursor: pointer;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-message {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: left;
    vertical-align: top;
    font-weight: bold;
    font-size: x-small;
    overflow: hidden;
    background: inherit;
    z-index: 0;
}

.netdata-message.hidden {
    display: none;
}

.netdata-message.icon {
    color: #2f3338;
    text-align: center;
    vertical-align: middle;
}

.netdata-chart-legend {
    position: absolute; /* within .netdata-container */
    top: 0;
    right: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14px;
    display: block;
    width: 140px; /* --legend-width */
    height: calc(100% - 15px); /* 10px for the resize handler and 5px for the top margin */
    font-size: 11px;/* colo: 10 -> 11 */
    margin-top: 5px;
    text-align: left;
    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-legend-title-date {
    font-size: 10px;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-time {
    font-size: 11px;
    font-weight: bold;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-units {
    position: absolute;
    right: 10px;
    float: right;
    font-size: 11px;
    vertical-align: top;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-series {
    position: absolute;
    width: 140px; /* legend-width */
    height: calc(100% - 50px);
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14.5px; /* line spacing at the legend */
    display: block;
    font-size: 10px;
    margin-top: 0px;
}

.netdata-legend-name-table-line {
    display: inline-block;
    width: 13px;
    height: 4px;
    border-width: 0px;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #272b30;
}

.netdata-legend-name-table-area {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-table-stacked {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-tr {
}

.netdata-legend-name-td {
}

.netdata-legend-name {
    text-align: left;
    font-size: 11px; /* legend: dimension name size */
    font-weight: bold;
    vertical-align: bottom;
    margin-top: 0px;
    z-index: 9;
    padding: 0px;
    width: 80px !important;
    max-width: 80px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    cursor: pointer;
    -webkit-print-color-adjust: exact;
}

.netdata-legend-value {
    /*margin-left: 14px;*/
    position: absolute;
    right: 10px;
    float: right;
    text-align: right;
    font-size: 11px; /* legend: dimension value size */
    font-weight: bold;
    vertical-align: bottom;
    background-color: #272b30;
    margin-top: 0px;
    z-index: 10;
    padding: 0px;
    padding-left: 15px;
    cursor: pointer;
    /* -webkit-font-smoothing: none; */
}

.netdata-legend-name.not-selected {
    font-weight: normal;
    opacity: 0.3;
}

.netdata-chart {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: inline-block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    z-index: 5;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-chart-with-legend-right {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: block;
    overflow: hidden;
    margin-right: 140px; /* --legend-width */
    width: calc(100% - 140px); /* --legend-width */
    height: 100%;
    z-index: 5;
    flex-grow: 1;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-peity-chart {

}

.netdata-sparkline-chart {

}

.netdata-morris-chart {

}

.netdata-google-chart {

}

/* fix for sparkline tooltip under bootstrap */
.jqstooltip {
    width: auto !important;
    height: auto !important;
}

.easyPieChart {
    position: relative;
    text-align: center;
}

.easyPieChart canvas {
    position: absolute;
    top: 0;
    left: 0;
}

.easyPieChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #BBB;
    font-weight: normal;
    text-shadow: #272b30 0px 0px 1px;
    /* -webkit-font-smoothing: none; */
}

.easyPieChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 64%;
    margin-left: 18% !important;
    text-align: center;
    color: #676b70;
    font-weight: bold;
}

.easyPieChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 60%;
    margin-left: 20% !important;
    text-align: center;
    color: #676b70;
    font-weight: normal;
}

.gaugeChart {
    position: relative;
    text-align: center;
}

.gaugeChart canvas {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
}

.gaugeChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #BBB;
    font-weight: bold;
    z-index: 1;
    text-shadow: #272b30 0px 0px 1px;
    /* text-shadow: #CCC 1px 1px 0px, #CCC -1px -1px 0px, #CCC 1px -1px 0px, #CCC -1px 1px 0px; */
    /* -webkit-text-stroke: 1px #777; */
    /* -webkit-font-smoothing: none; */
}

.gaugeChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #676b70;
    font-weight: bold;
}

.gaugeChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: left;
    margin-left: 5%;
    color: #676b70;
    font-weight: normal;
}

.gaugeChartMin {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 92%;
    margin-left: 8%;
    text-align: left;
    color: #676b70;
    font-weight: normal;
}

.gaugeChartMax {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 95%;
    margin-right: 5%;
    text-align: right;
    color: #676b70;
    font-weight: normal;
}

.popover-title {
    font-weight: bold;
    font-size: 12px;
}

.popover-content {
    font-size: 11px;
}

.netdata-dygraph-chart {

}
.dygraph-ylabel {
}

.dygraph-axis-label-x {
    overflow-x: hidden;
}

.dygraph-legend {
    color: #6c7075;
    font-size: 11px;
}

.dygraph-axis-label {
    color: #6c7075;
    font-size: 11px;
}

.dygraph-label-rotate-left {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
}

/* For y2-axis label */
.dygraph-label-rotate-right {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(-90deg);
    -webkit-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
}

.dygraph-title {
    text-indent: 56px;
    text-align: left;
    position: absolute;
    left: 0px;
    top: 4px;
    font-size: 11px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>

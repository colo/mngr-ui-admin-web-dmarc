<template>
  <dygraph-wrapper
    :config="Object.merge(config, {options: graphOptions})"
    :smoothness="false"
    :id="id+'.base'"
    :ref="id+'.base'"
    :key="id+'.base'"
    :chart_data="values"
    :chart_data_length="chart_data_length"
    :dark="dark"
    :colorScheme="colorScheme"
  />
  <!-- :config="Object.merge(config, {options: graphOptions})"
  :smoothness="false"
  :id="id+'.base'"
  :chart_data="values"
  :chart_data_length="chart_data_length"
  :dark="dark"
  :colorScheme="colorScheme" -->
</template>

<script>
/* global smoothPlotter */

import * as Debug from 'debug'

const debug = Debug('components:wrappers:dygraphBar')
debug.log = console.log.bind(console) // don't forget to bind to console!

import chartWrapperMixin from '@mixins/chartWrapper.vue'

import dygraphWrapper from './dygraph'

import Dygraph from 'dygraphs'
// import 'dygraphs/src/extras/smooth-plotter'
//
// import 'dygraphs/dist/dygraph.css'

import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  components: {
    dygraphWrapper
  },
  mixins: [chartWrapperMixin],

  name: 'dygraph-bar-wrapper',

  _dygraph_bar_wrapper_defaults: {
    // buffered_data: {},
    chart_options: {},
    __unwatch_options: undefined,
    __unwatch_smooth: undefined,
  },

  props: {
    opacity: {
      type: Number,
      default: 0.6
    }
  },

  data () {
    return {
      //     // graph: null,
      //     // needUpdate: false,
      //     // needOptionsUpdate: false,
      //     optionsChanged: false
      values: [[]]
    }
  },

  /**
  * dashblocks DdDygraph.vue with some netdata values
  **/
  computed: {
    // Augment passed options with defaults for Dygraphs
    graphOptions: function () {
      // let options = Object.merge(this.defaultOptions, this.config.options)
      // let options = Object.merge(this.config.options, this.defaultOptions)// right now force some default options like colours
      let options = this.defaultOptions// right now force some default options like colours
      /**
      * should add an option for general smooth plotting (true | false)
      **/
      // if (options.fillGraph !== true && this.smoothness === true) { options.plotter = smoothPlotter }

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
        // legend: 'always', // 'onmouseover',
        // // legendFormatter: this.legendFormatter,
        // // zoomCallback: this.handleZoom,
        // // clickCallback: this.handleClick,
        // // highlightCallback: this.handleHighlight,
        // // unhighlightCallback: this.handleUnHighlight,
        // highlightSeriesBackgroundAlpha: this.dark ? 0.4 : 0.5,
        // highlightSeriesBackgroundColor: this.dark ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)',
        // // axisLineColor: this.dark ? 'rgba(255, 255, 255, 0.3)' : 'rgb(0, 0, 0, 0.3)'
        // axisLineColor: this.dark ? '#283236' : '#F0F0F0',
        // strokeBorderColor: this.dark ? '#272b30' : '#FFFFFF',
        // gridLineColor: this.dark ? '#283236' : '#F0F0F0',
        // legend: 'follow',
        includeZero: true,
        panEdgeFraction: 0.00000001,
        // TODO Consider if needs to be enabled; need to import asyncronously so vuepress compiles
        // interactionModel: DygraphInteraction.defaultInteractionModel,
        axes: {
          x: {
            drawGrid: false
          }
        },
        plotter: this.barChartPlotter
      }
    },
    // elementClass: function() {
    //   return this.dark ? 'db-dygraphs db-dark' : 'db-dygraphs';
    // }
  },

  // watch: {
  //   // 'smoothness': function (val, old) {
  //   //   debug('smoothness', this.id, val)
  //   //   // if (val && Object.getLength(val) > 0 && val.options) {
  //   //   this.__chart_destroy()
  //   //   this.__chart_create()
  //   // },
  //   // options: {
  //   //   handler() {
  //   //     this.optionsChanged = true;
  //   //     this.scheduleUpdate();
  //   //   },
  //   //   deep: true
  //   // },
  //   dark: function () {
  //     // this.optionsChanged = true
  //     this.$options.charts[this.id].chart_options = this.graphOptions
  //     this.update()
  //   },
  //   colorScheme: function () {
  //     // this.optionsChanged = true
  //     this.$options.charts[this.id].chart_options = this.graphOptions
  //     this.update()
  //   }
  // },
  // created () {
  //   this.config.options = Object.merge(this.config.options, this.graphOptions)
  // },

  // destroyed () {
  //   if (this.$options.charts[this.id]) delete this.$options.charts[this.id]
  // },
  methods: {
    /**
    * from @dashblocks
    **/
    barChartPlotter: function (e) {
      var ctx = e.drawingContext
      var points = e.points
      var y_bottom = e.dygraph.toDomYCoord(0)

      let opColor = dbColors.hex2RGBA(e.color, this.opacity)
      debug('barChartPlotter', e.color, this.opacity, opColor)

      ctx.fillStyle = opColor // e.color;
      ctx.strokeStyle = opColor // e.color;

      // Find the minimum separation between x-values.
      // This determines the bar width.
      var min_sep = Infinity
      for (let i = 1; i < points.length; i++) {
        var sep = points[i].canvasx - points[i - 1].canvasx
        if (sep < min_sep) min_sep = sep
      }
      var bar_width = Math.floor((2.0 / 3) * min_sep)

      // Do the actual plotting.
      for (let i = 0; i < points.length; i++) {
        var p = points[i]
        var center_x = p.canvasx

        ctx.fillRect(center_x - bar_width / 2, p.canvasy, bar_width, y_bottom - p.canvasy)

        ctx.strokeRect(center_x - bar_width / 2, p.canvasy, bar_width, y_bottom - p.canvasy)
      }
    },
    /**
    * UI related
    **/
    // reset: function(){
    //   this.destroy()
    //   this.create()
    // },
    // destroy: function () {
    //   /// /////console.log('dygraph destroy', this.id)
    //
    //   // this.__chart_destroy()
    //
    //   if (this.$options.__unwatcher) {
    //     this.$options.__unwatcher()
    //     this.$options.__unwatcher = undefined
    //   }
    //
    //   if (this.$options.__unwatch_options) {
    //     this.$options.__unwatch_options()
    //     this.$options.__unwatch_options = undefined
    //   }
    // },
    // __chart_destroy () {
    //   if (this.$options.graph && typeof this.$options.graph.destroy === 'function') {
    //     // //////////console.log('destroying ...', this.id)
    //     this.$options.graph.destroy()
    //   }
    //
    //   this.$options.graph = undefined
    //   this.ready = false
    // },
    // create () {
    //   // console.log('create dygraph', this.id, this.config)
    //
    //   if (this.config) { // && this.config.options
    //     // this.create()
    //     this.__chart_create()
    //   } else {
    //     let unwatch = this.$watch('config', function (val) {
    //       if (val && Object.getLength(val) > 0 && val.options) {
    //         // this.__chart_destroy()
    //         this.__chart_create()
    //         // this.create()
    //         unwatch()
    //       }
    //     })
    //   }
    //
    //   // this.$options.__unwatch_smooth = this.$watch('config.smooth', function (val) {
    //   //   debug('config.smooth', this.id, val)
    //   //   // if (val && Object.getLength(val) > 0 && val.options) {
    //   //   this.__chart_destroy()
    //   //   this.__chart_create()
    //   //   // this.create()
    //   //   // unwatch()
    //   //   // }
    //   // }, { deep: true })
    // },
    // __chart_create () {
    //   // let unwatch_options = this.$watch('config.options', function(val){
    //   //   // if(val && Object.getLength(val) > 0 && val.options){
    //   //   //   this.__chart_create()
    //   //   //   // this.create()
    //   //   //   unwatch()
    //   //   // }
    //   //   console.log('dygraph config.options watcher', val)
    //   // }, {deep: true})
    //   // this.$options.charts[this.id].chart_options = this.graphOptions // Object.clone(this.config.options)
    //   this.$options.charts[this.id].__unwatch_options = this.$watch('config.options', function (val) {
    //     // // if(val && Object.getLength(val) > 0 && val.options){
    //     // //   this.__chart_create()
    //     // //   // this.create()
    //     // //   unwatch()
    //     // // }
    //     // console.log('dygraph config.options watcher', val.labels)
    //     this.$options.charts[this.id].chart_options = this.graphOptions // Object.clone(val)
    //   }, { deep: true })
    //
    //   // console.log('__chart_create', this.id, this.$options.charts[this.id].chart_options)
    //
    //   if (this.$options.charts[this.id].chart_options.labels && document.getElementById(this.id)) {
    //     if (this.$options.charts[this.id].chart_options.labelsDiv) { this.$options.charts[this.id].chart_options.labelsDiv = this.id + '-' + this.$options.charts[this.id].chart_options.labelsDiv }
    //
    //     // let data = []
    //     // if (this.chart_data[0] && this.chart_data[0].length === 0) {
    //     //   let row = []
    //     //   Array.each(this.$options.charts[this.id].chart_options.labels, function (label) {
    //     //     row.push(0)
    //     //   })
    //     //   data.push(row)
    //     // } else {
    //     //   data = this.get_data()
    //     //   // data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
    //     //   // data = []
    //     // }
    //     let data = this.get_data()
    //
    //     // Array.each(this.chart_data, function(row){
    //     //   row[0] = new Date(row[0])
    //     //   data.push(row)
    //     // })
    //
    //     // console.log('__chart_create', this.id, this.$options.charts[this.id].chart_options)
    //
    //     // /**
    //     // * should add an option for general smooth plotting (true | false)
    //     // **/
    //     // if (this.$options.charts[this.id].chart_options.fillGraph !== true && this.smoothness === true) { this.$options.charts[this.id].chart_options.plotter = smoothPlotter }
    //
    //     this.$options.charts[this.id].graph = new Dygraph(
    //       document.getElementById(this.id), // containing div
    //       data,
    //       this.$options.charts[this.id].chart_options
    //     )
    //
    //     debug('__chart_create', this.id, this.$options.charts[this.id].chart_options, data)
    //
    //     this.$options.charts[this.id].graph.ready(function () {
    //       // //////////////console.log('config '+this.id+' ready')
    //       debug('__chart_create ready', this.id)
    //       this.ready = true
    //       // this.update()
    //     }.bind(this))
    //
    //     if (this.config.init) { this.config.init(this, this.$options.charts[this.id].graph, 'dygraph') }
    //
    //     // this.update()
    //   }
    // },
    // get_data: function (data) {
    //   let self = this
    //   debug('get_data', this.id, data, this.chart_data, this.$options.charts[this.id].buffered_data)
    //   if (this.$options.charts[this.id].buffered_data && Array.isArray(this.$options.charts[this.id].buffered_data) && this.$options.charts[this.id].buffered_data.length > 0 && this.$options.charts[this.id].buffered_data[0][0]) {
    //     if (data && Array.isArray(data) && data.length > 0 && data[0][0]) {
    //       data = this.$options.charts[this.id].buffered_data.append(data)
    //     } else {
    //       data = this.$options.charts[this.id].buffered_data
    //     }
    //   } else if (this.chart_data[0] && this.chart_data[0].length === 0 && (!data || data.length === 0)) {
    //     let row = []
    //     data = []
    //     Array.each(self.$options.charts[this.id].chart_options.labels, function (label) {
    //       row.push(0)
    //     })
    //     data.push(row)
    //   } else if (!data || data.length === 0) {
    //     data = JSON.parse(JSON.stringify(this.chart_data))
    //     // data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
    //     // data = []
    //   }
    //
    //   // data = (data && Array.isArray(data) && data.length > 0 && data[0][0])
    //   //   ? data
    //   //   : Array.clone(this.chart_data)
    //
    //   data = JSON.parse(JSON.stringify(data))
    //
    //   // data.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
    //   //
    //   // Array.each(data, function (row) {
    //   //   if (row) { row[0] = new Date(row[0]) }
    //   //   // data.push(row)
    //   // })
    //
    //   return Array.clone(data)
    // },
    update: function (data) {
      debug('update', data, this.$refs)
      this.$refs[this.id + '.base'].update(data)

      // data = this.get_data(data)
      // debug('update', this.id, this.ready, data, this.$options.charts[this.id].chart_options.labels)
      // // let options = (this.ready === true && this.$options.charts[this.id].graph.numRows() > 1) ? { 'dateWindow': this.$options.charts[this.id].graph.xAxisExtremes() } : {}
      // // if(this.$options.charts[this.id].visible === true && this.ready === true){
      // if (this.ready === true && data && data[0] && data[0].length === this.$options.charts[this.id].chart_options.labels.length) {
      //   // //console.log('updateOptions', this.id, data)
      //
      //   // this.updateOptions(
      //   //   data,
      //   //   Object.merge(this.$options.charts[this.id].chart_options, { 'dateWindow': this.$options.charts[this.id].graph.xAxisExtremes() }),
      //   //   false
      //   // )
      //
      //   let end = data[data.length - 1][0]
      //   let start
      //   if (!this.chart_data_length) {
      //     start = data[0][0]
      //   } else {
      //     start = end - (this.chart_data_length * 1000)
      //   }
      //
      //   debug('update start - end %s %d %s %s %o', this.id, this.chart_data_length, new Date(start), new Date(end), data)
      //
      //   data.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
      //
      //   Array.each(data, function (row) {
      //     if (row) { row[0] = new Date(row[0]) }
      //     // data.push(row)
      //   })
      //
      //   this.updateOptions(
      //     data,
      //     Object.merge(Object.clone(this.$options.charts[this.id].chart_options), { 'dateWindow': [start, end] }),
      //     false
      //   )
      //   // if (this.optionsChanged) {
      //   //   this.optionsChanged = false
      //   //   this.updateOptions(
      //   //     data,
      //   //     Object.merge(Object.clone(this.$options.charts[this.id].chart_options), { 'dateWindow': [start, end] }),
      //   //     false
      //   //   )
      //   // } else {
      //   //   this.updateOptions(data, undefined, false)
      //   // }
      //
      //   this.$options.charts[this.id].buffered_data = []
      //
      //   return true
      // } else if (data && data[0] && data[0].length === this.$options.charts[this.id].chart_options.labels.length) {
      //   // this.$options.charts[this.id].buffered_data.append(data)
      //   setTimeout(function () {
      //     this.update(data)
      //   }.bind(this), 1000)
      //   return false
      // }
    },
    // updateOptions (data, options, block_redraw) {
    //   // debug('updateOptions', this.id, this.ready)
    //   // let self = this
    //
    //   if (
    //     this.highlighted === false &&
    //     this.ready === true
    //     // && this.data.length > 1
    //     // && this.data[0].length > 1
    //     // && this.$options.charts[this.id].freezed <= 2//needed number of iterations to update data 'onRange'
    //     // && this.freezed === false
    //   ) {
    //     // if(self.data[0][0] === undefined && self.config.options && self.config.options.labels)//dygraph code, should be would
    //     //   Array.each(self.config.options.labels, function(label, index){
    //     //     if(index === 0){
    //     //       self.data[0].push(Date.now())
    //     //     }
    //     //     else{
    //     //       // data[0].push(0)
    //     //       self.data[0].push(null)
    //     //     }
    //     //
    //     //   })
    //
    //     /**
    //       * should be sorted already
    //       **/
    //     // if(this.config.skip > 0)
    //     //   data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
    //
    //     // let data = []
    //     // console.log('updateOptions', data, options)
    //
    //     this.$options.charts[this.id].graph.updateOptions(
    //       Object.merge(
    //         {
    //           'file': data
    //         },
    //         options
    //       ),
    //       block_redraw
    //     )
    //
    //     // this.$options.charts[this.id].graph.updateOptions(
    //     //   { 'dateWindow': this.$options.charts[this.id].graph.xAxisExtremes() },
    //     //   block_redraw
    //     // );
    //     let selection = (this.config.skip && this.config.skip > 0) ? this.config.skip : 1
    //
    //     debug('updateOptions selection', this.id, data.length, selection)
    //
    //     this.$options.charts[this.id].graph.setSelection(this.$options.charts[this.id].graph.numRows() - selection, {}, false)
    //   }
    // }
  }
}
</script>

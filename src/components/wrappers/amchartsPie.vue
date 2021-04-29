<template>
  <div :ref="id">
    <div
      :id="id"
      class="chartdiv"
      :class="chart.class"
      :style="chart.style"
    />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('components:wrappers:amchartsPie')
debug.log = console.log.bind(console) // don't forget to bind to console!

import chartWrapperMixin from '@mixins/chartWrapper.vue'

import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import am4themes_dark from '@amcharts/amcharts4/themes/dark'

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated)
// Themes end

// import { countries, continents } from '@apps/logs/web/data/world'
import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  mixins: [chartWrapperMixin],

  name: 'amcharts-pie',

  _amcharts_barrace_defaults: {
    // colorSet: new am4core.ColorSet(),
    // imageSeries: undefined,

    chart: undefined,
    label: undefined,
    categoryAxis: undefined,
  },

  props: {
    // sum: {
    //   type: Boolean,
    //   default: false
    // },
    // zoom: {
    //   type: [Number, Function],
    //   default: 0.3
    // },
    id: {
      type: String,
      default: 'chartdiv'
    },
    // stepDuration: {
    //   type: Number,
    //   default: 2000
    // },
    // label: {
    //   type: String,
    //   default: ''
    // },
    labels: {
      type: Boolean,
      default: true
    },
    ticks: {
      type: Boolean,
      default: true
    },
    categoryY: {
      type: String,
      default: 'categoryY'
    },
    valueX: {
      type: String,
      default: 'valueX'
    },
    values: {
      type: [Array, Object],
      default: function () { return [] }
    },
    followColorScheme: {
      type: Boolean,
      default: false
    },
    colorSet: {
      type: Object,
      default: function () { return new am4core.ColorSet() }
    }
    // host: {
    //   type: String,
    //   default: ''
    // },
    // cities: {
    //   type: Array,
    //   default: function () { return [] }
    // }
  },
  data () {
    return {
      // chart: {}
    }
  },

  // computed: {
  //   // Augment passed options with defaults for Dygraphs
  //   // graphOptions: function () {
  //   //   // let options = Object.merge(this.defaultOptions, this.chart.options)
  //   //   let options = Object.merge(this.chart.options, this.defaultOptions)// right now force some default options like colours
  //   //   /**
  //   //   * should add an option for general smooth plotting (true | false)
  //   //   **/
  //   //   if (options.fillGraph !== true && this.smoothness === true) { options.plotter = smoothPlotter }
  //   //
  //   //   /**
  //   //   * seting 'ticker' is a really performance improvement
  //   //   **/
  //   //   if (!options.axes || options.axes.x || options.axes.x.ticker) {
  //   //     options = Object.merge(options, {
  //   //       axes: {
  //   //         x: {
  //   //           ticker: Dygraph.dateTicker
  //   //         }
  //   //       }
  //   //     })
  //   //   }
  //   //   return options
  //   // },
  //   // defaultOptions: function () {
  //   //   // debug('defaultOptions', new am4core.ColorSet())
  //   //   return {
  //   //     colorSet: new am4core.ColorSet(),
  //   //     // imageSeries: undefined,
  //   //
  //   //     chart: undefined,
  //   //     label: undefined,
  //   //     categoryAxis: undefined,
  //   //   }
  //   // },
  //   // elementClass: function() {
  //   //   return this.dark ? 'db-dygraphs db-dark' : 'db-dygraphs';
  //   // }
  // },

  watch: {
    values: {
      handler: function (newData) {
        this.handle_data(newData)
      },
      deep: true
    },

    dark: function () {
      // this.optionsChanged = true
      if (this.$options['charts'][this.id].chart && typeof (this.$options['charts'][this.id].chart.dispose) === 'function') {
        this.$options['charts'][this.id].chart.dispose()
      }
      this.$options['charts'][this.id].chart = undefined
      this.create()
      this.update()
    },
    colorScheme: function () {
      if (this.followColorScheme === true) {
        if (this.$options['charts'][this.id].chart && typeof (this.$options['charts'][this.id].chart.dispose) === 'function') {
          this.$options['charts'][this.id].chart.dispose()
        }
        this.$options['charts'][this.id].chart = undefined
        this.create()
        this.update()
      }
    }
  },
  methods: {
    create: function () {
      debug('create', this.id)
      if (!this.$options['charts'][this.id]) {
        this.$options['charts'][this.id] = {}
      }

      this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._amcharts_barrace_defaults))
      // this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], this.defaultOptions)

      let newData = this.format_values(this.values)
      if (newData.length > 0) {
        this.init_chart(newData)
      }
    },
    detroy: function () {
      if (this.$options['charts'][this.id].chart !== undefined && this.$options['charts'][this.id].chart.clear && typeof this.$options['charts'][this.id].chart.clear === 'function') {
        this.$options['charts'][this.id].chart.clear()
      }
    },
    get_data: function (data) {
      data = (data && data.length > 0) ? data : (this.chart_data && this.chart_data.length > 0 && this.chart_data[0][0]) ? this.chart_data : this.$options.charts[this.id].buffered_data
      data = JSON.parse(JSON.stringify(data))
      return data
    },
    update: function (data) {
      debug('update', this.id, data, this.$options.charts[this.id].buffered_data, this.chart_data, this.get_data(data))
      this.handle_data(this.get_data(data).getLast())
      if (data && data.length > 0) {
        this.$options.charts[this.id].buffered_data = Array.clone(data)
      }
    },
    format_values: function (newData) {
      if (newData && newData !== null && (newData.length > 0 || Object.getLength(newData) > 0)) {
        newData = JSON.parse(JSON.stringify(newData))

        if (!Array.isArray(newData)) {
          let _newData = []
          Object.each(newData, function (val, prop) {
            let _obj = {}
            _obj[this.categoryY] = prop
            if (val[this.valueX]) {
              _obj[this.valueX] = val[this.valueX]
            } else {
              _obj[this.valueX] = val
            }
            _newData.push(_obj)
          }.bind(this))

          newData = Array.clone(_newData)
        }
      }

      debug('values %o', newData)
      return newData
    },
    handle_data: function (newData) {
      // debug('chart values', this.id, newData, this.categoryY, this.valueX)
      if (newData && newData !== null) { // && (newData.length > 0 || Object.getLength(newData) > 0)
        newData = this.format_values(newData)
        debug('chart values', this.id, newData, this.categoryY, this.valueX)
        if ((newData.length > 0 || Object.getLength(newData) > 0) && this.$options['charts'][this.id].chart === undefined) {
          this.init_chart(newData)
        } else if ((newData.length > 0 || Object.getLength(newData) > 0) && this.$options['charts'][this.id].chart !== undefined) {
          // let itemsWithNonZero = 0

          /**
          * if not sum, set all values to 0
          * on next loop, only found values will get set with their new values
          **/
          // if (this.sum !== true) {
          //   for (let i = 0; i < this.$options['charts'][this.id].chart.data.length; i++) {
          //     this.$options['charts'][this.id].chart.data[i][this.valueX] = 0
          //   }
          // }
          //
          // for (let i = 0; i < newData.length; i++) {
          //   let val = newData[i]
          //   let found = false
          //   for (let j = 0; j < this.$options['charts'][this.id].chart.data.length; j++) {
          //     if (val[this.categoryY] === this.$options['charts'][this.id].chart.data[j][this.categoryY]) {
          //       if (this.sum === true) {
          //         this.$options['charts'][this.id].chart.data[j][this.valueX] += val[this.valueX]
          //       } else {
          //         this.$options['charts'][this.id].chart.data[j][this.valueX] = val[this.valueX]
          //       }
          //       found = true
          //     }
          //   }
          //   if (found === false) {
          //     this.$options['charts'][this.id].chart.data.push(val)
          //   }
          // }
          this.$options['charts'][this.id].chart.data = newData
          debug('this.$options[charts][this.id].chart.data', this.$options['charts'][this.id].chart.data)
          this.$options['charts'][this.id].chart.invalidateRawData()
          // this.$options['charts'][this.id].label.text = this.label

          // debug('ZOOM %s ', this.id, this.$options['charts'][this.id].chart.data.length, (typeof this.zoom === 'function') ? this.zoom(this.$options['charts'][this.id].chart.data, this.categoryY, this.valueX) : this.zoom)
          // this.$options['charts'][this.id].categoryAxis.zoom({ start: 0, end: (typeof this.zoom === 'function') ? this.zoom(this.$options['charts'][this.id].chart.data, this.categoryY, this.valueX) : (this.zoom > 0) ? this.zoom : 1 })
          // }
        } else if ((newData.length === 0 && Object.getLength(newData) === 0) && this.$options['charts'][this.id].chart !== undefined) {
          debug('chart removing', this.id)
          // this.$options['charts'][this.id].chart.data = []
          // this.$options['charts'][this.id].chart.invalidateRawData()
          if (this.$options['charts'][this.id].chart !== undefined && this.$options['charts'][this.id].chart.clear && typeof this.$options['charts'][this.id].chart.clear === 'function') {
            this.$options['charts'][this.id].chart.clear()
          }
          this.$options['charts'][this.id].chart = undefined
        }
      }
    },
    init_chart: function (newData) {
      // newData = newData || []
      if (this.dark) {
        am4core.useTheme(am4themes_dark)
      } else {
        am4core.unuseTheme(am4themes_dark)
      }

      this.$options['charts'][this.id].chart = am4core.create(this.id, am4charts.PieChart)
      let pieSeries = this.$options['charts'][this.id].chart.series.push(new am4charts.PieSeries())

      if (this.followColorScheme === true) {
        Array.each(dbColors.getColors(this.dark, this.colorScheme), function (rgb, index) {
          pieSeries.colors.list[index] = am4core.color(rgb)
        })
      } else {
        Array.each(this.colorSet.list, function (color, index) {
          pieSeries.colors.list[index] = color
        })
      }

      // Add and configure Series

      pieSeries.labels.template.disabled = this.labels !== true
      pieSeries.ticks.template.disabled = this.ticks !== true

      pieSeries.dataFields.value = this.valueX
      pieSeries.dataFields.category = this.categoryY
      pieSeries.slices.template.stroke = am4core.color('#fff')
      pieSeries.slices.template.strokeWidth = 0
      pieSeries.slices.template.strokeOpacity = 1

      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1
      pieSeries.hiddenState.properties.endAngle = -90
      pieSeries.hiddenState.properties.startAngle = -90

      this.$options['charts'][this.id].pieSeries = pieSeries

      // this.$options['charts'][this.id].chart.padding(40, 40, 40, 40)

      // this.$options['charts'][this.id].label = this.$options['charts'][this.id].chart.plotContainer.createChild(am4core.Label)
      // this.$options['charts'][this.id].label.x = am4core.percent(97)
      // this.$options['charts'][this.id].label.y = am4core.percent(95)
      // this.$options['charts'][this.id].label.horizontalCenter = 'right'
      // this.$options['charts'][this.id].label.verticalCenter = 'middle'
      // this.$options['charts'][this.id].label.dx = -15
      // this.$options['charts'][this.id].label.fontSize = 50
      //
      // this.$options['charts'][this.id].categoryAxis = this.$options['charts'][this.id].chart.yAxes.push(new am4charts.CategoryAxis())
      // this.$options['charts'][this.id].categoryAxis.renderer.grid.template.location = 0
      // this.$options['charts'][this.id].categoryAxis.dataFields.category = this.categoryY
      // this.$options['charts'][this.id].categoryAxis.renderer.minGridDistance = 1
      // this.$options['charts'][this.id].categoryAxis.renderer.inversed = true
      // this.$options['charts'][this.id].categoryAxis.renderer.grid.template.disabled = true
      //
      // let valueAxis = this.$options['charts'][this.id].chart.xAxes.push(new am4charts.ValueAxis())
      // valueAxis.min = 0
      // valueAxis.rangeChangeEasing = am4core.ease.linear
      // valueAxis.rangeChangeDuration = this.stepDuration
      // valueAxis.extraMax = 0.1
      //
      // let series = this.$options['charts'][this.id].chart.series.push(new am4charts.ColumnSeries())
      // series.dataFields.categoryY = this.categoryY
      // series.dataFields.valueX = this.valueX
      // series.tooltipText = '{valueX.value}'
      // // series.tooltipText = '{valueX.workingValue}'
      // series.columns.template.strokeOpacity = 0
      // series.columns.template.column.cornerRadiusBottomRight = 5
      // series.columns.template.column.cornerRadiusTopRight = 5
      // series.interpolationDuration = this.stepDuration
      // series.interpolationEasing = am4core.ease.linear
      //
      // let labelBullet = series.bullets.push(new am4charts.LabelBullet())
      // labelBullet.label.horizontalCenter = 'right'
      // // labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}"
      // labelBullet.label.text = '{values.valueX.workingValue}'
      // labelBullet.label.textAlign = 'end'
      // labelBullet.label.dx = -10
      //
      // this.$options['charts'][this.id].chart.zoomOutButton.disabled = true
      //
      // // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      // series.columns.template.adapter.add('fill', function (fill, target) {
      //   return this.$options['charts'][this.id].chart.colors.getIndex(target.dataItem.index)
      // }.bind(this))
      //
      // // let year = 2003
      // this.$options['charts'][this.id].label.text = this.label
      // // year.toString()
      //
      // // let interval
      //
      // // this.$options['charts'][this.id].chart = chart
      // this.$options['charts'][this.id].categoryAxis.sortBySeries = series
      //
      this.$options['charts'][this.id].chart.data = JSON.parse(JSON.stringify(newData))
      // // this.$options['charts'][this.id].categoryAxis.zoom({ start: 0, end: 1 / this.$options['charts'][this.id].chart.data.length })
      // // this.$options['charts'][this.id].categoryAxis.zoom({ start: 0, end: (this.zoom > 0) ? this.zoom : 1 / this.$options['charts'][this.id].chart.data.length })
      // this.$options['charts'][this.id].categoryAxis.zoom({ start: 0, end: (typeof this.zoom === 'function') ? this.zoom(this.$options['charts'][this.id].chart.data, this.categoryY, this.valueX) : (this.zoom > 0) ? this.zoom : 1 })
      //
      // series.events.on('inited', function () {
      //   debug('series init')
      // })
    }

  },
  beforeDestroy () {
    if (this.$options['charts'][this.id].chart && typeof (this.$options['charts'][this.id].chart.dispose) === 'function') {
      this.$options['charts'][this.id].chart.dispose()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.$options['charts'][this.id].chart && typeof (this.$options['charts'][this.id].chart.dispose) === 'function') {
      this.$options['charts'][this.id].chart.dispose()
    }
    next()
  }

}
</script>

<style scoped>
.chartdiv {
  width: 100%;
  height: 500px;
}
</style>

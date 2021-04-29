<template>

  <div :ref="id">
    <div
      :id="id"
      class="chartdiv"
      :class="config.class"
      :style="config.style"
    />
  </div>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('components:wrappers:amchartsWorldCitydMap')
debug.log = console.log.bind(console) // don't forget to bind to console!

import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import am4themes_dark from '@amcharts/amcharts4/themes/dark'

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated)
// Themes end

import { countries, continents } from 'src/data/world'

import chartWrapperMixin from '@mixins/chartWrapper.vue'

import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  mixins: [chartWrapperMixin],

  name: 'amcharts-worl-map',

  _amcharts_worldmap_defaults: {
    // colorSet: new am4core.ColorSet(),
    imageSeries: undefined,

    chart: undefined,
    label: undefined,
    categoryAxis: undefined,
  },

  props: {
    // host: {
    //   type: String,
    //   default: ''
    // },
    id: {
      type: String,
      default: 'chartdiv'
    },
    cities: {
      type: Array,
      default: function () { return [] }
    },
    followColorScheme: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // chart: {}
      colorSet: new am4core.ColorSet()
    }
  },
  watch: {
    'cities': function (data) {
      this.handle_data(data)
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
  // destroyed () {
  //   if (this.$options['charts'][this.id].chart !== undefined && this.$options['charts'][this.id].chart.clear && typeof this.$options['charts'][this.id].chart.clear === 'function') {
  //     this.$options['charts'][this.id].chart.clear()
  //   }
  // },

  methods: {
    create: function () {
      debug('create', this.id)
      if (!this.$options['charts'][this.id]) {
        this.$options['charts'][this.id] = {}
      }

      // this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options['charts'][this.id]._amcharts_worldmap_defaults))
      this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._amcharts_worldmap_defaults))
      this.init_chart()
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
    // update: function (data) {
    //   debug('update', this.id, data, this.get_data(data).getLast())
    //   this.handle_data(this.get_data(data).getLast())
    // },
    handle_data: function (data) {
      // if (data && data !== null) { // && (newData.length > 0 || Object.getLength(newData) > 0)
      let self = this
      // if (self.$options['charts'][self.id].colorSet) {
      data = JSON.parse(JSON.stringify(data))
      let _data = []
      Array.each(data, function (city) {
        if (city !== undefined && city !== null) {
          // city.color = self.$options['charts'][self.id].colorSet.next()
          if (!city.color && self.followColorScheme === true) {
            city.color = dbColors.getColors(self.dark, self.colorScheme)[0]
          } else if (!city.color) {
            city.color = self.colorSet.getIndex(16)
          } else {
            if (city.color._value) { city.color = am4core.color(city.color._value) }
          }
          // else{
          //   city.color = city.color
          // }

          // debug('cities %o', city, { 'color': self.$options['charts'][self.id].colorSet.next() })
          _data.push(city)
        }
      })

      if (_data.length > 0) {
        this.$options['charts'][this.id].chart.invalidateData()
        this.$options['charts'][this.id].imageSeries.data = _data
      }
      debug('cities %o', data)
      // }
      // }
    },
    init_chart: function () {
      debug('init_chart', this.id)
      if (this.dark) {
        am4core.useTheme(am4themes_dark)
      } else {
        am4core.unuseTheme(am4themes_dark)
      }

      let chart = am4core.create(this.id, am4maps.MapChart)
      chart.projection = new am4maps.projections.Miller()
      // Create map polygon series for world map
      let worldSeries = chart.series.push(new am4maps.MapPolygonSeries())
      worldSeries.useGeodata = true
      worldSeries.geodata = am4geodata_worldLow
      // Exclude Antartica
      worldSeries.exclude = ['AQ']

      let worldPolygon = worldSeries.mapPolygons.template
      worldPolygon.tooltipText = '{name}'
      // worldPolygon.nonScalingStroke = true
      worldPolygon.strokeOpacity = 0.6
      // worldPolygon.fill = am4core.color('#eee')
      // worldPolygon.propertyFields.fill = 'color'

      let hs = worldPolygon.states.create('hover')
      // hs.properties.fill = chart.colors.getIndex(9)
      hs.properties.fill = chart.colors.getIndex(0)

      /**
      * @start
      **/
      // Add image series
      this.$options['charts'][this.id].imageSeries = chart.series.push(new am4maps.MapImageSeries())
      this.$options['charts'][this.id].imageSeries.mapImages.template.propertyFields.longitude = 'longitude'
      this.$options['charts'][this.id].imageSeries.mapImages.template.propertyFields.latitude = 'latitude'
      this.$options['charts'][this.id].imageSeries.mapImages.template.tooltipText = '{title}'
      this.$options['charts'][this.id].imageSeries.mapImages.template.propertyFields.url = 'url'

      let circle = this.$options['charts'][this.id].imageSeries.mapImages.template.createChild(am4core.Circle)
      circle.radius = 3
      circle.propertyFields.fill = 'color'

      let circle2 = this.$options['charts'][this.id].imageSeries.mapImages.template.createChild(am4core.Circle)
      circle2.radius = 3
      circle2.propertyFields.fill = 'color'

      circle2.events.on('inited', function (event) {
        this.animateBullet(event.target)
      }.bind(this))

      /**
      * @end
      **/

      // removed country zoom
      // Create country specific series (but hide it for now)
      // let countrySeries = chart.series.push(new am4maps.MapPolygonSeries())
      // countrySeries.useGeodata = true
      // countrySeries.hide()
      // countrySeries.geodataSource.events.on('done', function (ev) {
      //   worldSeries.hide()
      //   countrySeries.show()
      // })
      //
      // let countryPolygon = countrySeries.mapPolygons.template
      // countryPolygon.tooltipText = '{name}'
      // countryPolygon.nonScalingStroke = true
      // countryPolygon.strokeOpacity = 0.5
      // countryPolygon.fill = am4core.color('#eee')
      //
      // let hsStates = countryPolygon.states.create('hover')
      // hsStates.properties.fill = chart.colors.getIndex(9)
      //
      // // Set up click events
      // worldPolygon.events.on('hit', function (ev) {
      //   ev.target.series.chart.zoomToMapObject(ev.target)
      //   let map = ev.target.dataItem.dataContext.map
      //   if (map) {
      //     ev.target.isHover = false
      //     countrySeries.geodataSource.url = 'https://www.amcharts.com/lib/4/geodata/json/' + map + '.json'
      //     countrySeries.geodataSource.load()
      //   }
      // })

      // Set up data for countries
      let data = []
      for (let id in countries) {
        if (countries.hasOwnProperty(id)) {
          let country = countries[id]
          if (country.maps.length) {
            data.push({
              id: id,
              color: chart.colors.getIndex(continents[country.continent_code]),
              map: country.maps[0]
            })
          }
        }
      }
      worldSeries.data = data

      // Zoom control
      chart.zoomControl = new am4maps.ZoomControl()

      let homeButton = new am4core.Button()
      homeButton.events.on('hit', function () {
        worldSeries.show()
        // countrySeries.hide() //removed country zoom
        chart.goHome()
      })

      homeButton.icon = new am4core.Sprite()
      homeButton.padding(7, 5, 7, 5)
      homeButton.width = 30
      homeButton.icon.path = 'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8'
      homeButton.marginBottom = 10
      homeButton.parent = chart.zoomControl
      homeButton.insertBefore(chart.zoomControl.plusButton)

      this.$options['charts'][this.id].chart = chart
    },
    animateBullet: function (circle) {
      let animation = circle.animate([{ property: 'scale', from: 1, to: 5 }, { property: 'opacity', from: 1, to: 0 }], 1000, am4core.ease.circleOut)
      // removed constant animation
      // animation.events.on('animationended', function (event) {
      //   this.animateBullet(event.target.object)
      // }.bind(this))
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
  height: 100%;
}
</style>

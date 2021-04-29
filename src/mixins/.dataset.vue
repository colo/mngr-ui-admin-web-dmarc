<script>

import * as Debug from 'debug'
const debug = Debug('mixins:dataset')
debug.log = console.log.bind(console) // don't forget to bind to console!

import { v4 as uuidv4 } from 'uuid'

export default {

  components: {
  },

  _dataset_mixin_defaults: {
    /**
    * set/modified by graph.vue or your own logic
    **/
    // focus: true,
    // visible: true,

    __range_init: false,
    __dataset_unwatcher: undefined,
    __buffer_data: [], // array to save individual datasets until we fill in with ranges

    root: undefined,
    path: undefined,
    key: undefined,

    // length: undefined,
    dataset_data: [],
  },

  props: {
    dataset: {
      type: [Object],
      default: () => ({
        range: [],
        length: undefined,
        // interval: 1, // in seconds
        merged: false,
        data: [],
        numeric: true,
        sources: undefined
      })
    },
    /**
    * if you send the complete data set on each update, set this to true,
    * else it appends data to a buffer
    **/
    buffer: {
      type: [Boolean],
      default: true
    }
  },

  data () {
    return {
      dataset_lastupdate: 0
      // dataset_data: []
    }
  },

  watch: {
    'dataset.range': {
      handler: function (newVal, oldVal) {
        if (newVal && oldVal && !newVal.every(function (val, index) { return val === oldVal[index] })) {
          debug('new range', newVal, oldVal)
          this.__change_range(newVal)
        }
      }
      // deep: true
    }
  },
  created () {
    debug('create', this.id)
    if (!this.$options['charts'][this.id]) {
      this.$options['charts'][this.id] = {}
    }

    this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._dataset_mixin_defaults))

    let range_length = (this.dataset.range && this.dataset.range[1] && this.dataset.range[0]) ? (this.dataset.range[1] - this.dataset.range[0]) / 1000 : undefined
    if (range_length === undefined || range_length <= 1) { this.$options['charts'][this.id].__range_init = true }

    this.dataset.length = this.dataset.length || range_length
    // this.$options['charts'][this.id].length = this.dataset.length || range_length

    this.$options['charts'][this.id].root = this.id.split('.')[0]
    this.$options['charts'][this.id].path = this.id.split('.')[1]
    // this.$options['charts'][this.id].key = this.id.split('.')[2]
    this.$options['charts'][this.id].key = this.id.substring(this.id.lastIndexOf('.') + 1)

    debug('dataset.vue data', this.id, this.dataset.data, this.dataset.range, this.dataset.length)

    if (this.dataset.range && this.dataset.length > 1) {
      let docs = []
      let new_docs_range = this.__get_new_range(docs, JSON.parse(JSON.stringify(this.dataset.range)))
      docs = new_docs_range.docs
      let range = new_docs_range.range

      if (docs.length > 0) {
        // ////console.log('datasets/get', docs, range)

        let datasets = []
        Array.each(docs, function (doc) {
          if (doc && doc.data) {
            let dataset = {
              timestamp: doc.metadata.timestamp,
              value: doc.data
            }
            datasets.push(dataset)
          }
        })

        /// ///////console.log('datasets/get 2', datasets)
        this.__set_dataset_data(datasets)
      }

      if (range.length > 0 && range[0] && range[1]) {
        this.__change_range(range)
      }
    }

    if (this.dataset && this.dataset.data && this.dataset.merged === true) {
      this.$options['charts'][this.id].__dataset_unwatcher = this.$watch('dataset.data', this.update_dataset_merged_data.bind(this), { deep: true })
      this.update_dataset_merged_data(this.dataset.data)
      // }
    } else if (this.dataset && this.dataset.data) {
      this.$options['charts'][this.id].__dataset_unwatcher = this.$watch('dataset.data', this.update_dataset_data.bind(this)) // { deep: true }
      this.update_dataset_data(this.dataset.data)
    }
  },
  beforeDestroy () {

  },
  destroyed () {
    // if (this.$options['charts'][this.id]) {
    //   this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._dataset_mixin_defaults))
    // }
    if (this.$options['charts'][this.id]) {
      // this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._graph_mixin_defaults))
      delete this.$options['charts'][this.id]
    }
    this.$off()
  },
  methods: {
    update_dataset_merged_data: function (datasets, old) {
      const DATA_LENGTH = datasets.length

      /**
        * if you don't clone it , you may be manipulating other datasets using this sames datasets
        **/
      datasets = Array.clone(datasets)// now we are safe to modify
      let val = (datasets) ? datasets[0] : undefined
      /// ///////console.log('dataset.data.0', val)

      if (val && val.length > 0) {
        if (!Array.isArray(val[0])) { // array of array, range data
          val = [val]
        }

        let columns = []
        for (let i = 1; i < DATA_LENGTH; i++) { // ommit timestamp
          columns.push(datasets[i])
        }

        // //console.log('MERGED COLUMNS', columns)

        if (columns.length > 0) {
          let matched_columns = false
          Array.each(val, function (row, index) {
            Array.each(columns, function (column, col_index) {
              // //console.log('COLUMN',column)
              if (column) {
                if (Array.isArray(column[0])) { // array of array, range data
                  val[index] = this._merge_tabular_data(val[index], column[index])// match columns/rows
                } else {
                  val[index] = this._merge_tabular_data(val[index], column)// fill always with same val
                }
                matched_columns = true
              }
            }.bind(this))
          }.bind(this))

          /// ///////console.log('__dataset_unwatcher merged ', val)

          if (matched_columns === true) {
            if (datasets.length === 1) {
              this.__add_datasets(val[val.length - 1])
            } else {
              this.__add_datasets(val)
            }
          }
        }
      }
    },
    update_dataset_data: function (val, old) {
      debug('update_dataset_data %s', this.id, val)

      if (val !== undefined) {
        // console.log('__dataset_unwatcher', this.id, val, this.dataset.length)
        try {
          val = JSON.parse(JSON.stringify(val))

          /**
          * when use "dataset.sources" as data, is always an array, even if it's not merged data
          * so we need to pick the only element (if there are more, is an error)
          */

          if (Array.isArray(val) && val.length > 1) { val = val[0] }

          // this.__dataset_data_watcher(val)
          if (val && val.length > 0) {
            // let __cloned = val // Array.clone(val)
            if (val.length === 1) {
              this.__add_datasets(val[val.length - 1])
            } else {
              this.__add_datasets(val)
            }
          }
        } catch (e) {}
      }
    },
    /**
    * based on docs (obtained from local DB) and range, defined if we can update dataset with this
    * plus a shorter remote range, or we need to clear and obtain all new data from remote
    */
    __change_range (range) {
      this.$options['charts'][this.id].__range_init = false

      debug('adding event', 'dashboard_' + this.dashboard + '/events/add', this.id)

      this.$store.commit('dashboard_' + this.dashboard + '/events/add', {
        id: this.id,
        type: 'onRange',
        'opts': {
          range: range
          // tabular: (this.$options['charts'][this.id].type === 'tabular') ? true : false
        }
      })
    },
    __get_new_range: function (docs, range) {
      // //////console.log('__get_new_range', docs, Array.clone(range))

      if (
        docs.length > 0 &&
        docs[docs.length - 1] &&
        docs[docs.length - 1].metadata &&
        docs[0].metadata.timestamp > range[0] - 10000 &&
        docs[0].metadata.timestamp < range[0] + 10000
      ) {
        /// ///console.log('__get_new_range', docs, Array.clone(range))

        let prev
        let missing = false

        docs.sort(function (a, b) { return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0) })

        Array.each(docs, function (doc) {
          if (prev && doc.metadata.timestamp - 5000 > prev.metadata.timestamp) {
            missing = true
          }
          prev = doc
        })

        if (missing === false) {
          range[0] = docs[docs.length - 1].metadata.timestamp
        } else {
          docs = []
        }
      } else {
        docs = []
      }

      return { docs: docs, range: range }
    },
    // __dataset_data_watcher: function(val){
    //   if(val && val.length > 0 && !this.$store.datasete[this.$options['charts'][this.id].type][this.id]){
    //     //////////console.log('registerModule dataset', this.$options['charts'][this.id].type, this.id)
    //     this.$store.registerModule([this.$options['charts'][this.id].type, this.id], Object.clone(datasetStore))
    //     this.$store.commit(this.$options['charts'][this.id].type+'/'+this.id+'/set_id', this.id)
    //     this.$store.commit(this.$options['charts'][this.id].type+'/'+this.id+'/set_type', this.$options['charts'][this.id].type)
    //   }
    //   else if(val && val.length > 0){
    //     this.__add_datasets(val)
    //   }
    // },
    _merge_tabular_data: function (a, b) {
      let merged = Array.clone(a)
      if (!b) {
        merged.push(undefined)
      } else {
        for (let i = 1; i < b.length; i++) { // ommit timestamp
          merged.push(b[i])
        }
      }
      return merged
    },
    __add_datasets: function (dataset) {
      debug('__add_datasets', this.id, dataset, this.$options['charts'])
      // console.log('dataset.vue __add_datasets', this.id, dataset)

      let data = {}
      if (this.$options['charts'][this.id].type === 'tabular') {
        if (Array.isArray(dataset[0])) { // array of array, range data
          let result = []
          Array.each(dataset, function (value) {
            result.push({
              timestamp: value[0],
              value: value
            })
          })

          // result.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )

          /// /////////////////console.log('process_os_tabular', path, key, result)
          // data = {
          //   tabular: true,
          //   root: this.$options['charts'][this.id].root,
          //   path: this.$options['charts'][this.id].path,
          //   key: this.$options['charts'][this.id].key,
          //   data: result
          // }
          dataset = {
            timestamp: new Date(),
            value: result
          }
        } else {
          dataset = {
            timestamp: new Date(),
            value: dataset
          }
          // data = {
          //   tabular: true,
          //   root: this.$options['charts'][this.id].root,
          //   path: this.$options['charts'][this.id].path,
          //   key: this.$options['charts'][this.id].key,
          //   data: {
          //     // timestamp: dataset[0],
          //     timestamp: new Date(),
          //     value: dataset
          //   }
          // }
        }
      }
      // else {
      //   data = {
      //     tabular: false,
      //     root: this.$options['charts'][this.id].root,
      //     path: this.$options['charts'][this.id].path,
      //     key: this.$options['charts'][this.id].key,
      //     data: dataset
      //   }
      // }

      // this.__set_dataset_data(data.data)
      this.__set_dataset_data(dataset)
    },
    __set_dataset_data: function (data) {
      debug('__set_dataset_data %s %o', this.id, data)

      /**
      * @config: this should be config options
      * this.$options['charts'][this.id].focus
      * this.$options['charts'][this.id].visible
      */

      if (this.buffer === true) {
        if (!Array.isArray(data)) data = [data]

        this.$options['charts'][this.id].__range_init = true

        this.$options['charts'][this.id].__buffer_data = this.$options['charts'][this.id].__buffer_data.append(JSON.parse(JSON.stringify(data)))

        debug('buffer === true', this.$options['charts'][this.id].__buffer_data, this.$options['charts'][this.id].dataset_data)

        // Array.each(Array.clone(this.$options['charts'][this.id].__buffer_data), function (val) {
        Array.each(this.$options['charts'][this.id].__buffer_data, function (val) {
          let found = false
          Array.each(this.$options['charts'][this.id].dataset_data, function (dataset) {
            if (dataset.timestamp === val.timestamp) { found = true }
          })

          if (found === false) { this.$options['charts'][this.id].dataset_data.push(val) }
        }.bind(this))

        // this.$options['charts'][this.id].dataset_data.sort(function (a, b) {
        //   return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0)
        // })

        this.$options['charts'][this.id].__buffer_data = []
        // }
      } else { // no_buffer
        this.$options['charts'][this.id].dataset_data = data
        this.$options['charts'][this.id].__range_init = true
      }

      // if (this.$options['charts'][this.id].__buffer_data.length > 10) { this.$options['charts'][this.id].__range_init = true }
      debug('__set_dataset_data2', this.id, this.$options['charts'][this.id].dataset_data)

      if (this.$options['charts'][this.id].__range_init === true) {
        // if you are not using buffer, you are managing your data, you are in charge of sorting
        if (this.buffer === true) {
          this.$options['charts'][this.id].dataset_data.sort(function (a, b) {
            return (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0)
          })

          debug('__set_dataset_data3', this.id, JSON.parse(JSON.stringify(this.$options['charts'][this.id].dataset_data))) //

          // let length = this.$options['charts'][this.id].dataset_data.length
          let slice = (!this.config.interval || this.config.interval === undefined)
            ? (!this.dataset.length || this.dataset.length === undefined)
              ? data.length
              : this.dataset.length
            : (!this.dataset.length || this.dataset.length === undefined)
              ? data.length * this.config.interval
              : this.dataset.length * this.config.interval

          this.$options['charts'][this.id].dataset_data = this.$options['charts'][this.id].dataset_data.slice(0, slice)

          debug('__set_dataset_data4', this.id, JSON.parse(JSON.stringify(this.$options['charts'][this.id].dataset_data)), slice) //

          this.$options['charts'][this.id].dataset_data.sort(function (a, b) {
            return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0)
          })
        }

        this.dataset_lastupdate = Date.now()

        this.__update_data(this.$options['charts'][this.id].dataset_data)
      }
    }

  }
}
</script>

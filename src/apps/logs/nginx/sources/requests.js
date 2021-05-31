import * as Debug from 'debug'
const debug = Debug('apps:logs.nginx:periodical:requests')
debug.log = console.log.bind(console) // don't forget to bind to console!

import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'
import {SECOND, MINUTE, HOUR, DAY, WEEK} from '@libs/time/const'

let init = false

const generic_callback = function (data, metadata, key, vm) {
  debug('PERIODICAL GENERIC CALLBACK data %s %o', key, data, metadata)
}

// const hosts_info = {
//   params: function (_key, vm) {
//     debug('PERIODICAL hosts_info %o %o', _key, vm)
//
//     // const MINUTE = 60000
//
//     let source
//     let key
//
//     if (!_key) {
//       // key = ['host.info', 'config.range', 'minute.range']
//       key = ['hosts.info'] //, 'minute.range'
//     }
//
//     if (
//       _key
//     ) {
//       switch (_key) {
//         case 'hosts.info':
//           source = [{
//             params: { id: _key },
//             // path: 'all',
//             // range: 'posix ' + vm.start() + '-' + vm.end() + '/*',
//             query: {
//               'from': 'hosts',
//               'index': false,
//               /**
//               * right now needed to match OUTPUT 'id' with this query (need to @fix)
//               **/
//               'q': [
//                 {'data': ['networkInterfaces']},
//                 {'metadata': ['host']}
//               ],
//               // 'transformation': [
//               //   {
//               //     'orderBy': { 'index': 'r.desc(timestamp)' }
//               //   }
//               // ],
//               // 'filter': filter
//             }
//           }]
//           break
//       }
//     }
//
//     // debug('dmarc_info ', key, source)
//
//     return { key, source }
//   },
//   callback: generic_callback
//
// }

// const size_info = {
//   params: function (_key, vm) {
//     debug('PERIODICAL logs.nginx_info %o %o', _key, vm)
//
//     // const MINUTE = 60000
//
//     let source
//     let key
//
//     if (!_key) {
//       // key = ['host.info', 'config.range', 'minute.range']
//       key = ['logs.nginx.info'] //, 'minute.range'
//     }
//
//     let filter = [
//       "this.r.row('metadata')('path').eq('logs.nginx')"
//     ]
//
//     if (
//       _key
//     ) {
//       switch (_key) {
//         case 'logs.nginx.info':
//           source = [{
//             params: { id: _key },
//             // path: 'all',
//             range: 'posix ' + vm.start() + '-' + vm.end() + '/*',
//             query: {
//               'from': 'educativa',
//               'index': false,
//               /**
//               * right now needed to match OUTPUT 'id' with this query (need to @fix)
//               **/
//               'q': [
//                 // 'data',
//                 'metadata'
//               ],
//               'transformation': [
//                 {
//                   'orderBy': { 'index': 'r.desc(timestamp)' }
//                 }
//               ],
//               'filter': filter
//             }
//           }]
//           break
//       }
//     }
//
//     // debug('dmarc_info ', key, source)
//
//     return { key, source }
//   },
//   callback: generic_callback
//
// }

const size_first = {
  params: function (_key, vm) {
    debug('PERIODICAL logs.nginx_first %o %o', _key, vm)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['host.first', 'config.range', 'minute.range']
      key = ['logs.nginx.first'] //, 'minute.range'
    }

    let filter = [
      "this.r.row('metadata')('path').eq('logs.nginx')"
    ]

    if (vm.filters && Object.getLength(vm.filters) > 0) {
      Object.each(vm.filters, function (data, prop) {
        if (!Array.isArray(data)) data = []

        let _filter
        Array.each(data, function (value) {
          if (_filter === undefined) {
            _filter = "this.r.row('metadata')('" + prop + "').eq('" + value + "')"
          } else {
            _filter += ".or(this.r.row('metadata')('" + prop + "').eq('" + value + "')"
          }
        })

        if (data.length > 1) { // close each 'or'
          Array.each(data, function (value, index) {
            if (index < data.length - 1) { _filter += ')' }
          })
        }
        filter.push(_filter)
      })
    }

    debug('logs.nginx_first FILTER ', filter)

    if (
      _key
    ) {
      switch (_key) {
        case 'logs.nginx.first':
          source = [{
            params: { id: _key },
            query: {
              id: 'first',
              'q': [
                {'metadata': ['timestamp']}
              ],
            },
            // path: '/nginx',
            // range: 'posix ' + roundHours(Date.now() - DAY) + '-' + roundMilliseconds(Date.now()) + '/*',
            // query: {
            //   'from': 'logs_historical_day',
            //   // 'index': false,
            //   // /**
            //   // * right now needed to match OUTPUT 'id' with this query (need to @fix)
            //   // **/
            //   'q': [
            //     {'metadata': ['timestamp']}
            //   ],
            //   // 'transformation': [
            //   //   {
            //   //     'orderBy': { 'index': 'r.asc(timestamp)' },
            //   //   },
            //   //   {
            //   //     limit: 1
            //   //   }
            //   // ],
            //   'filter': filter
            //
            // }
          }]
          break
      }
    }

    debug('logs_nginx_first ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

// const size_periodical = {
//   params: function (_key, vm) {
//     debug('PERIODICAL logs.nginx_periodical %o %o', _key, vm)
//
//     // const MINUTE = 60000
//
//     let source
//     let key
//
//     if (!_key) {
//       // key = ['host.periodical', 'config.range', 'minute.range']
//       key = ['logs.nginx.periodical'] //, 'minute.range'
//     }
//
//     let filter = [
//       "this.r.row('metadata')('path').eq('logs.nginx')"
//     ]
//
//     if (vm.filters && Object.getLength(vm.filters) > 0) {
//       Object.each(vm.filters, function (data, prop) {
//         if (!Array.isArray(data)) data = []
//
//         let _filter
//         Array.each(data, function (value) {
//           if (_filter === undefined) {
//             _filter = "this.r.row('metadata')('" + prop + "').eq('" + value + "')"
//           } else {
//             _filter += ".or(this.r.row('metadata')('" + prop + "').eq('" + value + "')"
//           }
//         })
//
//         if (data.length > 1) { // close each 'or'
//           Array.each(data, function (value, index) {
//             if (index < data.length - 1) { _filter += ')' }
//           })
//         }
//         filter.push(_filter)
//       })
//     }
//
//     filter = filter.clean()
//     debug('logs.nginx_periodical FILTER ', filter)
//
//     if (
//       _key
//     ) {
//       switch (_key) {
//         case 'logs.nginx.periodical':
//           source = [{
//             params: { id: _key },
//             // path: 'all',
//             range: 'posix ' + vm.start() + '-' + vm.end() + '/*',
//             query: {
//               'from': 'educativa',
//               'index': false,
//               /**
//               * right now needed to match OUTPUT 'id' with this query (need to @fix)
//               **/
//               'q': [
//                 'data',
//                 'metadata'
//               ],
//               'transformation': [
//                 {
//                   'orderBy': { 'index': 'r.desc(timestamp)' }
//                 }
//               ],
//               'filter': filter
//
//               // query: `{
//               //     dmarc (limit: 0) {
//               //         data {
//               //           report {
//               // 						email,
//               // 						id,
//               // 						org,
//               // 						range {start, end}
//               // 					},
//               // 					policy {
//               // 						aspf,
//               // 					  domain,
//               // 					  fo,
//               // 					  p,
//               // 					  pct,
//               // 					  sp
//               // 					},
//               // 					records
//               //         }
//               //         metadata {
//               // 					domain,
//               // 				  host,
//               // 				  id,
//               // 				  path,
//               // 				  timestamp,
//               // 				  type,
//               // 				  tag,
//               // 				  range {start,end}
//               // 				}
//               //
//               //     }
//               //
//               //
//               // }`
//
//             }
//           }]
//           break
//       }
//     }
//
//     // debug('size_periodical ', key, source)
//
//     return { key, source }
//   },
//   callback: generic_callback
//
// }

const once = [
  // // hosts_info,
  // size_info,
  size_first,
  // size_periodical,
  // // size_report
]

const periodical = [
  // // hosts_info,
  // size_info,
  size_first,
  // size_periodical,
  // // size_report
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests

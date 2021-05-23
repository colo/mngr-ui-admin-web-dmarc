import * as Debug from 'debug'
const debug = Debug('apps:educativa:size:emails:periodical:requests')
debug.log = console.log.bind(console) // don't forget to bind to console!

import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'
import {SECOND, MINUTE, HOUR, DAY, WEEK} from '@libs/time/const'

let init = false

// let _top_domains = []
// let top_domains = {}

// import size_periodical_callback from '@apps/educativa/size/libs/periodical'
// import size_info_callback from '@apps/educativa/size/libs/info'

// import os_callback from '@apps/system/libs/periodical'
//
// import web_callback from '@apps/logs/web/libs/periodical'

const generic_callback = function (data, metadata, key, vm) {
  debug('PERIODICAL GENERIC CALLBACK data %s %o', key, data, metadata)

  if (key === 'educativa.size.emails.periodical') {
    // size_periodical_callback(data, metadata, key, vm)
    vm.size_data = data.educativa
  } else if (key === 'educativa.size.emails.info') {
    // size_info_callback(data, metadata, key, vm)
    vm.size_info = data.educativa
  } else if (key === 'educativa.size.emails.first') {
    // debug('GENERIC CALLBACK data FIRST %s %o', key, data, metadata)
    vm.datePickerMinDate = data.educativa[0].metadata.timestamp
  }
  // else if (key === 'educativa.size.emails.report') {
  //   debug('GENERIC CALLBACK data REPORT %s %o', key, data, metadata)
  //   // dmarc_info_callback(data, metadata, key, vm)
  //   // if (data.dmarc[0].metadata.timestamp * 1 !== vm.datePickerMinDate * 1) { vm.datePickerMinDate = data.dmarc[0].metadata.timestamp }
  //   vm.report = data.educativa[0]
  // } else if (key === 'hosts.info') {
  //   debug('GENERIC CALLBACK HOSTS INFO %s %o', key, data, metadata)
  //   // dmarc_info_callback(data, metadata, key, vm)
  //   // if (data.dmarc[0].metadata.timestamp * 1 !== vm.datePickerMinDate * 1) { vm.datePickerMinDate = data.dmarc[0].metadata.timestamp }
  //   vm.servers = data.hosts
  // }

  /**
	* graphql
	*
	if (key === 'dmarc.periodical') { dmarc_periodical_callback(data.dmarc, metadata, key, vm) }
	**/

  //
  // if (key === 'os.periodical') { os_callback(data, metadata, key, vm) }
  //
  // if (key === 'logs.periodical') { web_callback(data, metadata, key, vm) }
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

const size_info = {
  params: function (_key, vm) {
    debug('PERIODICAL educativa.size.emails_info %o %o', _key, vm)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['host.info', 'config.range', 'minute.range']
      key = ['educativa.size.emails.info'] //, 'minute.range'
    }

    let filter = [
      "this.r.row('metadata')('path').eq('educativa.size.emails')"
    ]

    if (
      _key
    ) {
      switch (_key) {
        case 'educativa.size.emails.info':
          source = [{
            params: { id: _key },
            // path: 'all',
            range: 'posix ' + vm.start() + '-' + vm.end() + '/*',
            query: {
              'from': 'educativa',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                // 'data',
                'metadata'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              'filter': filter
            }
          }]
          break
      }
    }

    // debug('dmarc_info ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

const size_first = {
  params: function (_key, vm) {
    debug('PERIODICAL educativa.size.emails_first %o %o', _key, vm)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['host.first', 'config.range', 'minute.range']
      key = ['educativa.size.emails.first'] //, 'minute.range'
    }

    let filter = [
      "this.r.row('metadata')('path').eq('educativa.size.emails')"
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

    debug('educativa.size.emails_first FILTER ', filter)

    if (
      _key
    ) {
      switch (_key) {
        case 'educativa.size.emails.first':
          source = [{
            params: { id: _key },
            // path: 'all',
            // range: 'posix ' + roundHours(Date.now() - DAY) + '-' + roundMilliseconds(Date.now()) + '/*',
            query: {
              'from': 'educativa',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                {'metadata': ['timestamp']}
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.asc(timestamp)' },
                },
                {
                  limit: 1
                }
              ],
              'filter': filter

            }
          }]
          break
      }
    }

    // debug('dmarc_first ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

const size_periodical = {
  params: function (_key, vm) {
    debug('PERIODICAL educativa.size.emails_periodical %o %o', _key, vm)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['host.periodical', 'config.range', 'minute.range']
      key = ['educativa.size.emails.periodical'] //, 'minute.range'
    }

    let filter = [
      "this.r.row('metadata')('path').eq('educativa.size.emails')"
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

    filter = filter.clean()
    debug('educativa.size.emails_periodical FILTER ', filter)

    if (
      _key
    ) {
      switch (_key) {
        case 'educativa.size.emails.periodical':
          source = [{
            params: { id: _key },
            // path: 'all',
            range: 'posix ' + vm.start() + '-' + vm.end() + '/*',
            query: {
              'from': 'educativa',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                'data',
                'metadata'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              'filter': filter

              // query: `{
              //     dmarc (limit: 0) {
              //         data {
              //           report {
              // 						email,
              // 						id,
              // 						org,
              // 						range {start, end}
              // 					},
              // 					policy {
              // 						aspf,
              // 					  domain,
              // 					  fo,
              // 					  p,
              // 					  pct,
              // 					  sp
              // 					},
              // 					records
              //         }
              //         metadata {
              // 					domain,
              // 				  host,
              // 				  id,
              // 				  path,
              // 				  timestamp,
              // 				  type,
              // 				  tag,
              // 				  range {start,end}
              // 				}
              //
              //     }
              //
              //
              // }`

            }
          }]
          break
      }
    }

    // debug('size_periodical ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

// const size_report = {
//   params: function (_key, vm) {
//     debug('PERIODICAL educativa.size.emails_report %o %o', _key, vm)
//
//     // const MINUTE = 60000
//
//     let source
//     let key
//
//     if (!_key) {
//       // key = ['host.report', 'config.range', 'minute.range']
//       key = ['educativa.size.emails.report'] //, 'minute.range'
//     }
//
//     if (
//       _key && vm.report_id && vm.report_id !== undefined
//     ) {
//       let filter = []
//
//       filter.push("this.r.row('metadata')('id').eq('" + vm.report_id + "')")
//
//       debug('educativa.size.emails_report FILTER ', filter)
//
//       switch (_key) {
//         case 'educativa.size.emails.report':
//           source = [{
//             params: { id: _key },
//             // path: 'all',
//             query: {
//               'from': 'educativa.size.emails',
//               'index': false,
//               /**
//               * right now needed to match OUTPUT 'id' with this query (need to @fix)
//               **/
//               'q': [
//                 'data',
//                 'metadata'
//               ],
//               'filter': filter
//             }
//           }]
//           break
//       }
//     }
//
//     // debug('size_report ', key, source)
//
//     return { key, source }
//   },
//   callback: generic_callback
//
// }

const once = [
  // hosts_info,
  size_info,
  size_first,
  size_periodical,
  // size_report
]

const periodical = [
  // hosts_info,
  size_info,
  size_first,
  size_periodical,
  // size_report
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests

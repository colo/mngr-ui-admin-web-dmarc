import * as Debug from 'debug'
const debug = Debug('store:user:actions')
debug.log = console.log.bind(console) // don't forget to bind to console!

import axios from 'axios'
axios.defaults.withCredentials = true

export function load (context, uri) {
  debug('load', uri)

  axios.get(uri)
    .then((res) => {
    // Perform Success Action
      debug('res', res)
      if (res.status === 200) { context.commit('save', res.data) }
    })
    // .catch((error) => {
    .catch(() => {
      // debug('error', error)
      context.commit('save', {
        avatar: undefined,
        name: undefined,
        surname: undefined,
        role: undefined,
        id: undefined,
        username: undefined
      })
    // error.response.status Check status code
    })
  // .finally(() => {
  //   // Perform action in always
  // })
}

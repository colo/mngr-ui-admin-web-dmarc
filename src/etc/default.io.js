'use strict'

export default [
  // {
  //   scheme: 'ws',
  //   host: 'localhost',
  //   port: 8080,
  //   io: { forceNew: false, transports: ['websocket'] }
  // },
  {
    scheme: 'ws',
    host: 'dmarc.infraestructura.educativa.org',
    port: 80,
    io: { forceNew: false, transports: ['websocket'] }
  },
  // {
  //   scheme: 'http',
  //   // host: 'localhost',
  //   // port: 8080,
  //   host: 'ui.infd01.infraestructura.educativa.org',
  //   port: 10000,
  //   io: { forceNew: false, transports: ['polling'] }
  // },
]

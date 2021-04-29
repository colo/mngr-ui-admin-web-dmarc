/* eslint-disable */
'use strict'

import { EventBus } from '@libs/eventbus'

import * as Debug from "debug"
const debug = Debug("libs:pipelines:output:eventbus")
debug.log = console.log.bind(console) // don't forget to bind to console!


export default function (payload) {
	debug('OUTPUT', payload, this)
	if (!payload.err) {
		Array.each(this.inputs, function (input) {
			let id = (input.options && input.options.id) ? input.options.id : undefined
			if (id !== undefined) {
				// debug('OUTPUT ID', payload, id)
				// let _id = id.replace('.', '\\.')
				let _id = id.split('.').join('\\.')
				let id_regexp = new RegExp('^' + _id + '\\[.*\\]$')
				// debug('OUTPUT RexExp', id_regexp)
				if (id_regexp.test(payload.id)) {
					let event_id = payload.id
					payload.id = payload.id.replace(id + '[', '').slice(0, -1)
					payload.input = id
					EventBus.$emit(event_id, payload)
					debug('OUTPUT EMIT', event_id, payload)
				}
			}
		})
	}
}

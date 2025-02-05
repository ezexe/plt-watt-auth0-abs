/// <reference path="../global.d.ts" />
'use strict'
/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function (fastify, _) {
  fastify.decorate('example', 'foo * bar * π÷0 * ∞')
}

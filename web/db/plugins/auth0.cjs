/// <reference path="../global.d.ts" />
"use strict";
/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function (fastify, opts) {
  const fastifyAuth0Verify = require("fastify-auth0-verify");
  
  // Register the plugin
  fastify.register(fastifyAuth0Verify, {
    domain: opts.auth0.domain, // e.g. "my-tenant.us.auth0.com"
    audience: [opts.auth0.audience, `https://${opts.auth0.domain}/userinfo`],
    formatUser: async (user) => {
      const dbUser = (await fastify.platformatic.entities.user.find({
        skipAuth: true,
        where: {
          provider: { eq: opts.auth0.provider },
          providerId: { eq: user.sub },
        },
      }))[0];
      return {
        ...user,
        ...dbUser,
        roles: ["user"],
      };
    },
  });
};

/// <reference path="../global.d.ts" />
"use strict";
/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function (fastify, opts) {
  fastify.get("/example", async (request, reply) => {
    return { hello: fastify.example };
  });

  fastify.post("/activate", async (req, res) => {
    try {
      const { randomUUID } = require("crypto");
      return req.user.db || await fastify.platformatic.entities.user.save({
        input: {
          email: req.user.auth0.email,
          provider: "auth0",
          providerId: req.user.auth0.sub,
          tenantId: randomUUID(),
          userId: randomUUID(),
        },
        skipAuth: true,
        ctx: req.ctx,
      });
    } catch (error) {
      return res.code(500).send({ error });
    }
  });
};

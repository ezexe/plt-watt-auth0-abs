"use strict";
const { randomUUID } = require("crypto");
/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function (fastify, opts) {
  fastify.get("/example", async (request, reply) => {
    return { hello: fastify.example };
  });

  fastify.post("/activate", async (req, res) => {
    try {
      return req.user.db || await fastify.platformatic.entities.user.save({
        input: {
          email: req.user.identity.email,
          provider: req.user.identity.provider,
          providerId: req.user.identity.providerId,
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

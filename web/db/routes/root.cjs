"use strict";
const { randomUUID } = require("crypto");
/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function (fastify, opts) {
  fastify.get("/example", async (request, reply) => {
    return { greetings: fastify.example };
  });

  fastify.post("/activate", async (req, res) => {
    return (
      req.user.db ||
      (await fastify.platformatic.entities.user.save({
        input: {
          email: req.user.identity.email,
          provider: req.user.identity.provider,
          providerId: req.user.identity.providerId,
          tenantId: randomUUID(),
          userId: randomUUID(),
        },
        ctx: req.platformaticContext,
      }))
    );
  });
};

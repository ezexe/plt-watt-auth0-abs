/// <reference path="../global.d.ts" />
"use strict";
/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function (fastify, opts) {
  const users = fastify.platformatic.entities.user;
  //
  const domain = opts.auth0.domain; // e.g. "my-tenant.us.auth0.com"
  const provider = opts.auth0.provider; // e.g. "auth0"
  const auth0Audience = opts.auth0.audience; // e.g. "https://my-tenant.us.auth0.com/api/v2/"
  //
  const domainUrl = new URL(`https://${domain}`).toString();
  const userInfoUrl = `${domainUrl}userinfo`;
  //
  const jwksUrl = `${domainUrl}.well-known/jwks.json`;
  const audience = [auth0Audience, userInfoUrl];
  await fastify.register(require("fastify-jwt-jwks"), { jwksUrl, audience });
  //
  fastify.addAuthStrategy({
    createSession: async (req, res) => {
      await fastify.authenticate(req, res);
      req.user.roles = ["user", ...req.user.permissions];
      //
      const identity = await auth0identity(
        req.headers["x-auth0-identity"]?.split(" ")[1], // auth0 identity token
        req.headers.authorization?.split(" ")[1] // auth0 access token
      );
      req.user.identity = identity;
      //
      const db =
        (
          await users.find({
            where: {
              provider: { eq: identity.provider },
              providerId: { eq: identity.providerId },
            },
          })
        )[0] ||
        (
          await users.find({
            where: { email: { eq: identity.email } },
          })
        )[0];
      req.user.db = db;
      req.user.userId = db?.userId;
      req.user.tenantId = db?.tenantId;
    },
  });
  //
  fastify.addHook("onRequest", async function (req, _) {
    try {
      if (req.headers.authorization) {
        await req.setupDBAuthorizationUser();
      }

      fastify.log.info({ user: req.user, method: req.method, url: req.url }, `onRequestHook`);
    } catch (e) {
      req.user = null;
      fastify.log.error(e, "onRequest error");
    }
  });

  async function auth0identity(identity, bearer) {
    const userInfo = identity ? fastify.jwt.decode(identity) : await auth0userInfo(bearer);
    return {
      ...userInfo,
      provider,
      providerId: userInfo.sub,
    };
  }

  async function auth0userInfo(accessToken) {
    const { body } = await require("undici").request(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return await body.json();
  }
};

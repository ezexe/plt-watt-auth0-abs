/// <reference path="../global.d.ts" />
"use strict";
/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function (fastify, opts) {
  // Assign the users entity to the users variable for easier access
  const users = fastify.platformatic.entities.user;

  // Auth0 configuration options from the platformatic.json file
  const domain = opts.auth0.domain; // e.g. "my-tenant.us.auth0.com"
  const provider = opts.auth0.provider; // e.g. "auth0"
  const auth0Audience = opts.auth0.audience; // e.g. "https://my-tenant.us.auth0.com/api/v2/"
  
  // Auth0 URLs for JWT and JWKS validation and user info retrieval 
  const domainUrl = new URL(`https://${domain}`).toString();
  const userInfoUrl = `${domainUrl}userinfo`;

  // Auth0 JWT and JWKS validation options
  const jwksUrl = `${domainUrl}.well-known/jwks.json`;
  const audience = [auth0Audience, userInfoUrl];

  // Register the fastify-jwt-jwks plugin with the Auth0 configuration options
  await fastify.register(require("fastify-jwt-jwks"), { jwksUrl, audience });

  // Add the Auth0 identity and user info as part of the session creation
  fastify.addAuthStrategy({
    createSession: async (req, res) => {
      // Authenticate the request and get the user roles from auth0 permissions array
      await fastify.authenticate(req, res);
      req.user.roles = ["user", ...req.user.permissions];
      
      // Get the Auth0 identity and user info
      const identity = await auth0identity(
        req.headers["x-auth0-identity"]?.split(" ")[1], // auth0 identity token
        req.headers.authorization?.split(" ")[1] // auth0 access token
      );
      req.user.identity = identity;
      
      // Get the user from the database using the provider and providerId or email set them in the request
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
  
  // Add the onRequest hook to log the user, method, and URL and setup the DB authorization user 
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

  // Add the auth0identity and auth0userInfo functions to get the user identity and user info
  async function auth0identity(identity, bearer) {
    const userInfo = identity ? fastify.jwt.decode(identity) : await auth0userInfo(bearer);
    return {
      ...userInfo,
      provider,
      providerId: userInfo.sub,
    };
  }

  // Get the user info from the Auth0 user info endpoint
  async function auth0userInfo(accessToken) {
    const { body } = await require("undici").request(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return await body.json();
  }
};

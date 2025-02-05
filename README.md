# plt-watt-auth0-abs
a simple application backend service with a platformatic watt project and a platformatic db service using auth0.com authorization based on the fastify-auth0-verify package.
changhed to fastify-jwt-jwks since fastify-auth0-verify is built ontop og it and now seems llike there might be a need to fully turn this into an @platformatic/auth0 package being that neither of them have updated there deprecated packages for a long time and it looks seemes as though the fastify-auth0 isntr really doing anything special in regards to the capabilities of fastify-jwt-jwk and can easily me transformed into a way simpler @platformatic/auth0 package for the current platformatic convension

... feat im thinking extracting there validation minus there deperecated packages
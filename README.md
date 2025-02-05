# plt-watt-auth0-abs

Hey there! 👋 This is a simple yet powerful application backend service that brings together Platformatic and WATT project packages, with Auth0 authorization baked in. 

## The Story So Far...

This project started life using the `fastify-auth0-verify` package, but I later switched to `fastify-jwt-jwks` when I realized `fastify-auth0-verify` was basically just sitting on top of it without adding any special sauce. 

Now here's where it gets interesting (or should I say, saucy 🍝) - both these packages haven't updated their deprecated dependencies in what feels like forever, and the codebase is starting to resemble my mom's spaghetti. You know what I'm talking about - tangled, messy, and while still technically edible, probably not what you want to serve at your next dinner party.

## The Light at the End of the Tunnel

Here's the good news: this mess could actually help other developers! Instead of wrestling with outdated packages, I can probably just use `@fastify/jwt` and rebuild these plugins properly as a shiny new `@platformatic/auth0` package. The current Platformatic convention has zoomed way past these older packages like a Ferrari passing a pasta truck.

As a neat little bonus feature, I'm planning to:
1. Give `fastify-jwt-jwks` some love by upgrading it to work without those pesky deprecated packages
2. Add the ability to configure all the programmatic settings right from your `platformatic.json` db config file (because who doesn't love configuration in one place?)

## Quick Start 🚀

### Prerequisites
- Node.js (the newer the better!)
- An Auth0 account (they have a free tier, woo!)
- Coffee ☕ (optional but recommended)

### Setup

1. Clone this bad boy:
```bash
git clone https://github.com/your-username/plt-watt-auth0-abs.git
cd plt-watt-auth0-abs
```

2. Install the goods:
```bash
npm install
```

3. Copy the environment template (it's like copying your friend's homework, but legal):
```bash
cp .env.sample .env
```

### Configuration 🔧

Fill out your `.env` file with these goodies:
```env
PORT=3654                         # Where the magic happens
PLT_DB_TYPESCRIPT=false           # TypeScript: on/off
PLT_DB_DATABASE_URL=sqlite://./db.sqlite    # Where we store the goods
PLT_DB_APPLY_MIGRATIONS=true      # Let it flow
AUTH0_DOMAIN=your-domain          # From your Auth0 dashboard
AUTH0_API_AUDIENCE=your-audience  # Your Auth0 app's identifier
```

### Fire It Up 🔥

Development mode (with hot reload, because we're not savages):
```bash
npm run dev
```

Production mode (when you're ready for the big leagues):
```bash
npm run build
npm start
```

## Features That'll Make Your Day

- 🔐 Auth0 integration that actually works
- 📚 GraphQL and OpenAPI support (because options are good)
- 🗄️ SQLite database with migrations (keeping it simple)
- 🔑 Role-based authorization (you know, for security and stuff)
- 🚀 Auto-generated TypeScript types (because who likes writing those?)
- ⚡ Hot reload (save file, see changes, feel like a wizard)

## API Goodies

Once you're up and running, check out:
- GraphQL Playground: `http://localhost:3654/graphql`
- OpenAPI docs: `http://localhost:3654/documentation`

## The Future is Bright ✨

We're working on turning this into a proper `@platformatic/auth0` package because:
1. The current solutions are getting stale
2. Platformatic deserves better
3. Nobody likes deprecated dependencies
4. Configuration should be easy
5. Developers deserve nice things

## Want to Help?

Got ideas? Found a bug? Want to make this less like mom's spaghetti and more like a fine Italian restaurant? Contributions are super welcome! Let's make Auth0 + Platformatic integration as smooth as properly cooked al dente pasta. 🍝

## License

MIT (because sharing is caring)

---

**Note**: This project is like a good sauce - it keeps getting better with time. Stay tuned for updates as I work on making this the go-to solution for Auth0 + Platformatic integration! 🚀

# Opentok Example

This app runs a fastify server that creates a session and generates token for the client and the client connects to publish/subscribe to the streams

## Installation

- Reaname .env.EXAMPLE to .env and add your API_KEY and SECRET from OpenTok there

```sh
cd server
yarn install
yarn dev
```
- Go to `http://localhost:3000/` and see the app in action


## Consideration

Remember to close the connection on the bottom button to avoid unnecessary charges.
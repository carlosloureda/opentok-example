// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
})
require('dotenv').config()


const path = require('path')

console.log("__dirname: ", __dirname);
fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '../client'),
    // prefix: '../client/', // optional: default '/'
})

// Declare a route
fastify.get('/', function (request, reply) {
    // reply.send({ hello: 'world' })
    reply.sendFile('index.html')
})


const OpenTok = require('opentok');
const opentok = new OpenTok(process.env.TB_API_KEY, process.env.TB_SECRET);

let session = null;
opentok.createSession(function (err, _session) {
    if (err) return console.log(err);
    session = _session;
});

// Declare a route
fastify.get('/generate-token', function (request, reply) {

    // Generate a Token from just a sessionId (fetched from a database)
    token = opentok.generateToken(session.sessionId);

    // Generate a Token from a session object (returned from createSession)
    token = session.generateToken();

    // Set some options in a Token
    token = session.generateToken({
        role: 'moderator',
        expireTime: (new Date().getTime() / 1000) + (7 * 24 * 60 * 60), // in one week
        data: 'name=Johnny',
        initialLayoutClassList: ['focus']
    });

    reply.send({ token: token, sessionId: session.sessionId, apiKey: process.env.TB_API_KEY })
})


// Run the server!
fastify.listen(3000, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})
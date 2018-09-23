// listen to consul agent on local
const consul = require('consul')({
    host: '127.0.0.1',
    port: '8500',
});

const fastify = require('fastify')({
    logger: true
});

let JWT_SECRET = '';
fastify.register(require('fastify-jwt'), {
    secret: () => {
        return JWT_SECRET;
    }
});

const Redis = require('ioredis');
const amqp = require('amqplib');
const ProfileStorage = require('./lib/profile/storage');

// consul agent for hot-reloading features based on configuration
const agent = consul.watch({
    method: consul.kv.get,
    options: {
        key: 'lunamals/config/federation.json'
    }
});

agent.on('change', async (data) => {
    const config = JSON.parse(data);
    const cache = new Redis(config.redis);
    const events = amqp.connect(config.amqp);

    JWT_SECRET = config.jwt.secret;

    // storage stuff
    fastify.decorateRequest('$cache', cache);
    fastify.decorateRequest('$storage', {
        users: new ProfileStorage(config.storage),
    });
    fastify.decorateRequest('$amqp', events);
});

// add other routes
require('./server/routes').forEach(route => fastify.route(route));

fastify.listen(8300, (err, address) => {
    if (err) throw err;
    fastify.log.info(`server listening on ${address}`);
});

// listen to consul agent on local
const consul = require('consul')({
    host: '127.0.0.1',
    port: '8500',
});

const fastify = require('fastify')({
    logger: true
});
const Redis = require('ioredis');
const amqp = require('amqplib');
const ProfileStorage = require('./lib/profile/storage');
const jwt = require('jsonwebtoken');

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

    // storage stuff
    fastify.decorateRequest('$cache', cache);
    fastify.decorateRequest('$storage', {
        users: new ProfileStorage(config.storage),
    });
    fastify.decorateRequest('$amqp', events);
    fastify.decorateRequest('$jwt', {
        sign(payload) {
            return jwt.sign(payload, config.jwt.secret);
        },
        verify(payload) {
            return jwt.verify(payload, config.jwt.secret);
        } 
    });
});

// add other routes
require('./server/routes').forEach(route => fastify.route(route));

fastify.listen(8300, (err, address) => {
    if (err) throw err;
    fastify.log.info(`server listening on ${address}`);
});

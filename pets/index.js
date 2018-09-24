// listen to consul agent on local
const consul = require('consul')();
const fastify = require('fastify')({
    logger: true
});
const jwt = require('jsonwebtoken');
const PetsStorage = require('./server/storage/couch');

// consul agent for hot-reloading features based on configuration
const agent = consul.watch({
    method: consul.kv.get,
    options: {
        key: 'lunamals/config/pets.json'
    }
});

let maintenanceMode = true;

fastify.decorate('storage', {
    pets: new PetsStorage(),
});

agent.on('change', (data, res) => {
    if (data === undefined) {
        fastify.log("could not read consul config");
        return;
    }
    const config = JSON.parse(data.Value);
    
    maintenanceMode = config.maintenance || false;

    fastify.storage.pets.deconstruct();
    fastify.storage.pets.init(config);
    // storage stuff
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
require('./server/routes').forEach(routes => routes(fastify));

fastify.register((fastify, opts, nextPlugin) => {
    fastify.decorate('maintenance', () => maintenanceMode );
    fastify.addHook('onRequest', (req, res, next) => {
        if (fastify.maintenance) {
            next(new Error("Service is in maintenance"));
        } else {
            next();
        }
    });
    nextPlugin();
})

fastify.listen(8300, (err, address) => {
    if (err) throw err;
    fastify.log.info(`server listening on ${address}`);
    // register self in consul
    consul.agent.service.register({
        name: 'pets',
        port: 8300
    }, (err) => {
        if (err) throw err;
    });
});

module.exports = [
    require('./pet'),
    // health check endpoint
    (fastify, options) => {
        fastify.get('/health', async () => 1);
    }
]

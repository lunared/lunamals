const { AuthRequired } = require('@lunamals/common').jwt; 

module.exports = async (fastify, options) => {
    const database = fastify.storage.pets;
    
    fastify.route({
        method: 'GET',
        path: '/pets/:pet',
        async handler(request, reply) {
            return await database.fetchPet(request.params.pet);
        }
    })

    fastify.route({
        method: 'GET',
        path: '/pets',
        async handler(request, reply) {
            return await database.queryPets(request.query);
        }
    })
};

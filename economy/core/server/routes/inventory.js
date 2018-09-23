module.exports = {
    path: '/inventory',
    method: 'GET',
    async handler(req, reply) {
        const { jwt: { id } } = req;
        const items = await req.$storage.inventory.fetchAll(id);
        return items;
    }
}
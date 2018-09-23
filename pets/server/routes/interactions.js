// interact with a pet with items in your inventory
const PlayWithPet = {
    method: 'POST',
    path: '/pets/:pet/interact',
    schema: {
        body: [
            { type: 'string', name: 'item_id' },

        ]
    },
    beforeHandler: [

    ],
    async handler(req, res) {
        req.$storage
    }
}

module.exports = [
    PlayWithPet,

]
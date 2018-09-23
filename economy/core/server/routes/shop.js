const { IsNPC } = require("@lunamals/common");

/**
 * Shop API for NPC and Users
 */

const GetShop = {
    path: '/shop/:owner',
    method: 'GET',
    async handler(req, reply) {
        const { $storage, params: { owner } } = req;

        const items = await $storage.shop.fetchItems(owner);
        
        return items;
    }
}

const PurchaseItem = {
    path: '/shop/:owner',
    method: 'POST',
    schema: {
        body: [
            { type: 'string', name: 'transactionId' },
            { type: 'string', name: 'productId' },
            { type: 'string', name: 'exchange' },
            { type: 'number', name: 'offer' },
        ]
    },
    async handler(req, reply) {
        const { jwt: { id: userId }, $storage, params: { owner }, body } = req;
        if (IsNPC(owner)) {
            const acceptable = await $storage.transaction.isOfferAcceptable(owner, body);
            if (acceptable) {
                $storage.writeTransaction({
                    id: body.transactionId,
                    fromUser: owner,
                    toUser: userId,
                    exchangePrice: body.offer,
                    exchangeCurrency: body
                })
            } else {
                reply.code(406);
            }
        } else {
            const product = $storage.shop.getItemForSale(owner, body.productId);
            $storage.transaction.writeTransaction({
                id: body.transactionId,
                fromUser: owner,
                toUser: userId,
                exchange: {
                    src: {
                        productId: body.productId
                    },
                    dest: {
                        productId: product.exchangeCurrency,
                        amount: product.exchangePrice,
                    }
                }
            })
        }
    }
}

module.exports = [
    GetShop,
    PurchaseItem
]
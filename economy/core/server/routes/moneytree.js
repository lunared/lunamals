/**
 * Specific path for the moneytree npc so that the user may provide items
 * to it for others to pick up.
 */
const Donate = {
    path: `/shop/npc_moneytree/donate`,
    method: 'POST',
    schema: {
        body: [
            { type: 'string', name: 'productId', },
            { type: 'int', name: 'amount', default: '1' },
        ],
    },
    async handler(req, reply) {
        const { jwt: { id }, body, $storage } = req;
        
        await $storage.transaction.create({
            fromUser: `user_${id}`,
            toUser: 'npc_moneytree',
            exchange: {
                src: {
                    productId: body.productId,
                    amount: body.amount,
                },
                dest: {
                    productId: body.productId,
                    amount: body.amount,
                }
            }
        });

        return {};
    }
}

/**
 * Claim a donation for free from the moneytree npc shop
 */
const ClaimDonation = {
    path: `/shop/npc_moneytree`,
    method: 'POST',
    schema: {
        body: [
            { type: 'string', name: 'saleId', },
        ],
    },
    async handler(req, reply) {
        const { jwt: { id }, body, $storage, $config, $limits } = req;

        const timeLeftLimit = await $limits.check({
            limit: 'moneytree',
            user: id,
        });

        if (timeLeftLimit) {
            reply.code(403);
            return {
                err: 'Limit locked',
                timeleft: timeLeftLimit,
            };
        }
        
        await $storage.transaction.create({
            fromUser: `user_${id}`,
            toUser: 'npc_moneytree',
            exchange: {
                src: {
                    productId: body.productId,
                    amount: body.amount,
                },
                dest: {
                    productId: 'free-claim',
                    amount: 1,
                }
            }
        });

        // only allow users to successfully pick something from the money tree
        // default is a 5 minute pause period from now
        await $limits.create({
            limit: 'moneytree',
            user: id,
            expire: Date.now() + $config.limits.moneytree || 1000 * 60 * 5,
        });

        return {};
    }
}
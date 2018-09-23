const TransactionSchema = {
    id: 'UUID',
    fromUser: '(user|npc):UUID',
    toUser: '(user|npc):UUID',
    exchange: {
        src: [
            {
                productId: 'UUID',
                amount: 'UUID',  // only to be used by currency products
            },
        ],
        dest: [
            {
                productId: 'UUID',
                amount: 'UUID',
            },
        ]
    },
    createdAt: 'datetime',
    updatedAt: 'datetime',
    state: '(COMMITTED|PENDING|CANCELED)'
};
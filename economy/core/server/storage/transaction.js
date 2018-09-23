class TransactionStorage {
    constructor(pg, redis, inventoryService) {

    }

    async create({user, }) {
        const canAdd = await this.inventoryService.IsInventoryFull()

        // create transaction
        // remove items from src, add to dest
        // remove items from dest, add to src
        // close action
    }
}
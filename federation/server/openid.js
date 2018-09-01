/**
 * Resolves a user by their id
 * @param {} ctx 
 * @param {*} id 
 */
async function findById($cache, $storage) {
    return (ctx, id) => {
        return {
            accountId: id,
            async claims() { 
                return {
                    sub: id,
                };
            }
        };
    }
}

module.exports = findById;

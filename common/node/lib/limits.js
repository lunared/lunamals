/**
 * Store limits within redis to balance actions.
 * 
 * A necessary component for managing activities you can only do once or a few times a day
 */

class Limiter {
    constructor(redis) {
        this.redis = redis;
    }

    /**
     * Creates a new limit
     * @param {*} options
     */
    async create({limit, user, expire=60*60*1000}) {
        await this.redis.pipeline()
            .set(`limit:${limit}:${user}`, true)
            .expireAt(`limit:${limit}:${user}`, expire)
            .exec();
        return true;
    }

    /**
     * Check if the user is currently limited
     * @param {*} options
     * @returns long - time left on the limit
     */
    async check({limit, user}) {
        let timeLeft = await this.redis.ttl(`limit:${limit}:${user}`);
        return timeLeft;
    }
}
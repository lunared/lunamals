const { jwt: { UserFromToken } } = require('@lunamals/common');

/**
 * Get more details about the logged in user
 */
const GetMyProfile = {
    method: 'GET',
    path: '/profile/me',
    beforeHandlers: [
        UserFromToken,
    ],
    async handler(req, res) {
        const { user } = req;
        const { $cache, $storage } = req;
        try {
            let result = await $cache.get(`lm:user:${user.id}`);
            if (result === null) {
                result = await $storage.getProfile(user.id);
                await $cache.put(`lm:user:${user.id}`, JSON.stringify(result));
            }
            return result;
        } catch (err) {
            // User does not exist in storage
            if (err === NotFoundException) {
                res.code(404);
            } else {
                throw err;
            }
        }
    },
};

/**
 * Get more details about a user
 */
const GetProfile = {
    method: 'GET',
    path: '/profile/:user',
    beforeHandlers: [
        UserFromToken,
    ],
    async handler(req, req) {
        const { params: { user }, $cache, $storage } = req;
        try {
            let result = await $cache.get(`lm:user:${user}`);
            if (result === null) {
                result = await $storage.getProfile(user);
                await $cache.put(`lm:user:${user}`, JSON.stringify(result));
            }
            // TODO get a stripped down version of the profile, hiding private information
            return {
                ...result,
            };
        } catch (err) {
            // User does not exist in storage
            if (err === NotFoundException) {
                res.code(404);
            } else {
                throw err;
            }
        }
    },
};

module.exports = [
    GetProfile,
    GetMyProfile,
];

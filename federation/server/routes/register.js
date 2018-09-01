/**
 * Create a new user profile
 */
const RegisterUser = {
    method: 'POST',
    path: '/register',
    schema: {
        body: {

        },
    },
    async handler(req) {
        const { body, $storage, $amqp } = req;

        let profile = {
            ...body,
        };

        const user = await $storage.users.create(profile);
        await $amqp.publish('lunamals.user-activity', 'registered', JSON.stringify(profile));

        const payload = {
            id: user.id,
            username: user.username,
            permissions: [

            ]
        }
        return {
            token: $jwt.sign(payload),
        }
    },
};

const LoginUser = {
    method: 'POST',
    path: '/login',
    schema: {
        body: {

        }
    },
    async handler(req, res) {
        const { body, $storage, $amqp, $jwt } = req;

        const user = await $storage.users.fetchOne({
            username: body.username,
            password: body.password,
        })
        if (user === null) {
            res.code(404);
            return;
        }

        const payload = {
            id: user.id,
            username: user.username,
            permissions: [

            ]
        }
        return {
            token: $jwt.sign(payload),
        }
    }
}

module.exports = [
    RegisterUser,
    LoginUser,
];

const amqp = require('amqplib');

/**
 * Register user into discourse using openID
 */
(async () => {
    const connection = await amqp.connect();
    const channel = connection.createChannel();
    const queue = channel.assertQueue('communication-newuser');
    channel.consume(queue, (msg) => {
        const profile = JSON.parse(msg);
        // TODO register user into discourse using openID
    });
})();

#!/usr/bin env node
const amqp = require('amqplib/callback_api');

//consumer establishing connection to msgBroker
amqp.connect('amqp://localhost', (err, connection) => {
    if(err) {
        console.log('Error while connection to msgBroker', err);
        throw err;
    }

    connection.createChannel((err, channel) => {
        if(err) {
            console.log('Error while creating channel', err);
            throw err;
        }

        let queue = 'hello';

        /* creating queue for consumer as well because we might start consumer before the publisher,
            and queue must exist before we consume msg from it.
        */
        channel.assertQueue(queue, {
            durable: false
        })

        channel.consume(queue, function (msg) {
            console.log('message received from queue : %s', msg.content.toString());
        }, {
            noAck : true
        })
    })
})
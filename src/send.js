#!/usr/bin env node
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, connection) {
    if(err) {
        console.log('Error while connection to msgBroker', err);
        throw err;
    }

    connection.createChannel(function (err, channel) {
        if(err) {
            console.log('Error while creating channel', err);
            throw err;
        }

        let queue = 'hello';
        let msg = 'this is message1 from publisher'
        
        //queue hello will be created only if it doesn't exist before
        channel.assertQueue(queue, {
            durable: false
        })

        //sending msg to Queue
        channel.sendToQueue(queue, Buffer.from(msg))
        console.log('message %s sent to queue', msg);

        //closing the connection after 5secs
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 5000)
    });
})
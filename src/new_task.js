//#!/usr/bin env node
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

        //rabbitMQ doesn't allow you to redefine an existing queue with different parameters and will return an error to any program that tries to do that.
        // eg queue hello in first example was n't durable and fail if used with durable set to true;

        let queue = 'task_queue';
        
        //taking args from command line , if no arg passe dby default take "Hello World"
        let msg = process.argv.slice(2).join(' ') || "Hello World";

        //queue hello will be created only if it doesn't exist before
        channel.assertQueue(queue, {
            durable: true
        })

        //sending msg to Queue
        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        })
        console.log('message %s sent to queue', msg);

        //closing the connection after 5secs
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 5000)
    });
})
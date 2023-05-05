//#!/usr/bin env node
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

        let queue = 'task_queue';

        /* creating queue for consumer as well because we might start consumer before the publisher,
            and queue must exist before we consume msg from it.
        */
        channel.assertQueue(queue, {
            durable: true
        })

        //tells RabbitMQ not to give more than one message to a worker/consumer at a time
        channel.prefetch(3);
        console.log('Waiting for messages ........');

        //noAck : noAck set to false, application would have to manually (ack) the msg has been received, processed and rabbitmq is free to delete it.
        //if consumer dies, without ack, rabbitMQ will re-queue it

        channel.consume(queue, function (msg) {
            //if msg is hello..., so we will run the task for (no of dots) secs, just to simulate the load
            let secs = msg.content.toString().split('.').length - 1;
            console.log('message received from queue : %s', msg.content.toString());

            setTimeout(()=>{
                console.log('[x] Done');
                channel.ack(msg);
            }, secs*2000)
        }, {
            noAck : false
        })
    })
})
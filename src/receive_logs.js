const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
    if(err) {
        console.log('Error while connecting to msgBroker', err);
        throw err;
    }

    connection.createChannel((err, channel) => {
        if(err) {
            console.log('Error creating channel', err);
            throw err;
        }

        var exchange = 'logs';

        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        //when we supply queue name as an empty string, we create a non-durable queue with a randome generated name
        //exclusive flag ensure only one consumer at a time consumes from the queue
        channel.assertQueue('', {
            exclusive: true
        }, (err, q) => {
            if(err) {
                console.log('Error while establishing connection between exchange and queue', err);
                throw err;
            }

            console.log('Waiting for messages in queue %s', q.queue);
            //relationship between exchange and a queue is called a binding, need to tell the exchange to send messages to our queue
            channel.bindQueue(q.queue, exchange, '');

            //consuming msg from queue
            channel.consume(q.queue, (msg) => {
                console.log('msg received in consumer : %s', msg.content.toString());
            }, {
                noAck: true
            });

        });
    })
})
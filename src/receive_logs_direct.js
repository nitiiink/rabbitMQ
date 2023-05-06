const amqp = require('amqplib/callback_api');

//takes args for [info], [debug], [error] while starting server
var args = process.argv.slice(2);
if (args.length == 0) {
    console.log('No args found, set arg to [info], [debug] , [error] while starting the server $$ exiting process ....');
    process.exit(1);
}

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

        var exchange = 'direct_logs';

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });

        
        channel.assertQueue('', {
            exclusive: true
        }, (err, q) => {
            if(err) {
                console.log('Error while establishing connection between exchange and queue', err);
                throw err;
            }

            console.log('Waiting for messages in queue %s', q.queue);
            
            //relationship between exchange and a queue is called a binding, need to tell the exchange to send messages to our queue
            //create a new binding for each severity we're interested in.
            //a message goes to the queues whose binding key exactly matches the routing key of the message.
            args.forEach((severity) => {
                channel.bindQueue(q.queue, exchange, severity);
            });

            //consuming msg from queue
            channel.consume(q.queue, (msg) => {
                console.log('msg received in consumer : %s', msg.content.toString());
            }, {
                noAck: true
            });

        });
    })
})
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
    if(err) {
        console.log('Error while connecting to msgBroker', err);
        throw err;
    }

    connection.createChannel((err, channel) => {
        if(err) {
            console.log('Error while creating channel', err);
            throw err;
        }

        /*
        process.argv : [
                        '/Users/nitink/.nvm/versions/node/v16.14.2/bin/node',
                        '/Users/nitink/Documents/rabbit_mq/src/emit_logs_direct.js',
                        'error',
                        'hello',
                        'world',
                        '123',
                        '456'
                    ]
        */
        var exchange = 'direct_logs';
        var args = process.argv.slice(2);
        var msg = args.slice(1).join('') ||  'Hello World';

        //severity is the routingKey here.
        //a message goes to the queues whose binding key exactly matches the routing key of the message.
        var severity = args.length > 0 ? args[0] : 'info';

        //direct exchange
        channel.assertExchange(exchange, 'direct', {
            durable : false
        });
        
        channel.publish(exchange, severity, Buffer.from(msg));
        console.log(`msg sent from publisher : %s having severity => %s`, msg, severity);

        setTimeout(() => {
            console.log('terminating connection ...');
            connection.close();
            process.exit(0);
        }, 5000)
    })
})
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

        var exchange = 'logs';
        var msg = process.argv.slice(2).join('') || "Hello World";

        // it just broadcasts all the messages it receives to all the queues it knows (fanout exchange)
        channel.assertExchange(exchange, 'fanout', {
            durable : false
        });
        
        //routingKey not reqd , as it's a fanout exchange
        channel.publish(exchange, '', Buffer.from(msg));
        console.log(`msg sent from publisher : %s`, msg);

        setTimeout(() => {
            console.log('terminating connection ...');
            connection.close();
            process.exit(0);
        }, 5000)
    })
})
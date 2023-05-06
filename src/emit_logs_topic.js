const amqp = require('amqplib/callback_api');

//topic exchange
// * : can substitue for exactly one word
// # : can substitute for zero or more words
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

        var exchange = 'topic_logs_';
        var args = process.argv.slice(2);
        var msg = args.slice(1).join('') ||  'Hello World';
        var key = args.length > 0 ? args[0] : 'anonymouse.info';

        //topic exchange
        channel.assertExchange(exchange, 'topic', {
            durable : false
        });
        
        channel.publish(exchange, key, Buffer.from(msg));
        console.log(`msg sent from publisher : %s having key => %s`, msg, key);

        setTimeout(() => {
            console.log('terminating connection ...');
            connection.close();
            process.exit(0);
        }, 5000)
    })
})
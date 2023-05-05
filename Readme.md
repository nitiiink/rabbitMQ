
# RabbitMq

Node.js code for RabbitMQ tutorials

### Requirements
- amqp client library : `npm i amqplib`
- nodejs

### Code
- #### Hello World
    - node src/send.js (acts as publisher)
    - node src/receive.js (acts as consumer)

- #### Work Queue (distribute time-consuming tasks among multiple workers)
    - node src/new_task.js
    - node src/receive.js

- #### Publisher/Subscriber (deliver msg to multiple consumers)
    - node src/emit_logs.js
    - node src/receive_logs.js
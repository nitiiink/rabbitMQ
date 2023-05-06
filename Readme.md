
# RabbitMq

Node.js code for RabbitMQ tutorials

### Requirements
- amqp client library : `npm i amqplib`
- nodejs

### Code
- #### Hello World
    - node src/send.js (acts as publisher)
    - node src/receive.js (acts as consumer)

- #### Work Queue 
  - (distribute time-consuming tasks among multiple workers)
      - node src/new_task.js Hello... 
      - node src/worker.js (here dot(.) from publisher represents the no of sec to process the task in consumer) (consumer 1)
      - node src/worker.js (consumer 2)
- #### Publisher/Subscriber (deliver msg to multiple consumers)
  - multiple consumer subscribing to the msg from publisher using fanout exchange
      - node src/emit_logs.js
      - node src/receive_logs.js (consumer 1)
      - node src/receive_logs.js (consumer 2)

- #### Routing
  - used direct exchange and routingKey to send msg to queue
    - node src/emit_logs_direct.js error server crashed 404 (routingKey set to error here )
    - node src/receive_logs_direct.js error (will listen to error logs)

- #### Topic
  - queue bound with '#' will behave as f   anout exchange
  - queue without '*' or '#' will behave as direct exchange
    - node src/emit_logs_topic.js "kern.critical" 
    - node src/receive_logs_topic.js "kern.*" (will consume msg like kern.critical, kern.orange, but not kern.orange.abc)
    - node src/receive_logs_topic.js "kern.#" (it will consume all msg starting with Kernal) 
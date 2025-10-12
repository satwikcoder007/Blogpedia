import {Kafka} from 'kafkajs'

// this is a kafka client. It is a connection object to the kafka broker 
const kafka = new Kafka({
    clientId: 'blog-service',
    brokers: ['kafka:9092'] // assuming kafka is the service name in docker-compose
})

export default kafka

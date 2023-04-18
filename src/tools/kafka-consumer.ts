import { Kafka, logLevel } from 'kafkajs';

// Create a Kafka client instance
const kafka = new Kafka({
  brokers: ['localhost:9092'], // Specify the Kafka broker's host and port
  logLevel: logLevel.ERROR, // Specify the log level (optional)
});

// Create a Kafka producer instance
const producer = kafka.producer();

// Define an async function to send messages to Kafka
async function sendMessage(topic: string, messages: string[]) {
  await producer.connect();
  await producer.send({
    topic,
    messages: messages.map((message) => ({ value: message })),
  });
  await producer.disconnect();
}

// Create a Kafka consumer instance
let consumer = kafka.consumer({
  groupId: 'my-group-4', // Specify a consumer group ID
});


// Define an async function to consume messages from Kafka
async function consumeMessages() {
    await consumer.connect();
    
    await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message: msg }) => {
        console.log(`Received message: ${msg.value} at partition ${partition} of topic ${topic}`);
      },
    });
  }
  

// Call the sendMessage function to send messages to Kafka
// sendMessage('my-topic', ['Hello Kafka!', 'How are you?', 'Goodbye Kafka!']);

// Call the consumeMessages function to consume messages from Kafka
consumeMessages();

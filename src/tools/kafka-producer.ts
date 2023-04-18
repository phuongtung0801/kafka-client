import { Kafka, logLevel } from 'kafkajs';

// Create a Kafka client instance
const kafka = new Kafka({
  brokers: ['localhost:9092'], // Specify the Kafka broker's host and port
  logLevel: logLevel.ERROR, // Specify the log level (optional)
});

// Create a Kafka producer instance
const producer = kafka.producer();


const partition = 100

const topic = 'my-topic';

async function run() {
  await producer.connect();

  const messages = [
    { value: 'Hello, Kafka! 1' },
    { value: 'Hello, Kafka! 2' },
    { value: 'Hello, Kafka! 3' },
  ];

  // Produce messages to multiple partitions
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const partition = i % 3; // assuming 3 partitions
    await producer.send({
      topic,
      messages: [message],
      acks: -1,
      timeout: 3000,
      compression: 0,
    });
  }

  await producer.disconnect();
}

// run().catch(console.error);
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

async function sendMessage(topic: string, payload: Array<{ key: string; value: string; }>) {
  await producer.connect();
  for (let index = 0; index < payload.length; index++) {
    const element = payload[index];
    const partition = Math.abs(hashCode(element.key)) % 10;
    console.log("partition is: ", partition)
    const kafkaMessages = [{
      key: element.key,
      value: element.value,
      partition: partition, // assuming 3 partitions
    }];
    try {
      await producer.send({
        topic,
        messages: kafkaMessages,
      });
    }
    catch (e) {
      console.log(e)
    }
   
  }
 

  await producer.disconnect();
}

// Call the sendMessage function to send messages to Kafka with different partitions
let counter = 0;
const intervalId = setInterval(() => {
  counter++;
  if (counter > 100) {
    clearInterval(intervalId);
    return;
  }

  sendMessage('my-topic', [
    { key: Date.now().toString(), value: 'Hello, Kafka! 1' },
    { key: Date.now().toString(), value: 'Hello, Kafka! 2' },
    { key: Date.now().toString(), value: 'Hello, Kafka! 3' },
    { key: Date.now().toString(), value: 'Hello, Kafka! 4' },
    { key: Date.now().toString(), value: 'Hello, Kafka! 5' },
    { key: Date.now().toString(), value: 'Hello, Kafka! 6' },
    { key: Date.now().toString(), value: 'Hello, Kafka! 7' }
  ]);
  console.log("Sending")
}, 2000);

// sendMessage('my-topic', [
//   { key: Date.now().toString(), value: 'Hello, Kafka! 1' },
//   { key: Date.now().toString(), value: 'Hello, Kafka! 2' },
//   { key: Date.now().toString(), value: 'Hello, Kafka! 3' },
//   { key: Date.now().toString(), value: 'Hello, Kafka! 4' },
//   { key: Date.now().toString(), value: 'Hello, Kafka! 5' },
//   { key: Date.now().toString(), value: 'Hello, Kafka! 6' },
//   { key: Date.now().toString(), value: 'Hello, Kafka! 7' }
// ]);
// sendMessage('my-topic', ['Hello Kafka! 2', 'How are you? 2', 'Goodbye Kafka! 2'], 1); 
// sendMessage('my-topic', ['Hello Kafka! 3', 'How are you? 3', 'Goodbye Kafka! 3'], 2);


// Define an async function to send messages to Kafka
// async function sendMessage(topic: string, messages: string[]) {
//   await producer.connect();
//   await producer.send({
//     topic,
//     messages: messages.map((message) => ({ value: message })),
//   });
//   await producer.disconnect();
// }

// Call the sendMessage function to send messages to Kafka
// sendMessage('my-topic', ['Hello Kafka!', 'How are you?', 'Goodbye Kafka!']);

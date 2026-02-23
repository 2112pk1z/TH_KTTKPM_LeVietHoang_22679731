const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://user:password@rabbitmq:5672";
const QUEUE = "task_processor_queue";
const DEAD_LETTER_QUEUE = "task_processor_dlq";

let channel;

async function connectWithRetry() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();

    await channel.assertQueue(DEAD_LETTER_QUEUE, { durable: true });
    await channel.assertQueue(QUEUE, {
      durable: true,
      deadLetterExchange: "",
      deadLetterRoutingKey: DEAD_LETTER_QUEUE,
    });

    console.log(" [*] Worker is waiting for tasks...");

    channel.consume(QUEUE, async (msg) => {
      if (!msg) return;
      const body = msg.content.toString();

      try {
        const data = JSON.parse(body);
        if (!data.task) {
          throw new Error("Missing task content");
        }

        console.log(` [v] Processing task: ${data.task} (Priority: ${data.priority})`);
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log(" [ok] Task Completed");
        channel.ack(msg);
      } catch (err) {
        console.error(" [!] Error detected, moving to DLQ:", err.message);
        channel.nack(msg, false, false);
      }
    }, { noAck: false });

  } catch (err) {
    console.log("Connection failed, retrying...");
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();
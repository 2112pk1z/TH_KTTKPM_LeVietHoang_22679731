const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

const RABBITMQ_URL = "amqp://user:password@rabbitmq:5672";
const QUEUE = "task_processor_queue";
const DEAD_LETTER_QUEUE = "task_processor_dlq";

let channel;

async function connectRabbitMQ() {
  while (true) {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      channel = await conn.createChannel();
      await channel.assertQueue(QUEUE, {
        durable: true,
        deadLetterExchange: "",
        deadLetterRoutingKey: DEAD_LETTER_QUEUE,
      });
      console.log("=== Task Producer Ready ===");
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

app.post("/publish-task", async (req, res) => {
  const { taskName, priority } = req.body;

  if (!taskName) {
    return res.status(400).json({ error: "taskName is mandatory" });
  }

  const data = {
    task: taskName,
    priority: priority || "normal",
    processedAt: new Date()
  };

  channel.sendToQueue(
      QUEUE,
      Buffer.from(JSON.stringify(data)),
      { persistent: true }
  );

  console.log(" [x] Dispatched:", data);

  res.json({ success: true, taskSent: data });
});

connectRabbitMQ();

app.listen(3000, () => {
  console.log("Task API running on port 3000");
});
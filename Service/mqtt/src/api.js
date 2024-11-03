const express = require("express");
const app = express();
const mqtt = require("mqtt");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
require("dotenv").config();

const port = process.env.SERVICE_PORT;

const config = {
  mqttHost: process.env.MQTT_HOST,
  mqttPort: process.env.MQTT_PORT,
  mqttUsername: process.env.MQTT_USERNAME,
  mqttPassword: process.env.MQTT_PASSWORD,
};

let client;
(async () => {
  try {
    client = await mqtt.connectAsync(
      `mqtt://${config.mqttHost}:${config.mqttPort}`,
      {
        username: config.mqttUsername,
        password: config.mqttPassword,
        clientId: "mqtt-service",
        clean: false,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
      }
    );
    console.log("Connected to MQTT broker");

    // Subscribe to topics
    client.subscribe("#", (err) => {
      if (err) {
        console.error("Failed to subscribe to topics:", err);
      } else {
        console.log("Subscribed to all topics");
      }
    });

    client.on("message", (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
    });
  } catch (error) {
    console.error("Failed to connect to MQTT broker:", error);
  }
})();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(logger("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/publish", async (req, res) => {
  const { topic, message, responseTopic, timeout } = req.body; // Added timeout parameter
  const body = req.body;
  // if (!topic || !message || !responseTopic) {
  //   return res
  //     .status(400)
  //     .send("Topic, message, and response topic are required");
  // }
  console.log(body.responseTopic);
  try {
    if (client) {
      // Create a unique correlation ID
      const correlationId = Date.now().toString();

      // Set a default timeout if not provided
      const waitTime = timeout || 10000; // Default to 5 seconds

      // Subscribe to the response topic to listen for replies
      client.subscribe(responseTopic, (err) => {
        if (err) {
          return res
            .status(500)
            .send(`Failed to subscribe to response topic: ${err.message}`);
        }

        // Timeout handler to clean up if no response arrives
        const timeoutHandle = setTimeout(() => {
          // Unsubscribe and remove listener on timeout
          client.unsubscribe(responseTopic);
          client.removeListener("message", messageHandler);
          return res.status(504).send("Response timed out");
        }, waitTime);

        // Handle the incoming message from the response topic
        const messageHandler = (receivedTopic, receivedMessage) => {
          if (receivedTopic === responseTopic) {
            clearTimeout(timeoutHandle); // Clear timeout if message arrives

            const msg = receivedMessage.toString();
            console.log(
              `Received response on topic "${receivedTopic}": ${msg}`
            );

            // Send the response back to the original requester
            res.status(200).send({
              success: true,
              message: `Response received: ${msg}`,
            });

            // Unsubscribe to clean up
            client.unsubscribe(responseTopic);
            client.removeListener("message", messageHandler); // Remove the listener
          }
        };

        // Listen for messages on the response topic
        client.on("message", messageHandler);

        // Publish the message to the topic
        client.publish(topic, message, { correlationId }, (err) => {
          if (err) {
            clearTimeout(timeoutHandle); // Clear timeout if publish fails
            client.unsubscribe(responseTopic); // Clean up if publish fails
            return res
              .status(500)
              .send(`Failed to publish message: ${err.message}`);
          }
        });
      });
    } else {
      res.status(500).send("MQTT client is not connected");
    }
  } catch (error) {
    res.status(500).send(`Error occurred: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`MQTT service is running on port ${port}`);
});

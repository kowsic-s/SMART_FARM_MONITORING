const mqtt = require("mqtt");
const EventEmitter = require("events");

const emitter = new EventEmitter();
const broker = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
const client = mqtt.connect(broker);

client.on("connect", () => {
  console.log("MQTT connected to", broker);
  client.subscribe("agri/+/+/telemetry", { qos: 1 });
  client.subscribe("agri/+/+/status", { qos: 1 });
});

client.on("message", (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    // emit for other modules
    emitter.emit("telemetry", topic, payload);
    // optionally persist to db by requiring pool here (or emit and let app persist)
    // You can expand to insert in Postgres
    console.log("MQTT message", topic, payload);
  } catch (err) {
    console.error("MQTT parse error", err);
  }
});

// expose helper publish
function publish(topic, payload = {}) {
  client.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
    if (err) console.error("publish err", err);
  });
}

emitter.publish = publish;
module.exports = emitter;

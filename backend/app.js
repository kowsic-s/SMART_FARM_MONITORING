const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mqttClient = require("./mqttClient");
const { Pool } = require("pg");
const { createServer } = require("http");
const { Server } = require("socket.io");
const commandRoute = require("./routes/command");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "postgres", // PostgreSQL username
  host: "localhost", // usually localhost
  database: "smartagri", // your database name
  password: "sprayer2025", // your password
  port: 5432, // default PostgreSQL port
  // ssl: { rejectUnauthorized: false } // only if connecting to a hosted DB like Heroku
});

app.locals.db = pool;

// REST: command endpoint
app.use("/api/command", commandRoute);

// simple health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// serve static if needed
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// forward MQTT messages to WebSocket clients
mqttClient.on("telemetry", (topic, payload) => {
  io.emit("telemetry", { topic, payload });
});

// basic websocket connection
io.on("connection", (socket) => {
  console.log("ws client connected", socket.id);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Backend listening on ${PORT}`));

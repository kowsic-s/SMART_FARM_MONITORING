const express = require("express");
const router = express.Router(); // <-- define router here
const mqttClient = require("../mqttClient");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {
  try {
    const { farmId, deviceId, command } = req.body;
    if (!farmId || !deviceId || !command)
      return res
        .status(400)
        .json({ error: "farmId, deviceId, command required" });

    const topic = `agri/${farmId}/${deviceId}/control`;
    const requestId = uuidv4();
    const payload = { ...command, requestId, ts: new Date().toISOString() };

    mqttClient.publish(topic, JSON.stringify(payload));

    // log to DB if available
    const pool = req.app.locals.db;
    if (pool) {
      try {
        await pool.query(
          "INSERT INTO commands (device_id, payload, ts) VALUES ($1,$2,$3)",
          [deviceId, JSON.stringify(payload), new Date()]
        );
      } catch (dbErr) {
        console.error("Failed to log command:", dbErr);
      }
    }

    return res.json({ ok: true, requestId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

module.exports = router;

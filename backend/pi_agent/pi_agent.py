"""
Simple Raspberry Pi agent that subscribes to control topic and toggles
a GPIO for spray pump. Run with: python3 pi_agent.py
"""
import paho.mqtt.client as mqtt
import json
import time
import os

# If running on Pi you can use RPi.GPIO or pigpio
try:
    import RPi.GPIO as GPIO
    HW = True
except Exception:
    HW = False
    print("RPi.GPIO not available, running in simulation mode")

BROKER = os.getenv("MQTT_BROKER", "localhost")
FARM_ID = os.getenv("FARM_ID", "farm-1")
DEVICE_ID = os.getenv("DEVICE_ID", "pi-001")
SPRAY_PIN = int(os.getenv("SPRAY_PIN", "18"))

# Initialize variables for both hardware and simulation modes
pwm_started = False
pwm = None

if HW:
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(SPRAY_PIN, GPIO.OUT)
    pwm = GPIO.PWM(SPRAY_PIN, 1000)

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT", rc)
    client.subscribe(f"agri/{FARM_ID}/{DEVICE_ID}/control")

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode())
    print("Control payload", payload)
    cmd = payload.get("cmd")
    if cmd == "spray":
        action = payload.get("action")
        rate = payload.get("rate", 100)
        if action == "start":
            if HW:
                global pwm_started
                pwm.start(rate)
                pwm_started = True
                print(f"Starting spray at rate {rate}")
            else:
                print("[SIM] start spray", rate)
        elif action == "stop":
            if HW and pwm_started:
                pwm.stop()
                pwm_started = False
                print("Stopped spray")
            else:
                print("[SIM] stop spray")
    # publish status back
    status = {"deviceId": DEVICE_ID, "status": "ok", "ts": time.time()}
    client.publish(f"agri/{FARM_ID}/{DEVICE_ID}/status", json.dumps(status), qos=1)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(BROKER, 1883, 60)
client.loop_forever()

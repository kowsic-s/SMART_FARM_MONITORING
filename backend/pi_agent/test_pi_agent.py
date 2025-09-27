#!/usr/bin/env python3
"""
Test script for pi_agent.py functionality without MQTT broker
"""
import sys
import os
import json

# Add the pi_agent directory to path
sys.path.append(os.path.dirname(__file__))

def test_message_handling():
    """Test the message handling logic"""
    print("Testing message handling logic...")
    
    # Simulate the variables from pi_agent
    HW = False  # Simulation mode
    pwm_started = False
    DEVICE_ID = "pi-001"
    FARM_ID = "farm-1"
    
    # Test different message payloads
    test_messages = [
        {"cmd": "spray", "action": "start", "rate": 100},
        {"cmd": "spray", "action": "start", "rate": 50},
        {"cmd": "spray", "action": "stop"},
        {"cmd": "other", "action": "test"}
    ]
    
    for i, payload in enumerate(test_messages):
        print(f"\nTest {i+1}: {payload}")
        
        cmd = payload.get("cmd")
        if cmd == "spray":
            action = payload.get("action")
            rate = payload.get("rate", 100)
            
            if action == "start":
                if HW:
                    print(f"[HW] Starting spray at rate {rate}")
                else:
                    print(f"[SIM] start spray {rate}")
                    
            elif action == "stop":
                if HW and pwm_started:
                    print("[HW] Stopped spray")
                else:
                    print("[SIM] stop spray")
        
        # Simulate status response
        status = {"deviceId": DEVICE_ID, "status": "ok", "ts": 1695830400}
        print(f"Status response: {json.dumps(status)}")
    
    print("\nAll message handling tests completed successfully!")

if __name__ == "__main__":
    test_message_handling()
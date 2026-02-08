import requests
import random
import time
import logging

import os

# Configuration
API_URL = os.getenv("API_URL", "http://localhost:8000/heart-rate")
API_KEY = os.getenv("API_KEY", "super-secret-key")
INTERVAL = int(os.getenv("INTERVAL", "5"))  # seconds

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def simulate_heart_rate():
    while True:
        try:
            # Generate random heart rate between 60 and 180
            heart_rate = random.randint(60, 180)
            
            payload = {
                "heart_rate": heart_rate
            }
            
            headers = {
                "X-API-Key": API_KEY
            }
            
            logging.info(f"Sending heart rate: {heart_rate} BPM")
            
            response = requests.post(API_URL, json=payload, headers=headers)
            
            if response.status_code == 201:
                data = response.json()
                logging.info(f"Successfully recorded: {data['heart_rate']} BPM (Status: {data['status']})")
            else:
                logging.error(f"Failed to send data. Status code: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            logging.error(f"An error occurred: {e}")
            
        time.sleep(INTERVAL)

if __name__ == "__main__":
    logging.info("Starting wearable simulator...")
    simulate_heart_rate()

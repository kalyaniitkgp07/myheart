# HeartSync: Wearable Heart Rate Monitoring System

HeartSync is a full-stack IoT-style application designed to monitor heart rate data in real-time. It features a simulated smartwatch, a modular FastAPI backend, a high-performance React dashboard, and a React Native mobile app.

---

## 1. Runtime Flow: Real-Time Data Journey

To demonstrate the system in action, follow this flow:

1.  **Start the Ecosystem**:
    Run `docker compose up --build`. This starts the PostgreSQL database, the FastAPI backend, the Web Dashboard, and the Simulator.
2.  **Generate Data (The Simulator)**:
    The [simulator/simulator.py](file:///Users/kalyansahoo/Projects/myheart/simulator/simulator.py) script acts as the "smartwatch," sending POST requests to the API every 5 seconds with random heart rates (60–180 BPM).
    *   *Observation*: You will see logs in the terminal: `Sending heart rate: 115 BPM... Successfully recorded.`
3.  **Verify Data Persistence (The Database)**:
    Check the database to see the records being created with their classified status (NORMAL/HIGH).
    *   *Command*: `docker exec -it $(docker ps -qf "name=db") psql -U user -d heartrate -c "SELECT * FROM heartraterecord ORDER BY timestamp DESC LIMIT 5;"`
4.  **Visualize Live (Web Dashboard)**:
    Open `http://localhost:3000`. The modular React dashboard polls the API and updates the "Latest Reading," "Average BPM," and "High Alerts" cards instantly.
5.  **Monitor on the Go (Mobile App)**:
    Open the React Native app in Expo Go. The screen background turns **vibrant red** the second a "HIGH" reading (>100 BPM) is ingested by the backend.

---

## 2. Infrastructure & Architecture

### High-Level Architecture
```mermaid
graph TD
    Sim["Smartwatch Simulator (Python)"] -->|POST /heart-rate| API["FastAPI Backend (Docker/EC2)"]
    API -->|Read/Write| DB["PostgreSQL (AWS RDS)"]
    API -->|GET /heart-rate| Web["React Dashboard (Tailwind v4)"]
    API -->|GET /heart-rate| Mob["React Native App (NativeWind)"]
    
    subgraph "AWS Infrastructure"
        DB
        EC2["EC2 Instance (Running API)"]
    end



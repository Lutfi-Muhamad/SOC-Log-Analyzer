# Mini SOC Log Analyzer V1 - Still in early development

A full-stack web application for analyzing SSH auth logs and detecting brute force attacks.

Built as a portfolio project for SOC Analyst skill development.

## Features

- Upload auth.log files via drag and drop
- Parse failed login attempts using regex
- Detect brute force activity (IP with >5 failed attempts)
- Display statistics: total entries, failed logins, unique IPs
- Show alerts with suspicious IP addresses

## Tech Stack

**Frontend:** React, Vite  
**Backend:** Python, FastAPI  
**Concepts:** Log analysis, brute force detection, REST API, security monitoring

## Project Structure

mini-soc-log-analyzer/

├── frontend/ React app

├── backend/ FastAPI app

│ ├── app/

│ │ ├── main.py

│ │ ├── parser.py

│ │ └── analyzer.py

│ └── sample_logs/

## Running Locally

**Backend:**

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**

```bash
npm install
npm run dev
```

## Sample Log

A sample `auth.log` is included in `backend/sample_logs/` for testing.

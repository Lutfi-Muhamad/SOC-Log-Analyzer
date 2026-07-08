# Mini SOC Log Analyzer

A full-stack web application for analyzing SSH authentication logs and detecting brute force attacks in real time.

Built as a hands-on portfolio project for SOC Analyst skill development.

🔗 **Live demo:** https://soc-log-analyzer-rosy.vercel.app

---

## What it does

Upload an `auth.log` file from a Linux SSH server and the system will:

- Count total log entries and failed login attempts
- Identify unique source IP addresses
- Flag IPs exceeding the brute force threshold (>5 failed attempts)
- Display severity levels per IP: High risk, Suspicious, Normal

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Python, FastAPI |
| Hosting | Vercel (frontend), Render (backend) |

---

## Detection logic

The parser scans each log line for known failure patterns:
Failed password

authentication failure

Invalid user

failed login

Any IP address triggering more than 5 matches is flagged as a brute force suspect. This simulates threshold-based alerting used in real SIEM platforms like Splunk and Wazuh.

---

## Project structure
mini-soc-log-analyzer/

├── src/

│   ├── components/

│   │   ├── UploadForm.jsx

│   │   ├── StatsCard.jsx

│   │   ├── AlertBox.jsx

│   │   └── IPTable.jsx

│   ├── pages/

│   │   └── Dashboard.jsx

│   └── services/

│       └── api.js

└── backend/

├── app/

│   ├── main.py

│   ├── parser.py

│   └── analyzer.py

└── sample_logs/

└── auth.log

---

## Running locally

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

---

## Sample log

A sample `auth.log` is included in `backend/sample_logs/` for testing.
It contains realistic SSH log entries across multiple scenarios:

- Brute force via `Failed password`
- Brute force via `authentication failure`
- Successful login (not flagged)
- `Invalid user` attempts
- Low-volume failed attempts (below threshold)

---

## Roadmap

- [✔️] Analysis history with localStorage
- [✔️] Custom rule editor (adjustable threshold + patterns)
- [ ] IOC checker — manual IP lookup
- [ ] Severity scoring per session
- [ ] Export report as PDF
- [ ] Loading Spinner API Health Checker
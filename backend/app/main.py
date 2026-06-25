from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.parser import parse_log
from app.analyzer import analyze

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://soc-log-analyzer-rosy.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

rules_config = {
    "brute_force_threshold": 5,
    "credential_stuffing_threshold": 3,
    "fail_patterns": [
        "Failed password",
        "authentication failure",
        "failed login",
        "Invalid user",
    ],
}


class RulesUpdate(BaseModel):
    brute_force_threshold: int
    credential_stuffing_threshold: int
    fail_patterns: list[str]


@app.get("/")
def root():
    return {"status": "online"}


@app.get("/rules")
def get_rules():
    return rules_config


@app.post("/rules")
def update_rules(rules: RulesUpdate):
    rules_config["brute_force_threshold"] = rules.brute_force_threshold
    rules_config["credential_stuffing_threshold"] = rules.credential_stuffing_threshold
    rules_config["fail_patterns"] = rules.fail_patterns
    return {"success": True, "rules": rules_config}


@app.post("/analyze")
async def analyze_log(file: UploadFile = File(...)):
    content = await file.read()
    lines = content.decode("utf-8", errors="ignore").splitlines()

    entries = parse_log(lines, fail_patterns=rules_config["fail_patterns"])

    result = analyze(
        entries,
        brute_force_threshold=rules_config["brute_force_threshold"],
        credential_stuffing_threshold=rules_config["credential_stuffing_threshold"],
    )

    return {
        "total_logs": len(lines),
        "failed_login": result["failed_login"],
        "unique_ip": result["unique_ip"],
        "top_ip": result["top_ip"],
        "alerts": result["brute_force"],
        "top_ips": result["all_ips"],
        "credential_stuffing": result["credential_stuffing"],
        "accepted_after_failed": result["accepted_after_failed"],
        "privilege_escalation": result["privilege_escalation"],
        "port_scanning": result["port_scanning"],
    }

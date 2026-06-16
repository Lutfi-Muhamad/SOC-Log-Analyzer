from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.parser import parse_log
from app.analyzer import analyze

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "online"}


@app.post("/analyze")
async def analyze_log(file: UploadFile = File(...)):
    content = await file.read()
    lines = content.decode("utf-8", errors="ignore").splitlines()

    entries = parse_log(lines)
    result = analyze(entries)

    return {
        "total_logs": len(lines),
        "failed_login": result["failed_login"],
        "unique_ip": result["unique_ip"],
        "top_ip": result["top_ip"],
        "alerts": result["brute_force"],
    }

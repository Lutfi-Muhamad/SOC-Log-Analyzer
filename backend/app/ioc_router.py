import os
import re
import time
import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter()

VT_API_KEY = os.getenv("VT_API_KEY")
VT_BASE_URL = "https://www.virustotal.com/api/v3/ip_addresses"

IPV4_PATTERN = re.compile(
    r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}"
    r"(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
)

# Simple in-memory cache: { ip: (timestamp, data) }
# Avoids burning VT's free-tier quota (4 req/min) on repeated lookups.
_cache = {}
CACHE_TTL_SECONDS = 600  # 10 minutes


def is_valid_ipv4(ip: str) -> bool:
    return bool(IPV4_PATTERN.match(ip))


def get_cached(ip: str):
    entry = _cache.get(ip)
    if not entry:
        return None
    timestamp, data = entry
    if time.time() - timestamp > CACHE_TTL_SECONDS:
        del _cache[ip]
        return None
    return data


@router.get("/ioc/ip/{ip}")
async def check_ip(ip: str):
    if not is_valid_ipv4(ip):
        raise HTTPException(status_code=400, detail="Invalid IPv4 address format")

    if not VT_API_KEY:
        raise HTTPException(
            status_code=500, detail="VT_API_KEY not configured on server"
        )

    cached = get_cached(ip)
    if cached:
        return {**cached, "cached": True}

    headers = {"x-apikey": VT_API_KEY}

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(f"{VT_BASE_URL}/{ip}", headers=headers)
        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="Failed to reach VirusTotal")

    if response.status_code == 404:
        raise HTTPException(
            status_code=404, detail="IP not found in VirusTotal database"
        )
    if response.status_code == 429:
        raise HTTPException(
            status_code=429, detail="VirusTotal rate limit exceeded — try again shortly"
        )
    if response.status_code != 200:
        raise HTTPException(
            status_code=502, detail="VirusTotal returned an unexpected error"
        )

    data = response.json()
    attrs = data.get("data", {}).get("attributes", {})
    stats = attrs.get("last_analysis_stats", {})

    malicious = stats.get("malicious", 0)
    suspicious = stats.get("suspicious", 0)
    harmless = stats.get("harmless", 0)
    undetected = stats.get("undetected", 0)

    if malicious >= 5:
        verdict = "malicious"
    elif malicious > 0 or suspicious > 0:
        verdict = "suspicious"
    else:
        verdict = "clean"

    result = {
        "ip": ip,
        "verdict": verdict,
        "stats": {
            "malicious": malicious,
            "suspicious": suspicious,
            "harmless": harmless,
            "undetected": undetected,
            "total_engines": malicious + suspicious + harmless + undetected,
        },
        "country": attrs.get("country"),
        "as_owner": attrs.get("as_owner"),
        "asn": attrs.get("asn"),
        "reputation": attrs.get("reputation"),
        "tags": attrs.get("tags", []),
        "cached": False,
    }

    _cache[ip] = (time.time(), result)
    return result

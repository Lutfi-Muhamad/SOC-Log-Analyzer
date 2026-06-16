import re

FAIL_PATTERNS = [
    r"Failed password",
    r"authentication failure",
    r"failed login",
    r"Invalid user",
]

IP_PATTERN = re.compile(r"(\d{1,3}(?:\.\d{1,3}){3})")


def parse_log(lines: list[str]) -> list[dict]:
    entries = []

    for line in lines:
        is_failed = any(re.search(p, line, re.IGNORECASE) for p in FAIL_PATTERNS)

        if not is_failed:
            continue

        ip_match = IP_PATTERN.search(line)
        ip = ip_match.group(1) if ip_match else None

        entries.append(
            {
                "raw": line.strip(),
                "ip": ip,
                "event": "failed_login",
            }
        )

    return entries

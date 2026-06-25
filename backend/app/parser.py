import re

DEFAULT_FAIL_PATTERNS = [
    r"Failed password",
    r"authentication failure",
    r"failed login",
    r"Invalid user",
]

SUCCESS_PATTERNS = [
    r"Accepted password",
    r"Accepted publickey",
]

PRIVESC_PATTERNS = [
    r"sudo:",
    r"su root",
    r"permission denied",
    r"FAILED su",
    r"not in sudoers",
    r"incorrect password attempts",
]

PORTSCAN_PATTERNS = [
    r"Did not receive identification string",
    r"Connection closed by",
    r"Connection reset by",
    r"Bad protocol version identification",
    r"refused connect from",
]

IP_PATTERN = re.compile(r"(\d{1,3}(?:\.\d{1,3}){3})")
PORT_PATTERN = re.compile(r"port\s+(\d+)", re.IGNORECASE)
USER_PATTERN = re.compile(r"(?:for|user)\s+(\w+)", re.IGNORECASE)
SUDO_USER_PATTERN = re.compile(r"sudo:\s+(\w+)", re.IGNORECASE)


def parse_log(lines: list[str], fail_patterns: list[str] = None) -> list[dict]:
    patterns = fail_patterns if fail_patterns else DEFAULT_FAIL_PATTERNS
    entries = []

    for line in lines:
        is_failed = any(re.search(p, line, re.IGNORECASE) for p in patterns)
        is_success = any(re.search(p, line, re.IGNORECASE) for p in SUCCESS_PATTERNS)
        is_privesc = any(re.search(p, line, re.IGNORECASE) for p in PRIVESC_PATTERNS)
        is_portscan = any(re.search(p, line, re.IGNORECASE) for p in PORTSCAN_PATTERNS)

        if not any([is_failed, is_success, is_privesc, is_portscan]):
            continue

        ip_match = IP_PATTERN.search(line)
        ip = ip_match.group(1) if ip_match else None

        port_match = PORT_PATTERN.search(line)
        port = int(port_match.group(1)) if port_match else None

        if is_privesc:
            user_match = SUDO_USER_PATTERN.search(line) or USER_PATTERN.search(line)
        else:
            user_match = USER_PATTERN.search(line)

        user = user_match.group(1) if user_match else None

        if is_privesc:
            event = "privesc_attempt"
        elif is_portscan:
            event = "port_probe"
        elif is_failed:
            event = "failed_login"
        else:
            event = "success_login"

        entries.append(
            {
                "raw": line.strip(),
                "ip": ip,
                "user": user,
                "port": port,
                "event": event,
            }
        )

    return entries

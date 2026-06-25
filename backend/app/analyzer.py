from collections import Counter, defaultdict


def analyze(
    entries: list[dict],
    brute_force_threshold: int = 5,
    credential_stuffing_threshold: int = 3,
) -> dict:
    failed_entries = [e for e in entries if e["event"] == "failed_login"]
    total_failed = len(failed_entries)

    ip_list = [e["ip"] for e in failed_entries if e["ip"] is not None]
    ip_counts = Counter(ip_list)

    unique_ips = len(ip_counts)

    top_ip = ip_counts.most_common(1)
    top_ip_address = top_ip[0][0] if top_ip else None

    brute_force_ips = [
        {"ip": ip, "count": count}
        for ip, count in ip_counts.items()
        if count > brute_force_threshold
    ]
    brute_force_ips.sort(key=lambda x: x["count"], reverse=True)

    all_ips = [{"ip": ip, "count": count} for ip, count in ip_counts.most_common()]

    credential_stuffing = detect_credential_stuffing(
        failed_entries, credential_stuffing_threshold
    )
    accepted_after_failed = detect_accepted_after_failed(entries)
    privilege_escalation = detect_privilege_escalation(entries)
    port_scanning = detect_port_scanning(entries)
    
    severity = calculate_severity({
         "brute_force": brute_force_ips,
        "credential_stuffing": credential_stuffing,
        "accepted_after_failed": accepted_after_failed,
        "privilege_escalation": privilege_escalation,
        "port_scanning": port_scanning,
    })


    return {
        "failed_login": total_failed,
        "unique_ip": unique_ips,
        "top_ip": top_ip_address,
        "brute_force": brute_force_ips,
        "all_ips": all_ips,
        "credential_stuffing": credential_stuffing,
        "accepted_after_failed": accepted_after_failed,
        "privilege_escalation": privilege_escalation,
        "port_scanning": port_scanning,
        "severity": severity,
    }


def detect_credential_stuffing(entries: list[dict], threshold: int = 3) -> list[dict]:
    ip_users = defaultdict(set)

    for entry in entries:
        ip = entry.get("ip")
        user = entry.get("user")
        if ip and user:
            ip_users[ip].add(user)

    suspects = [
        {
            "ip": ip,
            "usernames_tried": sorted(list(users)),
            "count": len(users),
        }
        for ip, users in ip_users.items()
        if len(users) >= threshold
    ]

    suspects.sort(key=lambda x: x["count"], reverse=True)
    return suspects


def detect_accepted_after_failed(entries: list[dict]) -> list[dict]:
    ip_failed = defaultdict(int)
    ip_success = defaultdict(list)

    for entry in entries:
        ip = entry.get("ip")
        if not ip:
            continue
        if entry["event"] == "failed_login":
            ip_failed[ip] += 1
        elif entry["event"] == "success_login":
            ip_success[ip].append(entry.get("user"))

    suspects = [
        {
            "ip": ip,
            "failed_attempts": ip_failed[ip],
            "succeeded_as": ip_success[ip],
        }
        for ip in ip_success
        if ip_failed[ip] > 0
    ]

    suspects.sort(key=lambda x: x["failed_attempts"], reverse=True)
    return suspects


def detect_privilege_escalation(entries: list[dict]) -> list[dict]:
    user_events = defaultdict(list)

    for entry in entries:
        if entry["event"] == "privesc_attempt":
            user = entry.get("user") or "unknown"
            user_events[user].append(
                {
                    "raw": entry["raw"],
                    "ip": entry.get("ip"),
                }
            )

    suspects = [
        {
            "user": user,
            "attempts": len(events),
            "source_ips": list(set(e["ip"] for e in events if e["ip"])),
            "sample": events[0]["raw"],
        }
        for user, events in user_events.items()
    ]

    suspects.sort(key=lambda x: x["attempts"], reverse=True)
    return suspects


def detect_port_scanning(entries: list[dict]) -> list[dict]:
    ip_ports = defaultdict(set)
    ip_probes = defaultdict(int)

    for entry in entries:
        if entry["event"] != "port_probe":
            continue
        ip = entry.get("ip")
        port = entry.get("port")
        if not ip:
            continue
        ip_probes[ip] += 1
        if port:
            ip_ports[ip].add(port)

    suspects = [
        {
            "ip": ip,
            "probe_count": ip_probes[ip],
            "ports_hit": sorted(list(ip_ports[ip])),
            "unique_ports": len(ip_ports[ip]),
        }
        for ip in ip_probes
        if ip_probes[ip] >= 5
    ]

    suspects.sort(key=lambda x: x["probe_count"], reverse=True)
    return suspects


def calculate_severity(result: dict) -> dict:
    score = 0

    score += len(result["brute_force"]) * 30
    score += len(result["credential_stuffing"]) * 25
    score += len(result["accepted_after_failed"]) * 50
    score += len(result["privilege_escalation"]) * 40
    score += len(result["port_scanning"]) * 20

    if score == 0:
        level = "Clean"
        color = "#1D9E75"
    elif score <= 40:
        level = "Low"
        color = "#1D9E75"
    elif score <= 80:
        level = "Medium"
        color = "#BA7517"
    elif score <= 150:
        level = "High"
        color = "#D85A30"
    else:
        level = "Critical"
        color = "#E24B4A"

    return {
        "score": score,
        "level": level,
        "color": color,
    }

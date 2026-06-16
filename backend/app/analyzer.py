from collections import Counter

BRUTE_FORCE_THRESHOLD = 5


def analyze(entries: list[dict]) -> dict:
    total_failed = len(entries)

    ip_list = [e["ip"] for e in entries if e["ip"] is not None]
    ip_counts = Counter(ip_list)

    unique_ips = len(ip_counts)

    top_ip = ip_counts.most_common(1)
    top_ip_address = top_ip[0][0] if top_ip else None

    brute_force_ips = [
        {"ip": ip, "count": count}
        for ip, count in ip_counts.items()
        if count > BRUTE_FORCE_THRESHOLD
    ]
    brute_force_ips.sort(key=lambda x: x["count"], reverse=True)

    all_ips = [{"ip": ip, "count": count} for ip, count in ip_counts.most_common()]

    return {
        "failed_login": total_failed,
        "unique_ip": unique_ips,
        "top_ip": top_ip_address,
        "brute_force": brute_force_ips,
        "all_ips": all_ips,
    }

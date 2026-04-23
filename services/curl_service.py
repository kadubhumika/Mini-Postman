import shlex
import json
from urllib.parse import urlencode

def generate_curl(method, url, headers=None, body=None):
    parts = [f"curl -X{method.upper()} '{url}'"]
    if headers:
        for key, value in headers.items():
            parts.append(f"--{key} '{value}'")

    if body:
        if isinstance(body, dict):
            body = json.dumps(body)
            parts.append(f"-d '{body}'")

    return " ".join(parts)

def parse_url(curl_command:str):
    parts = curl_command.split()
    result ={
        "method": "GET",  # Default
        "url": "",
        "headers": {},
        "body": None
    }
    for i, part in enumerate(parts):
        if part == "-X":
            result["method"] = parts[i+1]
        elif part == "-H":
            header_line = parts[i + 1].replace("'", "")
            key, val = header_line.split(": ", 1)
            result["headers"][key] = val
        elif part == "-d":
            result["body"] = parts[i + 1].strip("'")
        elif part.startswith("http"):
            result["url"] = part.strip("'")

    return result

import shlex
import json
from urllib.parse import urlencode

def generate_curl(method,url,headers = None,params = None,  body = None):
    method = method.upper()

    if params:
        query_string = urlencode(params)
        url = "{}?{}".format(url, query_string)
    if method=="GET":
        curl = f'curl "{url}"'
    else:
        curl = f'curl -X {method} "{url}"'

    # adding headers now
    if headers:
        for key, value in headers.items():
            curl += f' -H {key} "{value}"'

    # add body
    if body and method in ["POST","PUT","PATCH"]:
        if isinstance(body,dict):
            body = json.dumps(body)
        curl += f' -d "{body}"'
    return {"curl_command": curl}

def parse_curl(curl_command):
    tokens = shlex.split(curl_command)
    method = "GET"
    url = ""
    params = {}
    headers = {}
    body = ""
    i =0
    while i < len(tokens):
        token = tokens[i]
        if token == 'curl':
            if i+1 < len(tokens):
                url = tokens[i+1]
        elif token == '-X':
            if i+1 < len(tokens):
                method = tokens[i+1].upper()
        elif token == '-H':
            if i+1 < len(tokens):
                headers = tokens[i+1]
                if ":" in headers:
                    key,value = headers.split(":",1)
                    headers[key.strip()] = value.strip()
        elif token in ["-d","--data","--data-raw"]:
            if i+1 < len(tokens):
                body = tokens[i+1]
        i+=1
        if body and method == 'GET':
            method = "POST"

        if "?" in url:
            base,query = url.split("?",1)
            url = base
            for pair in query.split("&"):
                k,v = pair.split("=",1)
                params[k] = v
    return {
            "method": method,
            "url": url,
            "headers": headers,
            "body": body,
            "params": params,

        }

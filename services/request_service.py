

import requests
import time

def send_request(method,url,headers=None,params=None,body=None):
    start_time = time.time()
    try:
        method = method.upper()
        if method == 'GET':
            response = requests.get(url, headers=headers, params=params)

        if method == 'POST':
            response = requests.post(url, headers=headers, params=params,json=body)

        if method == 'PUT':
            response = requests.put(url, headers=headers, params=params,json=body)

        if method == 'DELETE':
            response = requests.delete(url, headers=headers, params=params,json=body)

        else:
            return {"ERROR" :"Invalid HTTP URL"}

        end_time = time.time()
        response_time = round(end_time - start_time,3)
        try:
            data = response.json()
        except:
            data = response.text

        return {
            "status_code": response.status_code,
            "response_time": response_time,
            "headers": dict(response.headers),
            "data": data,

        }



    except Exception as e:
        return {
            print(e)
        }


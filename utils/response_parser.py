from utils.json_formatter import format_json

def parse_response(response,response_time):
    content_type = response.headers.get('Content-Type',"")

    if "application/json" in content_type:
        try:
            data = response.json()
            formatted_data = format_json(data)
        except:
            formatted_data = response.text
    elif "text/html" in content_type:
        formatted_data = response.text

    else:
        formatted_data = response.text

    return {
        "status_code": response.status_code,
        "response_time": response_time,

        "headers": dict(response.headers),
        "data" :formatted_data


    }

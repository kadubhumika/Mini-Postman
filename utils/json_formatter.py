import json


def format_json(json_data):
    try:
        return json.dumps(json_data, indent=4)
    except:
        return json_data
import httpx
import time
def check_json_path(data, path):
    keys = path.split(".")
    for k in keys:
        if isinstance(data, dict) and k in data:
            data = data[k]
        else:
            return False
    return True

class RequestModel:
    def __init__(self, base_url, headers=None):
        self.base_url = base_url
        self.headers = headers or {}



    async def _send(self, method, endpoint, params=None, body=None, tests=None):
        async with httpx.AsyncClient(base_url=self.base_url) as client:

            start = time.time()

            response = await client.request(
                method=method,
                url=endpoint,
                headers=self.headers,
                params=params,
                json=body
            )

            end = time.time()
            time_taken = end - start


            response_data = response.json() if "application/json" in response.headers.get("Content-Type",
                                                                                          "") else response.text


            test_result = {}
            if tests:
                if "status_code" in tests:
                    test_result["status"] = response.status_code == tests["status_code"]
                if "response_time_lt" in tests:
                    test_result["fast"] = (time_taken * 1000) < tests["response_time_lt"]


                if "json_path" in tests and isinstance(response_data, dict):
                    test_result["json"] = {
                        path: check_json_path(response_data, path)
                        for path in tests["json_path"]
                    }

                if "key_exists" in tests and isinstance(response_data, dict):
                    key = tests["key_exists"]
                    test_result["key_exists"] = key in response_data

            return {
                "status": response.status_code,
                "data": response_data,
                "time_ms": time_taken,
                "tests": test_result
            }

    async def get(self, endpoint, params=None,tests=None):
        """GET: Focused on query parameters"""
        # You can add logic here specific to GET
        return await self._send("GET", endpoint, params=params,tests=tests)

    async def post(self, endpoint, body,tests=None):
        """POST: Requires a body, often creates data"""
        # Trigger your body_check(body) here
        return await self._send("POST", endpoint, body=body,tests=tests)

    async def put(self, endpoint, body,tests=None):
        """PUT: Requires a body, usually updates everything"""
        # Trigger your body_check(body) here
        return await self._send("PUT", endpoint, body=body,tests=tests)

    async def delete(self, endpoint):
        """DELETE: Usually just needs the endpoint/ID"""
        return await self._send("DELETE", endpoint)

# Example Usage:
# model = RequestModel("https://example.com")
# result = await model.post("/users", body={"name": "John"})

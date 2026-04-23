import httpx

class RequestModel:
    def __init__(self, base_url, headers=None):
        self.base_url = base_url
        self.headers = headers or {}

    async def _send(self, method, endpoint, params=None, body=None):
        """Internal helper to manage the client lifecycle"""
        async with httpx.AsyncClient(base_url=self.base_url) as client:
            response = await client.request(
                method=method,
                url=endpoint,
                headers=self.headers,
                params=params,
                json=body
            )
            return {
                "status": response.status_code,
                "data": response.json() if "application/json" in response.headers.get("Content-Type", "") else response.text
            }

    async def get(self, endpoint, params=None):
        """GET: Focused on query parameters"""
        # You can add logic here specific to GET
        return await self._send("GET", endpoint, params=params)

    async def post(self, endpoint, body):
        """POST: Requires a body, often creates data"""
        # Trigger your body_check(body) here
        return await self._send("POST", endpoint, body=body)

    async def put(self, endpoint, body):
        """PUT: Requires a body, usually updates everything"""
        # Trigger your body_check(body) here
        return await self._send("PUT", endpoint, body=body)

    async def delete(self, endpoint):
        """DELETE: Usually just needs the endpoint/ID"""
        return await self._send("DELETE", endpoint)

# Example Usage:
# model = RequestModel("https://example.com")
# result = await model.post("/users", body={"name": "John"})

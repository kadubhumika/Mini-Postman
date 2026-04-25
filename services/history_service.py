from sqlalchemy.future import select
from models.history_model import History
from storage.database import AsyncSessionLocal

async def save_history(data:dict):
    async with AsyncSessionLocal() as session:
        async with session.begin():
            history = History(
                method=data.get("method"),
                url=data.get("url"),
                params=data.get("params"),
                headers=data.get("headers"),
                body=data.get("body"),
                response=data.get("response"),
                response_time=data.get("response_time"),
                status_code=data.get("status_code"),
            )
            session.add(history)

def to_dict(obj):
    return {
        "id": obj.id,
        "method": obj.method,
        "url": obj.url,
        "params": obj.params,
        "headers": obj.headers,
        "body": obj.body,
        "response": obj.response,
        "response_time": obj.response_time,
        "status_code": obj.status_code
    }
async def get_history(limit:int=10,method: str = None):
    async with AsyncSessionLocal() as session:
        query = select(History).order_by(History.id.desc()).limit(limit)
        results = await session.execute(query)

        return [to_dict(row) for row in results.scalars().all()]



from sqlalchemy.future import select
from models.history_model import History
from storage.database import AsyncSessionLocal

async def save_history(data:dict):
    async with AsyncSessionLocal() as session:
        async with session.begin():
            history = History(**data)
            session.add(history)

async def get_history(limit:int=100):
    async with AsyncSessionLocal() as session:
        query = select(History).order_by(History.id.desc()).limit(limit)
        results = await session.execute(query)

        return results.scalars().all()



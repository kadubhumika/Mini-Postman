from sqlalchemy import Column, Integer, String, JSON
from storage.database import Base

class History(Base):
    __tablename__='history'
    id = Column(Integer, primary_key=True)
    method = Column(String)
    url = Column(String)
    params = Column(JSON)
    headers = Column(JSON)
    body = Column(String)
    response=Column(String)
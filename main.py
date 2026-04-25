from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import curl_api, history_api,request_api, websocket_routes
from storage.database import engine, Base

app = FastAPI(
    title="Async API Inspector",
    description="Send requests, generate curl, parse curl, and stream responses via WebSocket",
    version="1.0.0"
)
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# include routers
app.include_router(request_api.router)
app.include_router(curl_api.router)
app.include_router(history_api.router)
app.include_router(websocket_routes.router)

# create DB tables
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/")
def root():
    return {
        "message": "API Inspector running!",
        "docs": "/docs",
        "websocket": "/ws"
    }
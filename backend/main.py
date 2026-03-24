from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import graph, chat

app = FastAPI(title="Order-to-Cash Graph API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graph.router, prefix="/api/graph", tags=["Graph"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Order-to-Cash Graph API"}

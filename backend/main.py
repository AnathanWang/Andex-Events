from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import events, auth, users, map_data
from app.core.config import settings

app = FastAPI(
    title="Andex Events API",
    description="API for local events mapping application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(map_data.router, prefix="/api/map", tags=["map"])

@app.get("/")
async def root():
    return {"message": "Andex Events API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
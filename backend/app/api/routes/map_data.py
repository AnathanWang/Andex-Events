from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models import schemas, models

router = APIRouter()

@router.get("/events", response_model=schemas.EventsMapResponse)
async def get_events_in_bounds(
    north: float = Query(..., description="Northern latitude boundary"),
    south: float = Query(..., description="Southern latitude boundary"),
    east: float = Query(..., description="Eastern longitude boundary"),
    west: float = Query(..., description="Western longitude boundary"),
    category: str = Query(None, description="Filter by event category"),
    db: Session = Depends(get_db)
):
    """Get events within map bounds for map display"""
    query = db.query(models.Event).filter(
        models.Event.is_active.is_(True),
        models.Event.latitude >= south,
        models.Event.latitude <= north,
        models.Event.longitude >= west,
        models.Event.longitude <= east
    )
    
    if category:
        query = query.filter(models.Event.category == category)
    
    events = query.all()
    
    return {
        "events": events,
        "total_count": len(events)
    }

@router.get("/categories")
async def get_event_categories(db: Session = Depends(get_db)):
    """Get all available event categories"""
    categories = db.query(models.Event.category).distinct().all()
    return [cat[0] for cat in categories if cat[0] is not None]
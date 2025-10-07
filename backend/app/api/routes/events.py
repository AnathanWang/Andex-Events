from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models import schemas, models
from app.services.auth import get_current_user
from geopy.distance import geodesic

router = APIRouter()

@router.post("/", response_model=schemas.Event)
async def create_event(
    event: schemas.EventCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_event = models.Event(**event.dict(), organizer_id=current_user.id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/", response_model=List[schemas.Event])
async def get_events(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    lat: Optional[float] = Query(None, description="Latitude for location-based search"),
    lng: Optional[float] = Query(None, description="Longitude for location-based search"),
    radius_km: Optional[float] = Query(None, description="Search radius in kilometers"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Event).filter(models.Event.is_active == True)
    
    if category:
        query = query.filter(models.Event.category == category)
    
    events = query.offset(skip).limit(limit).all()
    
    # Filter by location if coordinates provided
    if lat is not None and lng is not None and radius_km is not None:
        filtered_events = []
        user_location = (lat, lng)
        
        for event in events:
            event_location = (event.latitude, event.longitude)
            distance = geodesic(user_location, event_location).kilometers
            
            if distance <= radius_km:
                filtered_events.append(event)
        
        return filtered_events
    
    return events

@router.get("/{event_id}", response_model=schemas.Event)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=schemas.Event)
async def update_event(
    event_id: int,
    event_update: schemas.EventUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this event")
    
    update_data = event_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
    
    db.commit()
    db.refresh(event)
    return event

@router.delete("/{event_id}")
async def delete_event(
    event_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this event")
    
    event.is_active = False
    db.commit()
    return {"message": "Event deleted successfully"}

@router.post("/{event_id}/register", response_model=schemas.EventRegistration)
async def register_for_event(
    event_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if event exists
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if user already registered
    existing_registration = db.query(models.EventRegistration).filter(
        models.EventRegistration.user_id == current_user.id,
        models.EventRegistration.event_id == event_id
    ).first()
    
    if existing_registration:
        raise HTTPException(status_code=400, detail="Already registered for this event")
    
    # Create registration
    registration = models.EventRegistration(
        user_id=current_user.id,
        event_id=event_id
    )
    db.add(registration)
    db.commit()
    db.refresh(registration)
    
    return registration
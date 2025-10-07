from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models import schemas, models
from app.services.auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=schemas.User)
async def get_current_user_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.User)
async def update_current_user(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me/events", response_model=List[schemas.Event])
async def get_user_events(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get events created by current user"""
    return db.query(models.Event).filter(models.Event.organizer_id == current_user.id).all()

@router.get("/me/registrations", response_model=List[schemas.EventRegistration])
async def get_user_registrations(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get events user is registered for"""
    return db.query(models.EventRegistration).filter(
        models.EventRegistration.user_id == current_user.id
    ).all()
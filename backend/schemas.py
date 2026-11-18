from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "student"
    college: Optional[str] = None
    department: Optional[str] = None
    year_of_study: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    college: Optional[str] = None
    department: Optional[str] = None
    year_of_study: Optional[str] = None
    skills: Optional[str] = None
    interests: Optional[str] = None
    bio: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    college: Optional[str] = None
    department: Optional[str] = None
    year_of_study: Optional[str] = None
    skills: Optional[str] = None
    interests: Optional[str] = None
    bio: Optional[str] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class OpportunityCreate(BaseModel):
    title: str
    organization: str
    type: str
    location: str
    description: str
    deadline: str
    club_id: Optional[int] = None
    skills_required: Optional[str] = None


class OpportunityResponse(BaseModel):
    id: int
    title: str
    organization: str
    type: str
    location: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[str] = None
    club_id: Optional[int] = None
    status: str = "Approved"
    skills_required: Optional[str] = None
    match_score: Optional[int] = None
    match_reason: Optional[str] = None

    class Config:
        from_attributes = True


class OpportunityStatusUpdate(BaseModel):
    status: str  # 'Approved', 'Pending', 'Rejected'


class ApplicationCreate(BaseModel):
    user_id: int
    opportunity_id: int
    name: str
    email: EmailStr
    phone: str
    resume_name: Optional[str] = None
    reason: str


class ApplicationStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

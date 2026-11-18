from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="student")  # 'student', 'club', 'admin'
    college = Column(String(200), nullable=True)
    department = Column(String(100), nullable=True)
    year_of_study = Column(String(50), nullable=True)
    skills = Column(Text, nullable=True)  # Comma-separated or JSON
    interests = Column(Text, nullable=True)  # Comma-separated or JSON
    bio = Column(Text, nullable=True)


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    organization = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False)  # Internship, Hackathon, Event, Workshop
    location = Column(String(200))
    description = Column(Text)
    deadline = Column(String(100))
    club_id = Column(Integer, nullable=True)
    status = Column(String(50), default="Approved")  # 'Approved', 'Pending', 'Rejected'
    skills_required = Column(Text, nullable=True)


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    opportunity_id = Column(Integer, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=False)
    resume_name = Column(String(255))
    reason = Column(Text)
    status = Column(String(50), default="Applied")  # 'Applied', 'Under Review', 'Accepted', 'Rejected'
    applied_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info")  # 'info', 'success', 'warning'
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

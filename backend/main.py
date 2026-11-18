from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import engine, Base, get_db
import models
import schemas
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_optional_current_user
)
from recommendations import compute_recommendations

app = FastAPI(title="CampusConnect API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "CampusConnect API is running smoothly!",
        "version": "2.0.0",
        "docs": "/docs"
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


# ==============================================================================
# AUTHENTICATION & USERS
# ==============================================================================

@app.post("/api/signup", response_model=schemas.TokenResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email address is already registered."
        )

    hashed_pwd = hash_password(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_pwd,
        role=user.role,
        college=user.college or "University Campus",
        department=user.department or "General",
        year_of_study=user.year_of_study or "1st Year",
        skills="",
        interests="",
        bio=""
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create Welcome Notification
    welcome_notif = models.Notification(
        user_id=new_user.id,
        title="Welcome to CampusConnect! 🎓",
        message=f"Hi {new_user.name}, your account has been set up successfully. Complete your profile to get personalized recommendations!",
        type="success"
    )
    db.add(welcome_notif)
    db.commit()

    token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }


@app.post("/api/login", response_model=schemas.TokenResponse)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    # Auto-upgrade plaintext to bcrypt if verified
    if not user.password.startswith("$2b$") and not user.password.startswith("$2a$"):
        user.password = hash_password(user_data.password)
        db.commit()

    token = create_access_token(data={"sub": str(user.id), "role": user.role})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.put("/api/profile", response_model=schemas.UserResponse)
def update_profile(
    profile_data: schemas.UserProfileUpdate,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    # Support direct update by id or fallback
    target_user = None
    if user_id:
        target_user = db.query(models.User).filter(models.User.id == user_id).first()

    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    if profile_data.name is not None:
        target_user.name = profile_data.name
    if profile_data.college is not None:
        target_user.college = profile_data.college
    if profile_data.department is not None:
        target_user.department = profile_data.department
    if profile_data.year_of_study is not None:
        target_user.year_of_study = profile_data.year_of_study
    if profile_data.skills is not None:
        target_user.skills = profile_data.skills
    if profile_data.interests is not None:
        target_user.interests = profile_data.interests
    if profile_data.bio is not None:
        target_user.bio = profile_data.bio

    db.commit()
    db.refresh(target_user)
    return target_user


# ==============================================================================
# OPPORTUNITIES & RECOMMENDATIONS
# ==============================================================================

@app.get("/api/opportunities")
def get_opportunities(
    type: Optional[str] = None,
    search: Optional[str] = None,
    status_filter: Optional[str] = "Approved",
    db: Session = Depends(get_db)
):
    query = db.query(models.Opportunity)

    if status_filter and status_filter != "All":
        query = query.filter(models.Opportunity.status == status_filter)

    if type and type != "All":
        query = query.filter(models.Opportunity.type == type)

    opportunities = query.all()

    # Seed demo opportunities if database is completely empty
    if not opportunities and db.query(models.Opportunity).count() == 0:
        sample_opportunities = [
            models.Opportunity(
                title="Full-Stack Web Developer Intern",
                organization="Tech Solutions Pvt. Ltd.",
                type="Internship",
                location="Bengaluru · Hybrid",
                description="Join our engineering team to build scalable React and Python web microservices with real-time analytics.",
                deadline="30 October 2026",
                status="Approved",
                skills_required="React, Python, SQL, REST APIs"
            ),
            models.Opportunity(
                title="AI & Cloud Innovation Hackathon",
                organization="Campus Tech Community",
                type="Hackathon",
                location="Bengaluru Campus",
                description="48-hour challenge building transformative AI agents, smart campus solutions, and cloud architectures with mentor support.",
                deadline="15 November 2026",
                status="Approved",
                skills_required="Python, Machine Learning, Fast-Paced Prototyping"
            ),
            models.Opportunity(
                title="Modern DevOps & Cloud Workshop",
                organization="Developer Student Club",
                type="Workshop",
                location="Online · Interactive",
                description="Master Docker, CI/CD pipelines, PostgreSQL tuning, and cloud deployment in this hands-on guided workshop.",
                deadline="5 November 2026",
                status="Approved",
                skills_required="Docker, Linux, Git, CI/CD"
            ),
            models.Opportunity(
                title="Annual Campus Tech Expo 2026",
                organization="Engineering Council",
                type="Event",
                location="Main Auditorium",
                description="Showcase student projects to industry recruiters, network with tech leaders, and attend keynote panels.",
                deadline="20 November 2026",
                status="Approved",
                skills_required="Communication, Networking, Project Showcase"
            )
        ]
        db.add_all(sample_opportunities)
        db.commit()
        opportunities = db.query(models.Opportunity).all()

    # Apply search filter in memory if provided
    if search:
        s = search.lower()
        opportunities = [
            o for o in opportunities
            if s in o.title.lower() or s in o.organization.lower() or s in (o.description or "").lower()
        ]

    return [
        {
            "id": opp.id,
            "title": opp.title,
            "organization": opp.organization,
            "type": opp.type,
            "location": opp.location,
            "description": opp.description,
            "deadline": opp.deadline,
            "club_id": opp.club_id,
            "status": opp.status or "Approved",
            "skills_required": opp.skills_required
        }
        for opp in opportunities
    ]


@app.get("/api/opportunities/recommended")
def get_recommended_opportunities(
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    user = None
    if user_id:
        user = db.query(models.User).filter(models.User.id == user_id).first()

    opportunities = db.query(models.Opportunity).filter(models.Opportunity.status == "Approved").all()

    if not user:
        return [
            {
                "id": opp.id,
                "title": opp.title,
                "organization": opp.organization,
                "type": opp.type,
                "location": opp.location,
                "description": opp.description,
                "deadline": opp.deadline,
                "club_id": opp.club_id,
                "status": opp.status,
                "skills_required": opp.skills_required,
                "match_score": 85,
                "match_reason": f"Popular {opp.type} on campus"
            }
            for opp in opportunities[:4]
        ]

    recommendations = compute_recommendations(user, opportunities)

    return [
        {
            "id": rec["opportunity"].id,
            "title": rec["opportunity"].title,
            "organization": rec["opportunity"].organization,
            "type": rec["opportunity"].type,
            "location": rec["opportunity"].location,
            "description": rec["opportunity"].description,
            "deadline": rec["opportunity"].deadline,
            "club_id": rec["opportunity"].club_id,
            "status": rec["opportunity"].status,
            "skills_required": rec["opportunity"].skills_required,
            "match_score": rec["match_score"],
            "match_reason": rec["match_reason"]
        }
        for rec in recommendations
    ]


@app.get("/api/opportunities/{opportunity_id}")
def get_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    opportunity = db.query(models.Opportunity).filter(models.Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    return {
        "id": opportunity.id,
        "title": opportunity.title,
        "organization": opportunity.organization,
        "type": opportunity.type,
        "location": opportunity.location,
        "description": opportunity.description,
        "deadline": opportunity.deadline,
        "club_id": opportunity.club_id,
        "status": opportunity.status or "Approved",
        "skills_required": opportunity.skills_required
    }


@app.post("/api/opportunities")
def create_opportunity(opportunity: schemas.OpportunityCreate, db: Session = Depends(get_db)):
    if opportunity.club_id:
        club = db.query(models.User).filter(models.User.id == opportunity.club_id).first()
        if not club:
            raise HTTPException(status_code=404, detail="Club user not found")
        if club.role not in ["club", "admin"]:
            raise HTTPException(status_code=403, detail="Only club or admin accounts can create opportunities")

    new_opportunity = models.Opportunity(
        title=opportunity.title,
        organization=opportunity.organization,
        type=opportunity.type,
        location=opportunity.location,
        description=opportunity.description,
        deadline=opportunity.deadline,
        club_id=opportunity.club_id,
        status="Approved",
        skills_required=opportunity.skills_required or "General skills"
    )

    db.add(new_opportunity)
    db.commit()
    db.refresh(new_opportunity)

    return {
        "id": new_opportunity.id,
        "title": new_opportunity.title,
        "organization": new_opportunity.organization,
        "type": new_opportunity.type,
        "location": new_opportunity.location,
        "description": new_opportunity.description,
        "deadline": new_opportunity.deadline,
        "club_id": new_opportunity.club_id,
        "status": new_opportunity.status,
        "skills_required": new_opportunity.skills_required
    }


# ==============================================================================
# CLUB PORTAL
# ==============================================================================

@app.get("/api/clubs/{club_id}/opportunities")
def get_club_opportunities(club_id: int, db: Session = Depends(get_db)):
    opportunities = db.query(models.Opportunity).filter(models.Opportunity.club_id == club_id).all()
    return [
        {
            "id": opp.id,
            "title": opp.title,
            "organization": opp.organization,
            "type": opp.type,
            "location": opp.location,
            "description": opp.description,
            "deadline": opp.deadline,
            "club_id": opp.club_id,
            "status": opp.status or "Approved",
            "skills_required": opp.skills_required
        }
        for opp in opportunities
    ]


@app.get("/api/clubs/{club_id}/stats")
def get_club_stats(club_id: int, db: Session = Depends(get_db)):
    opportunities_posted = db.query(models.Opportunity).filter(
        models.Opportunity.club_id == club_id
    ).count()

    applications_query = db.query(models.Application).join(
        models.Opportunity,
        models.Application.opportunity_id == models.Opportunity.id
    ).filter(models.Opportunity.club_id == club_id)

    total_applications = applications_query.count()
    accepted_applications = applications_query.filter(models.Application.status == "Accepted").count()
    rejected_applications = applications_query.filter(models.Application.status == "Rejected").count()
    pending_applications = applications_query.filter(models.Application.status.in_(["Applied", "Under Review"])).count()

    return {
        "opportunities_posted": opportunities_posted,
        "total_applications": total_applications,
        "active_opportunities": opportunities_posted,
        "accepted_applications": accepted_applications,
        "rejected_applications": rejected_applications,
        "pending_applications": pending_applications
    }


# ==============================================================================
# APPLICATIONS WORKFLOW
# ==============================================================================

@app.post("/api/applications")
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == application.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student user not found")

    opportunity = db.query(models.Opportunity).filter(models.Opportunity.id == application.opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    # Prevent Duplicate Applications
    existing_app = db.query(models.Application).filter(
        models.Application.user_id == application.user_id,
        models.Application.opportunity_id == application.opportunity_id
    ).first()

    if existing_app:
        raise HTTPException(
            status_code=400,
            detail=f"You have already applied for '{opportunity.title}'. Track your status under My Applications."
        )

    new_app = models.Application(
        user_id=application.user_id,
        opportunity_id=application.opportunity_id,
        name=application.name,
        email=application.email,
        phone=application.phone,
        resume_name=application.resume_name or "Resume.pdf",
        reason=application.reason,
        status="Applied"
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    # In-App Notification for Student
    notif = models.Notification(
        user_id=user.id,
        title="Application Submitted! 🚀",
        message=f"You successfully applied for '{opportunity.title}' at {opportunity.organization}.",
        type="info"
    )
    db.add(notif)
    db.commit()

    return {
        "id": new_app.id,
        "user_id": new_app.user_id,
        "opportunity_id": new_app.opportunity_id,
        "name": new_app.name,
        "email": new_app.email,
        "phone": new_app.phone,
        "resume_name": new_app.resume_name,
        "reason": new_app.reason,
        "status": new_app.status
    }


@app.get("/api/applications/{user_id}")
def get_user_applications(user_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(models.Application, models.Opportunity)
        .outerjoin(models.Opportunity, models.Application.opportunity_id == models.Opportunity.id)
        .filter(models.Application.user_id == user_id)
        .order_by(desc(models.Application.id))
        .all()
    )

    data = []
    for app_item, opp_item in results:
        data.append({
            "id": app_item.id,
            "user_id": app_item.user_id,
            "opportunity_id": app_item.opportunity_id,
            "name": app_item.name,
            "email": app_item.email,
            "phone": app_item.phone,
            "resume_name": app_item.resume_name,
            "reason": app_item.reason,
            "status": app_item.status,
            "applied_at": app_item.applied_at.isoformat() if app_item.applied_at else None,
            "notes": app_item.notes,
            "opportunity_title": opp_item.title if opp_item else "Opportunity",
            "opportunity_organization": opp_item.organization if opp_item else "CampusConnect",
            "opportunity_type": opp_item.type if opp_item else "Opportunity",
            "opportunity_location": opp_item.location if opp_item else "Campus",
            "opportunity_deadline": opp_item.deadline if opp_item else ""
        })
    return data


@app.get("/api/clubs/{club_id}/applications")
def get_club_applications(club_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(models.Application, models.Opportunity)
        .join(models.Opportunity, models.Application.opportunity_id == models.Opportunity.id)
        .filter(models.Opportunity.club_id == club_id)
        .order_by(desc(models.Application.id))
        .all()
    )

    return [
        {
            "id": application.id,
            "user_id": application.user_id,
            "opportunity_id": application.opportunity_id,
            "opportunity_title": opportunity.title,
            "opportunity_type": opportunity.type,
            "name": application.name,
            "email": application.email,
            "phone": application.phone,
            "resume_name": application.resume_name,
            "reason": application.reason,
            "status": application.status,
            "applied_at": application.applied_at.isoformat() if application.applied_at else None,
            "notes": application.notes
        }
        for application, opportunity in results
    ]


@app.put("/api/applications/{application_id}/status")
def update_application_status(
    application_id: int,
    status_update: schemas.ApplicationStatusUpdate,
    db: Session = Depends(get_db)
):
    valid_statuses = ["Applied", "Under Review", "Accepted", "Rejected"]
    if status_update.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    application.status = status_update.status
    if status_update.notes:
        application.notes = status_update.notes

    db.commit()
    db.refresh(application)

    # Opportunity details for notification
    opp = db.query(models.Opportunity).filter(models.Opportunity.id == application.opportunity_id).first()
    opp_title = opp.title if opp else "Opportunity"

    status_icon = "🎉" if application.status == "Accepted" else "📌" if application.status == "Under Review" else "ℹ️"
    notif = models.Notification(
        user_id=application.user_id,
        title=f"Application {application.status}! {status_icon}",
        message=f"Your application for '{opp_title}' has been moved to '{application.status}'.",
        type="success" if application.status == "Accepted" else "warning" if application.status == "Rejected" else "info"
    )
    db.add(notif)
    db.commit()

    return {
        "id": application.id,
        "status": application.status,
        "notes": application.notes
    }


# ==============================================================================
# ADMIN PORTAL
# ==============================================================================

@app.get("/api/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    students_count = db.query(models.User).filter(models.User.role == "student").count()
    clubs_count = db.query(models.User).filter(models.User.role == "club").count()
    opportunities_count = db.query(models.Opportunity).count()
    applications_count = db.query(models.Application).count()
    pending_opportunities = db.query(models.Opportunity).filter(models.Opportunity.status == "Pending").count()

    return {
        "total_users": total_users,
        "students_count": students_count,
        "clubs_count": clubs_count,
        "opportunities_count": opportunities_count,
        "applications_count": applications_count,
        "pending_opportunities": pending_opportunities
    }


@app.get("/api/admin/users")
def get_admin_users(role: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.User)
    if role and role != "All":
        query = query.filter(models.User.role == role)
    users = query.all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "college": u.college,
            "department": u.department,
            "year_of_study": u.year_of_study
        }
        for u in users
    ]


@app.put("/api/admin/opportunities/{opportunity_id}/status")
def update_opportunity_status(
    opportunity_id: int,
    status_update: schemas.OpportunityStatusUpdate,
    db: Session = Depends(get_db)
):
    opp = db.query(models.Opportunity).filter(models.Opportunity.id == opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    opp.status = status_update.status
    db.commit()
    db.refresh(opp)

    return {"id": opp.id, "status": opp.status}


# ==============================================================================
# NOTIFICATIONS
# ==============================================================================

@app.get("/api/notifications/{user_id}")
def get_user_notifications(user_id: int, db: Session = Depends(get_db)):
    notifications = (
        db.query(models.Notification)
        .filter(models.Notification.user_id == user_id)
        .order_by(desc(models.Notification.created_at))
        .limit(15)
        .all()
    )
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat() if n.created_at else None
        }
        for n in notifications
    ]


@app.put("/api/notifications/{notification_id}/read")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    notif = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "success"}

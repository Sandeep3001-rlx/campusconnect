import re
from typing import List, Dict, Any
import models


def tokenize(text: str) -> set:
    if not text:
        return set()
    cleaned = re.sub(r"[^\w\s]", " ", text.lower())
    words = [w.strip() for w in cleaned.split() if len(w.strip()) > 2]
    # Filter common stop words
    stop_words = {
        "and", "the", "for", "with", "this", "that", "from", "are", "you",
        "our", "will", "all", "can", "work", "have", "join", "learn"
    }
    return {w for w in words if w not in stop_words}


def compute_recommendations(
    user: models.User,
    opportunities: List[models.Opportunity]
) -> List[Dict[str, Any]]:
    results = []

    user_skills = tokenize(user.skills or "")
    user_interests = tokenize(user.interests or "")
    user_dept = tokenize(user.department or "")

    for opp in opportunities:
        score = 0
        reasons = []

        opp_text = f"{opp.title} {opp.description} {opp.skills_required or ''} {opp.type}"
        opp_tokens = tokenize(opp_text)

        # 1. Skill overlap
        matched_skills = user_skills.intersection(opp_tokens)
        if matched_skills:
            skill_score = min(len(matched_skills) * 30, 60)
            score += skill_score
            skills_list = ", ".join(list(matched_skills)[:3]).title()
            reasons.append(f"Matches your skills: {skills_list}")

        # 2. Interest / Category overlap
        matched_interests = user_interests.intersection(opp_tokens)
        if matched_interests or (user.interests and opp.type.lower() in user.interests.lower()):
            score += 25
            reasons.append(f"Matches your interest in {opp.type}s")

        # 3. Department relevance
        matched_dept = user_dept.intersection(opp_tokens)
        if matched_dept:
            score += 15
            reasons.append(f"Relevant for {user.department} students")

        # Baseline score so every opportunity has an honest base relevance
        final_score = min(max(score, 35 if not reasons else score), 98)
        if not reasons:
            reasons.append(f"Popular {opp.type} opportunity across campus")

        results.append({
            "opportunity": opp,
            "match_score": final_score,
            "match_reason": " · ".join(reasons)
        })

    # Sort descending by match score
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results

import json
import re
from collections import Counter

# FONCTION SUPPRIMÉE - Seul l'IA GitHub est utilisé pour le scoring
# def analyze_cv_free(cv_text, formation_criteria): - SUPPRIMÉ


def extract_experience(text):
    """Extrait le nombre d'années d'expérience"""
    patterns = [
        r'(\d+)\s*ans?\s+d[\'e\s]*expérience',
        r'expérience\s+de\s+(\d+)\s*ans?',
        r'(\d+)\s*years?\s+of\s+experience',
        r'(\d+)\+?\s*ans?'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return int(match.group(1))
    
    return 0


def extract_education(text):
    """Extrait les formations/diplômes"""
    education_keywords = [
        'licence', 'master', 'doctorat', 'ingénieur', 'bachelor', 'mba',
        'bac+', 'diplôme', 'université', 'école', 'formation'
    ]
    
    found_education = []
    lines = text.split('\n')
    
    for line in lines:
        line_lower = line.lower()
        for keyword in education_keywords:
            if keyword in line_lower:
                found_education.append(line.strip())
                break
    
    return found_education[:3]  # Maximum 3 formations


# FONCTION SUPPRIMÉE - Seul l'IA GitHub est utilisé pour le scoring
# def calculate_matching_score(cv_text, criteria_text, found_skills, experience_years): - SUPPRIMÉ


def generate_resume(found_skills, experience_years, education):
    """Génère un résumé textuel du profil"""
    resume_parts = []
    
    # Compétences
    if found_skills:
        skills_text = ", ".join(found_skills[:8])  # Max 8 compétences
        resume_parts.append(f"Compétences identifiées : {skills_text}")
    
    # Expérience
    if experience_years > 0:
        if experience_years == 1:
            resume_parts.append(f"1 an d'expérience professionnelle")
        else:
            resume_parts.append(f"{experience_years} ans d'expérience professionnelle")
    else:
        resume_parts.append("Profil junior ou débutant")
    
    # Formation
    if education:
        resume_parts.append(f"Formation : {education[0][:100]}")
    
    # Si pas assez d'infos
    if not resume_parts:
        return "Profil analysé. Informations limitées dans le CV fourni."
    
    return ". ".join(resume_parts) + "."


# FONCTION SUPPRIMÉE - Seul l'IA GitHub est utilisé pour le scoring
# def analyze_cv_with_keywords(cv_text, formation_title, formation_description): - SUPPRIMÉ
import PyPDF2
import docx2txt
import os

def extract_text_from_pdf(cv_file):
    """
    Extrait le texte d'un CV au format PDF ou DOCX.
    """
    if not os.path.exists(cv_file):
        raise FileNotFoundError(f"Le fichier {cv_file} n'existe pas.")
    
    text = ""
    if cv_file.lower().endswith('.pdf'):
        with open(cv_file, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    elif cv_file.lower().endswith('.docx'):
        text = docx2txt.process(cv_file)
    else:
        raise ValueError("Format non supporté (seulement PDF ou DOCX).")
    
    return text.strip()


# FONCTION SUPPRIMÉE - Seul l'IA GitHub est utilisé pour le scoring
# def score_cv(text): - SUPPRIMÉ


def generate_resume(text):
    """
    Génère un petit résumé du CV à partir du texte extrait.
    Pour le moment, on garde les 3 premières lignes.
    """
    lines = text.splitlines()
    resume = "\n".join(lines[:3])
    if not resume:
        resume = "Résumé non disponible."
    return resume

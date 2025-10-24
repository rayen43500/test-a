import React, { useState } from 'react';
import interviewService from '../../services/interviewService';
import './InterviewScheduler.css';

const InterviewScheduler = ({ candidat, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: '',
    heure: '',
    duree: 60,
    titre: `Entretien final - ${candidat.nom || candidat.fullname}`
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await interviewService.createInterview({
      candidat_email: candidat.email,
      candidat_nom: candidat.nom || candidat.fullname,
      candidat_id: candidat.id,
      ...formData
    });

    setLoading(false);

    if (result.success) {
      setSuccess(result.data);
      if (onSuccess) onSuccess(result.data);

      // Fermer automatiquement après 5 secondes
      setTimeout(() => {
        if (onClose) onClose();
      }, 5000);
    } else {
      setError(result.error);
    }
  };

  // Date minimale = aujourd'hui
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="interview-scheduler-overlay" onClick={onClose}>
      <div className="interview-scheduler-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📅 Planifier un entretien</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {success ? (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h3>Entretien planifié avec succès !</h3>
            <div className="meeting-details">
              <p><strong>Candidat :</strong> {candidat.nom || candidat.fullname}</p>
              <p><strong>Date :</strong> {formData.date} à {formData.heure}</p>
              <p><strong>Durée :</strong> {formData.duree} minutes</p>
              
              {success.event?.meet_link && (
                <div className="meet-link-container">
                  <p><strong>Lien Google Meet :</strong></p>
                  <a 
                    href={success.event.meet_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="meet-link"
                  >
                    🎥 Rejoindre la réunion
                  </a>
                  <button 
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(success.event.meet_link);
                      alert('Lien copié dans le presse-papier !');
                    }}
                  >
                    📋 Copier le lien
                  </button>
                </div>
              )}
            </div>
            <p className="info-text">
              ✉️ Une invitation a été envoyée par email au candidat et à vous-même.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="interview-form">
            <div className="form-group">
              <label>👤 Candidat</label>
              <input 
                type="text" 
                value={candidat.nom || candidat.fullname}
                disabled
                className="input-disabled"
              />
            </div>

            <div className="form-group">
              <label>📧 Email du candidat</label>
              <input 
                type="email" 
                value={candidat.email}
                disabled
                className="input-disabled"
              />
            </div>

            <div className="form-group">
              <label htmlFor="titre">📝 Titre de l'entretien *</label>
              <input
                type="text"
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
                placeholder="Ex: Entretien technique - Poste React Developer"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">📅 Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="heure">🕐 Heure *</label>
                <input
                  type="time"
                  id="heure"
                  name="heure"
                  value={formData.heure}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="duree">⏱️ Durée *</label>
              <select
                id="duree"
                name="duree"
                value={formData.duree}
                onChange={handleChange}
                required
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 heure</option>
                <option value="90">1h30</option>
                <option value="120">2 heures</option>
              </select>
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
              >
                {loading ? '⏳ Planification...' : '📅 Planifier l\'entretien'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InterviewScheduler;
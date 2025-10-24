import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InterviewScheduler from './InterviewScheduler';
import './CandidatList.css';

const CandidatList = () => {
  const [candidats, setCandidats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidat, setSelectedCandidat] = useState(null);
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    fetchCandidats();
  }, []);

  const fetchCandidats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/candidats/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidats(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleInterview = (candidat) => {
    setSelectedCandidat(candidat);
    setShowScheduler(true);
  };

  const handleSchedulerClose = () => {
    setShowScheduler(false);
    setSelectedCandidat(null);
  };

  const handleSchedulerSuccess = (data) => {
    console.log('Entretien planifié:', data);
    // Vous pouvez mettre à jour le statut du candidat ici
    alert('Entretien planifié avec succès ! Une invitation a été envoyée par email.');
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="candidat-list-container">
      <h2>📋 Liste des candidats présélectionnés</h2>
      
      {candidats.length === 0 ? (
        <p className="no-data">Aucun candidat présélectionné</p>
      ) : (
        <div className="candidats-grid">
          {candidats.map((candidat) => (
            <div key={candidat.id} className="candidat-card">
              <div className="candidat-header">
                <div className="candidat-avatar">
                  {candidat.photo_profile ? (
                    <img src={candidat.photo_profile} alt={candidat.fullname} />
                  ) : (
                    <div className="avatar-placeholder">
                      {candidat.fullname?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div className="candidat-info">
                  <h3>{candidat.fullname}</h3>
                  <p className="email">{candidat.email}</p>
                </div>
              </div>

              <div className="candidat-details">
                <p><strong>Poste :</strong> {candidat.poste || 'Non spécifié'}</p>
                <p><strong>Statut :</strong> 
                  <span className={`status ${candidat.statut}`}>
                    {candidat.statut || 'En attente'}
                  </span>
                </p>
              </div>

              <div className="candidat-actions">
                <button 
                  className="btn-view"
                  onClick={() => window.location.href = `/candidat/${candidat.id}`}
                >
                  👁️ Voir profil
                </button>
                <button 
                  className="btn-schedule"
                  onClick={() => handleScheduleInterview(candidat)}
                >
                  📅 Planifier entretien
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showScheduler && selectedCandidat && (
        <InterviewScheduler
          candidat={selectedCandidat}
          onClose={handleSchedulerClose}
          onSuccess={handleSchedulerSuccess}
        />
      )}
    </div>
  );
};

export default CandidatList;
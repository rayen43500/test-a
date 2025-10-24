import React, { useState, useEffect } from 'react';
import interviewService from '../../services/interviewService';
import './InterviewList.css';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    const result = await interviewService.listInterviews();

    if (result.success) {
      let items = [];

      // Possible shapes:
      // { interviews: [ ... ] }
      // [ ... ]
      // { interview: { ... } }
      // { message: '...', interview: { ... } }
      const payload = result.data;
      if (!payload) {
        items = [];
      } else if (Array.isArray(payload)) {
        items = payload;
      } else if (payload.interviews && Array.isArray(payload.interviews)) {
        items = payload.interviews;
      } else if (payload.interview) {
        items = [payload.interview];
      } else if (payload.data && Array.isArray(payload.data)) {
        items = payload.data;
      } else {
        // Fallback: try to find array-valued properties
        const maybeArray = Object.values(payload).find(v => Array.isArray(v));
        items = maybeArray || [];
      }

      // Normalize fields to what the component expects
      const normalized = items.map(i => ({
        id: i.id || i.pk || i.interview_id,
        titre: i.titre || i.title || i.formation_title || i.formation || i.meeting_type || 'Entretien',
        start: i.start || i.scheduled_date || i.scheduled_at || i.date || i.scheduledDate,
        attendees: i.attendees || i.participants || (i.candidate_name ? [i.candidate_name] : []),
        meet_link: i.meet_link || i.meeting_link || i.calendar_link || i.meetLink,
        calendar_link: i.calendar_link || i.calendarLink || null,
        raw: i
      }));

      setInterviews(normalized);
      setError('');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleCancelInterview = async (eventId, titre) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir annuler l'entretien "${titre}" ?`)) {
      return;
    }

    const result = await interviewService.cancelInterview(eventId);
    
    if (result.success) {
      alert('✅ Entretien annulé avec succès');
      fetchInterviews(); // Recharger la liste
    } else {
      alert(`❌ ${result.error}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="interview-list-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des entretiens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-list-container">
      <div className="list-header">
        <h2>📅 Mes entretiens planifiés</h2>
        <button className="btn-refresh" onClick={fetchInterviews}>
          🔄 Actualiser
        </button>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      {interviews.length === 0 ? (
        <div className="no-interviews">
          <div className="no-interviews-icon">📭</div>
          <h3>Aucun entretien planifié</h3>
          <p>Les entretiens que vous planifierez apparaîtront ici.</p>
        </div>
      ) : (
        <div className="interviews-list">
          {interviews.map((interview) => (
            <div key={interview.id} className="interview-card">
              <div className="interview-header">
                <h3>{interview.titre}</h3>
                <span className="interview-badge">À venir</span>
              </div>

              <div className="interview-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <div>
                    <strong>Date et heure</strong>
                    <p>{formatDate(interview.start)}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">👥</span>
                  <div>
                    <strong>Participants</strong>
                    <p>{interview.attendees?.join(', ') || 'N/A'}</p>
                  </div>
                </div>

                {interview.meet_link && (
                  <div className="detail-item meet-link-item">
                    <span className="detail-icon">🎥</span>
                    <div>
                      <strong>Lien Google Meet</strong>
                      <a 
                        href={interview.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meet-link-btn"
                      >
                        Rejoindre la réunion
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="interview-actions">
                {interview.calendar_link && (
                  <a 
                    href={interview.calendar_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-calendar"
                  >
                    📆 Voir dans Calendar
                  </a>
                )}
                <button 
                  className="btn-cancel-interview"
                  onClick={() => handleCancelInterview(interview.id, interview.titre)}
                >
                  ❌ Annuler
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewList;
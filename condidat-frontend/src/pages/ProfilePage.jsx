import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfilePictureUpload from './ProfilePictureUpload';
import './profilepage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/accounts/profile/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setProfile(response.data);
    } catch (err) {
      setError('Impossible de récupérer le profil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-large"></div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  if (error) return <p className="message message-error">{error}</p>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>{profile.fullname}</h1>
          <p className="subtitle">{profile.email}</p>
          <span className={`role-badge role-${profile.role.toLowerCase()}`}>{profile.role}</span>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Informations personnelles</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Numéro de téléphone</label>
              <p>{profile.phone_number || '-'}</p>
            </div>
            <div className="info-item">
              <label>Date de naissance</label>
              <p>{profile.birthdate || '-'}</p>
            </div>
            <div className="info-item">
              <label>Genre</label>
              <p>{profile.gender || '-'}</p>
            </div>
            <div className="info-item full-width">
              <label>Adresse</label>
              <p>{profile.address || '-'}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Photo de profil</h2>
          <ProfilePictureUpload
            currentPhoto={profile.photo_profile}
            onUploadSuccess={fetchProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

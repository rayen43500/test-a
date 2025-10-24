import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePictureUpload.css";

const ProfilePictureUpload = ({ token }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Charger la photo actuelle
  useEffect(() => {
    axios
      .get("/api/users/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfilePhoto(res.data.photo_profile))
      .catch((err) => console.error(err));
  }, [token]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("photo_profile", selectedFile);

    try {
      const res = await axios.patch("/api/users/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setProfilePhoto(res.data.photo_profile);
      alert("✅ Photo mise à jour !");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l’upload");
    }
  };

  return (
    <div className="profile-picture-upload">
      <div className="upload-container">
        <div className="preview-section">
          {profilePhoto ? (
            <div className="image-preview">
              <img src={`http://127.0.0.1:8000${profilePhoto}`} alt="Profil" />
            </div>
          ) : (
            <div className="no-image">
              <p>Aucune photo</p>
            </div>
          )}
        </div>

        <div className="upload-section">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleUpload} className="btn btn-primary">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;

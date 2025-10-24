import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginButton = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/google/",
        { token: credentialResponse.credential }
      );
      localStorage.setItem("access", response.data.tokens.access);
      alert(`Bienvenue ${response.data.user.fullname}`);
    } catch (error) {
      console.error(error);
      alert("Erreur Google");
    }
  };

  return (
    <GoogleOAuthProvider clientId="TON_CLIENT_ID_GOOGLE">
      <GoogleLogin onSuccess={handleSuccess} onError={() => alert("Erreur Google")} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;

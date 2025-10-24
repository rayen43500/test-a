import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/reset-password-confirm/", {
        uidb64: uid,
        token: token,
        new_password: password,
      });
      setMessage("✅ Mot de passe réinitialisé avec succès !");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("❌ Erreur : lien invalide ou expiré.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-96 transform perspective-1000 hover:rotate-y-2 hover:rotate-x-1 transition-transform duration-500">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Réinitialiser le mot de passe
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 rounded-xl border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 transition placeholder-gray-400"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Chargement..." : "Valider"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-4 font-medium ${
              message.includes("succès") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

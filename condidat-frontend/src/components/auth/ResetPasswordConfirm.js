import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPasswordConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.new_password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/reset-password-confirm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          token,
          new_password: formData.new_password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.error || "Le lien est invalide ou expiré.");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-md w-full text-center transform transition-transform duration-700 hover:-translate-y-1 hover:scale-[1.02]">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Mot de passe réinitialisé !</h2>
          <p className="text-gray-600 mb-6">
            Votre mot de passe a été modifié avec succès. Vous serez redirigé vers la page de connexion...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-md w-full transform transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-500 text-sm">Créez un mot de passe sécurisé pour votre compte</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 shadow-inner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {["new_password", "confirm_password"].map((field, index) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {index === 0 ? "Nouveau mot de passe" : "Confirmer le mot de passe"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  placeholder={
                    index === 0
                      ? "Minimum 8 caractères"
                      : "Retapez votre mot de passe"
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
                {index === 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Réinitialisation..." : "🔒 Réinitialiser le mot de passe"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
          >
            ← Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}

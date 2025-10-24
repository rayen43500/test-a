import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Échec de connexion. Vérifiez vos identifiants.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError("Aucun token Google reçu.");
      return;
    }
    try {
      const token = credentialResponse.credential;
      const response = await axios.post("/api/auth/google/", { token });
      await login(response.data.user.email, response.data.tokens.access);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Erreur Google OAuth :", err);
      setError("Échec de la connexion avec Google.");
    }
  };

  const handleGoogleFailure = () => setError("Échec de la connexion avec Google.");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 transform perspective-1000 hover:rotate-y-2 hover:rotate-x-1 transition-transform duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <LockClosedIcon className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Connexion à votre compte</h2>
          <p className="text-sm text-gray-500">
            Accédez à votre espace personnel ou{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-700 font-medium">créez un compte</Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md shadow-inner">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="exemple@domaine.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 shadow-inner placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Connexion...</div> : "Se connecter"}
          </button>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700 hover:underline">Mot de passe oublié ?</Link>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-2">Ou continuez avec :</p>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} width="100%" />
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  EyeIcon,
  EyeSlashIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const CandidatRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    fullname: "",
    role: "Candidat",
    phone_number: "",
    skills: "",
    annees_experience: "",
    bio: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Nom d'utilisateur requis";
    if (!formData.email.trim()) newErrors.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Mot de passe requis";
    else if (formData.password.length < 8) newErrors.password = "Au moins 8 caractères requis";
    if (formData.password !== formData.password_confirm) newErrors.password_confirm = "Les mots de passe ne correspondent pas";
    if (!formData.fullname.trim()) newErrors.fullname = "Nom complet requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (error) {
      setErrors({ general: error.message || "Échec de l'inscription." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-3xl w-full transform perspective-1000 hover:rotate-y-2 transition-transform duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <UserGroupIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Créer un compte Candidat</h1>
          <p className="text-gray-500 text-sm mt-2">
            Rejoignez notre plateforme et démarrez votre parcours professionnel.
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-inner text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom complet et username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom complet *</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner focus:ring-2 focus:ring-green-300 focus:border-green-300 transition"
                placeholder="Votre nom complet"
              />
              {errors.fullname && <p className="text-red-600 text-sm mt-1">{errors.fullname}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner focus:ring-2 focus:ring-green-300 focus:border-green-300 transition"
                placeholder="Nom d'utilisateur"
              />
              {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
            </div>
          </div>

          {/* Email et téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner focus:ring-2 focus:ring-green-300 focus:border-green-300 transition"
                placeholder="exemple@email.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner focus:ring-2 focus:ring-green-300 focus:border-green-300 transition"
                placeholder="+216..."
              />
            </div>
          </div>

          {/* Compétences et années expérience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Compétences</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner focus:ring-2 focus:ring-green-300 focus:border-green-300 transition"
                placeholder="React, Python..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Années d'expérience</label>
              <input
                type="number"
                name="annees_experience"
                min="0"
                value={formData.annees_experience}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner focus:ring-2 focus:ring-green-300 focus:border-green-300 transition"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio professionnelle</label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner focus:ring-2 focus:ring-green-300 focus:border-green-300 transition"
              placeholder="Décrivez votre parcours..."
            />
          </div>

          {/* Mot de passe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Mot de passe *</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 shadow-inner focus:ring-2 focus:ring-green-300 focus:border-green-300 transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe *</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 shadow-inner focus:ring-2 focus:ring-green-300 focus:border-green-300 transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
              {errors.password_confirm && <p className="text-red-600 text-sm mt-1">{errors.password_confirm}</p>}
            </div>
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {isLoading ? "Création du compte..." : "Créer le compte candidat"}
          </button>
        </form>

        {/* Liens */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Vous êtes recruteur ?{" "}
            <Link to="/register/recruteur" className="text-purple-600 hover:text-purple-700 font-medium">
              Inscrivez-vous ici
            </Link>
          </p>
          <p className="mt-2">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidatRegister;

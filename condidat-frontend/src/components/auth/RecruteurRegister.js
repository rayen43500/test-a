import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { EyeIcon, EyeSlashIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const RecruteurRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    fullname: "",
    role: "Recruteur",
    phone_number: "",
    bio: "",
    website: "",
    linkedin_url: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username requis";
    if (!formData.email.trim()) newErrors.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Mot de passe requis";
    else if (formData.password.length < 8)
      newErrors.password = "Minimum 8 caractères";
    if (formData.password !== formData.password_confirm)
      newErrors.password_confirm = "Les mots de passe ne correspondent pas";
    if (!formData.fullname.trim()) newErrors.fullname = "Nom requis";
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
      if (error.username) setErrors({ username: error.username[0] });
      else if (error.email) setErrors({ email: error.email[0] });
      else
        setErrors({
          general: error.message || "Échec de l'inscription. Réessayez.",
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-3xl w-full transform perspective-1000 hover:rotate-y-2 hover:rotate-x-1 transition-transform duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <BriefcaseIcon className="h-10 w-10 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Créer un compte Recruteur
          </h2>
          <p className="text-gray-500 text-sm">
            Trouvez les meilleurs candidats pour votre entreprise
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 shadow-inner">
            {errors.general}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet / Entreprise *
              </label>
              <input
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                placeholder="Votre nom ou entreprise"
                required
              />
              {errors.fullname && (
                <p className="text-sm text-red-600 mt-1">{errors.fullname}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur *
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                placeholder="Nom d'utilisateur"
                required
              />
              {errors.username && (
                <p className="text-sm text-red-600 mt-1">{errors.username}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email professionnel *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                placeholder="exemple@entreprise.com"
                required
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                placeholder="+216 12 345 678"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site web
              </label>
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                placeholder="https://votreentreprise.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profil LinkedIn
              </label>
              <input
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                placeholder="https://linkedin.com/in/votreprofil"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description de l’entreprise
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
              placeholder="Présentez votre entreprise..."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 shadow-inner text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                placeholder="********"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe *
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 shadow-inner text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                placeholder="********"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {errors.password_confirm && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password_confirm}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Création du compte..." : "Créer un compte recruteur"}
          </button>

          <div className="text-center mt-6 text-sm text-gray-600">
            Vous êtes candidat ?{" "}
            <Link
              to="/register/candidat"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Inscrivez-vous ici
            </Link>
            <br />
            <Link
              to="/login"
              className="text-purple-500 hover:text-purple-700 font-medium"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruteurRegister;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Une erreur est survenue.');
      }
    } catch {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] backdrop-blur-sm p-10 max-w-md w-full text-center transform transition-all hover:scale-[1.02]">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-4">
            Email envoyé avec succès 🎉
          </h2>
          <p className="text-gray-600 mb-8">
            Consultez votre boîte mail pour réinitialiser votre mot de passe.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] backdrop-blur-sm p-10 max-w-md w-full transform transition-all hover:scale-[1.02]">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m0 0l4-4m-4 4l4 4" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Mot de passe oublié
          </h1>
          <p className="text-gray-600">
            Entrez votre adresse email pour recevoir un lien sécurisé.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-xl shadow-sm">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="exemple@domaine.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.03] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-indigo-700 text-sm font-medium transition-all"
          >
            ← Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}

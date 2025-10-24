import React, { useState } from 'react';
import { courseService } from '../../services/courseService';

const GeminiCVAnalysisTest = () => {
  const [applicationId, setApplicationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!applicationId) {
      setError('Veuillez entrer un ID d\'application');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/test/gemini-cv-analysis/${applicationId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Erreur lors de l\'analyse');
      }
    } catch (err) {
      setError('Erreur de connexion: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetResults = async () => {
    if (!applicationId) {
      setError('Veuillez entrer un ID d\'application');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/test/gemini-cv-analysis/${applicationId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Erreur lors de la récupération');
      }
    } catch (err) {
      setError('Erreur de connexion: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🧪 Test d'Analyse CV avec Gemini
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ID de l'Application
        </label>
        <input
          type="number"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Entrez l'ID de l'application"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyse en cours...' : '🚀 Analyser le CV'}
        </button>
        
        <button
          onClick={handleGetResults}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Chargement...' : '📊 Voir les résultats'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <strong>❌ Erreur:</strong> {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <strong>✅ Analyse terminée!</strong>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de base */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">📋 Informations</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Application ID:</strong> {result.application_id}</p>
                <p><strong>Formation:</strong> {result.formation_title}</p>
                <p><strong>Candidat:</strong> {result.candidate_name}</p>
                <p><strong>Modèle Gemini:</strong> {result.gemini_model}</p>
                <p><strong>Succès:</strong> {result.success ? '✅' : '❌'}</p>
              </div>
            </div>

            {/* Score CV */}
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">🎯 Score CV</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {result.cv_score || 0}/100
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${result.cv_score || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé */}
          {result.cv_summary && (
            <div className="bg-yellow-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">📝 Résumé</h3>
              <p className="text-gray-700">{result.cv_summary}</p>
            </div>
          )}

          {/* Analyse détaillée */}
          {result.cv_analysis && Object.keys(result.cv_analysis).length > 0 && (
            <div className="bg-purple-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">🔍 Analyse Détaillée</h3>
              <div className="space-y-4">
                {result.cv_analysis.strengths && (
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">✅ Points Forts:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {result.cv_analysis.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.cv_analysis.weaknesses && (
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">⚠️ Points Faibles:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {result.cv_analysis.weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.cv_analysis.recommendations && (
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">💡 Recommandations:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {result.cv_analysis.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aperçu du texte CV */}
          {result.cv_text_preview && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">📄 Aperçu du CV</h3>
              <div className="bg-white p-3 rounded border text-sm text-gray-700 max-h-40 overflow-y-auto">
                {result.cv_text_preview}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeminiCVAnalysisTest;

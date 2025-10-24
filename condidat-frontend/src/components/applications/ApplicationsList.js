import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCourses } from '../../contexts/CourseContext';
import { CheckCircleIcon, XCircleIcon, EyeIcon, AcademicCapIcon, UserIcon, DocumentIcon, CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import InterviewSchedulingModal from './InterviewSchedulingModal';
import api from '../../services/api';

// ✅ Skeleton loader
const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-20"></div>
    </div>
    <div className="h-20 bg-gray-100 rounded mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
      <div className="flex space-x-2">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

// Modal d'analyse CV avec Gemini
const CVAnalysisModal = ({ isOpen, onClose, result }) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            🧪 Analyse CV avec Gemini
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className={`p-4 rounded-md ${result.success ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
            <div className="flex items-center">
              {result.success ? (
                <CheckCircleIcon className="w-5 h-5 mr-2" />
              ) : (
                <XCircleIcon className="w-5 h-5 mr-2" />
              )}
              <span className="font-medium">
                {result.success ? 'Analyse réussie !' : 'Erreur lors de l\'analyse'}
              </span>
            </div>
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-sm text-gray-600 mt-2">
                  {result.cv_score >= 80 ? 'Excellent' : 
                   result.cv_score >= 60 ? 'Bon' : 
                   result.cv_score >= 40 ? 'Moyen' : 'À améliorer'}
                </p>
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
                {result.cv_analysis.strengths && result.cv_analysis.strengths.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">✅ Points Forts:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {result.cv_analysis.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.cv_analysis.weaknesses && result.cv_analysis.weaknesses.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">⚠️ Points Faibles:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {result.cv_analysis.weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.cv_analysis.recommendations && result.cv_analysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">💡 Recommandations:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {result.cv_analysis.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.cv_analysis.missing_skills && result.cv_analysis.missing_skills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-orange-700 mb-2">🔍 Compétences Manquantes:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {result.cv_analysis.missing_skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.cv_analysis.excellent_skills && result.cv_analysis.excellent_skills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">⭐ Compétences Excellentes:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {result.cv_analysis.excellent_skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.cv_analysis.match_percentage && (
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">🎯 Correspondance avec l'offre:</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${result.cv_analysis.match_percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {result.cv_analysis.match_percentage}%
                      </span>
                    </div>
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

          {/* Erreur si présente */}
          {result.error && (
            <div className="bg-red-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2 text-red-800">❌ Erreur</h3>
              <p className="text-red-700">{result.error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

const ApplicationsList = () => {
  console.log('🔵 [ApplicationsList] Composant rendu');
  
  const { user } = useAuth();
  const { getApplications, approveApplication, rejectApplication } = useCourses();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'pending',
    formation: ''
  });
  const [processingApplication, setProcessingApplication] = useState(null);
  const [schedulingModal, setSchedulingModal] = useState({ open: false, application: null });
  const [showCVAnalysisModal, setShowCVAnalysisModal] = useState(false);
  const [cvAnalysisResult, setCVAnalysisResult] = useState(null);

  console.log('🔵 [ApplicationsList] User:', user?.username, 'Role:', user?.role);
  console.log('🔵 [ApplicationsList] Filters:', filters);

  const fetchApplications = useCallback(async () => {
    console.log('🚀 [ApplicationsList] fetchApplications APPELÉ !');
    console.log('📋 [ApplicationsList] Filters actuels:', filters);
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('📤 [ApplicationsList] Appel getApplications...');
      const data = await getApplications(filters);
      
      console.log('✅ [ApplicationsList] Données reçues:', data);
      console.log('📊 [ApplicationsList] Nombre d\'applications:', data?.results?.length || data?.length || 0);
      
      // Amélioration de la gestion des données
      const applicationsData = data?.results || data || [];
      console.log('📋 [ApplicationsList] Applications à afficher:', applicationsData.length);
      
      setApplications(applicationsData);
    } catch (err) {
      console.error('❌ [ApplicationsList] Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('🏁 [ApplicationsList] Fin chargement');
    }
  }, [filters.status, filters.formation]);

  useEffect(() => {
    console.log('🔄 [ApplicationsList] useEffect déclenché');
    console.log('👤 [ApplicationsList] User check:', {
      exists: !!user,
      role: user?.role,
      isRecruteur: user?.role === 'Recruteur',
      isAdmin: user?.role === 'Admin'
    });
    
    if (user && (user.role === 'Recruteur' || user.role === 'Admin')) {
      console.log('✅ [ApplicationsList] User autorisé, lancement fetchApplications...');
      fetchApplications();
    } else {
      console.warn('⚠️ [ApplicationsList] User non autorisé ou absent');
      setLoading(false);
    }
  }, [user]);

  // Effet séparé pour les changements de filtres (sauf formation qui a son propre debounce)
  useEffect(() => {
    if (user && (user.role === 'Recruteur' || user.role === 'Admin')) {
      console.log('🔍 [ApplicationsList] Statut changé, rechargement...');
      fetchApplications();
    }
  }, [filters.status]);

  const handleApprove = async (applicationId) => {
    try {
      console.log('🟢 [ApplicationsList] Approbation:', applicationId);
      setProcessingApplication(applicationId);
      
      // Vérifier et rafraîchir le token si nécessaire
      let token = localStorage.getItem('access_token');
      
      // Si pas de token, essayer de se reconnecter
      if (!token) {
        console.log('⚠️ Pas de token trouvé, tentative de reconnexion...');
        // Ici on pourrait implémenter une reconnexion automatique
        // Pour l'instant, on utilise l'endpoint sans authentification
      }
      
      // Appeler l'API pour approuver et récupérer les détails
      const response = await fetch(`http://127.0.0.1:8000/api/applications/${applicationId}/approve/`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Ouvrir la modal de planification avec les détails
        setSchedulingModal({
          open: true,
          application: data.application
        });
        
        // Mettre à jour l'état local
        setApplications(prev => prev.map(app => 
          app.id === applicationId ? { ...app, status: 'approved' } : app
        ));

        if (filters.status === 'pending') {
          setApplications(prev => prev.filter(app => app.id !== applicationId));
        }
        
        console.log('✅ Application approuvée avec succès');
      } else if (response.status === 401) {
        // Token invalide ou expiré
        console.log('⚠️ Token invalide, suppression du token...');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Rediriger vers la page de connexion ou afficher un message
        alert('Session expirée. Veuillez vous reconnecter.');
        // window.location.href = '/login';
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve application');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Failed to approve: ' + err.message);
    } finally {
      setProcessingApplication(null);
    }
  };

  const handleReject = async (applicationId) => {
    const reason = prompt('Reason for rejection (optional):');

    try {
      console.log('🔴 [ApplicationsList] Rejet:', applicationId);
      setProcessingApplication(applicationId);
      await rejectApplication(applicationId, reason || 'Not suitable');

      setApplications(prev => prev.map(app =>
        app.id === applicationId ? { ...app, status: 'rejected' } : app
      ));

      if (filters.status === 'pending') {
        setApplications(prev => prev.filter(app => app.id !== applicationId));
      }
      
      alert('❌ Application rejected');
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Failed to reject: ' + err.message);
    } finally {
      setProcessingApplication(null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log('🔍 [ApplicationsList] Filter change:', name, '=', value);
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testCVAnalysis = async (applicationId) => {
    try {
      console.log('🧪 [TestCVAnalysis] Début du test Gemini pour l\'application:', applicationId);
      
      // Utiliser l'endpoint de simulation frontend pour l'analyse CV
      const response = await fetch(`http://127.0.0.1:8000/api/test/gemini-frontend-sim/${applicationId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [GeminiCVAnalysis] Résultat:', data);
        
        // Afficher le dialogue modal avec les résultats
        setCVAnalysisResult(data);
        setShowCVAnalysisModal(true);
        
        // Rafraîchir la liste des applications
        fetchApplications();
      } else {
        const error = await response.json();
        console.error('❌ [GeminiCVAnalysis] Erreur:', error);
        
        // Afficher l'erreur dans le modal aussi
        const errorResult = {
          success: false,
          error: error.error || 'Erreur inconnue',
          application_id: applicationId,
          cv_score: 0,
          cv_analysis: {},
          cv_summary: 'Erreur lors de l\'analyse',
          gemini_model: 'N/A'
        };
        
        setCVAnalysisResult(errorResult);
        setShowCVAnalysisModal(true);
      }
    } catch (err) {
      console.error('❌ [GeminiCVAnalysis] Erreur:', err);
      
      // Afficher l'erreur dans le modal aussi
      const errorResult = {
        success: false,
        error: `Erreur de connexion: ${err.message}`,
        application_id: applicationId,
        cv_score: 0,
        cv_analysis: {},
        cv_summary: 'Erreur de connexion',
        gemini_model: 'N/A'
      };
      
      setCVAnalysisResult(errorResult);
      setShowCVAnalysisModal(true);
    }
  };

  const handleScheduleInterview = async (interviewData) => {
    try {
      console.log('📅 [ApplicationsList] Planification entretien:', interviewData);
      
      // Appeler l'API via axios api (baseURL défini dans services/api.js)
      const payload = {
        application_id: interviewData.application.id,
        date: interviewData.date,
        time: interviewData.time,
        duration: interviewData.duration,
        meetingType: interviewData.meetingType,
        notes: interviewData.notes
      };

      const { data } = await api.post('/interviews/schedule/', payload);
      if (data) {
        alert('✅ Entretien planifié avec succès !');
        setSchedulingModal({ open: false, application: null });
      }
    } catch (err) {
      console.error('❌ Error scheduling interview:', err);
      alert('Erreur lors de la planification: ' + err.message);
    }
  };

  // Debounce pour le champ de recherche
  useEffect(() => {
    if (filters.formation) {
      const timeoutId = setTimeout(() => {
        console.log('🔍 [ApplicationsList] Recherche avec debounce:', filters.formation);
        if (user && (user.role === 'Recruteur' || user.role === 'Admin')) {
          fetchApplications();
        }
      }, 500); // 500ms de délai

      return () => clearTimeout(timeoutId);
    }
  }, [filters.formation]);

  console.log('🎨 [ApplicationsList] État actuel:', {
    loading,
    error,
    applicationsCount: applications.length,
    user: user?.username
  });

  // Vérification des permissions
  if (!user || (user.role !== 'Recruteur' && user.role !== 'Admin')) {
    console.warn('🚫 [ApplicationsList] Accès refusé');
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">
            You don't have permission to view applications.
            Only recruiters and administrators can review applications.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    console.log('⏳ [ApplicationsList] Affichage skeleton loader');
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Course Applications</h1>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    console.error('💥 [ApplicationsList] Affichage erreur:', error);
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  console.log('📋 [ApplicationsList] Affichage de', applications.length, 'applications');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Course Applications</h1>
        <Link
          to="/formations"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Formations
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Filtres</h2>
          <div className="text-sm text-gray-500">
            📊 {applications.length} candidature(s) trouvée(s)
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvées</option>
              <option value="rejected">Rejetées</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Formation</label>
            <input
              type="text"
              name="formation"
              value={filters.formation}
              onChange={handleFilterChange}
              placeholder="Rechercher par nom de formation..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-500">
              Les filtres s'appliquent automatiquement
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-20 bg-gray-100 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading applications</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchApplications}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : applications.length > 0 ? (
          applications.map((application) => {
            const isApproved = application.status === 'approved';
            const isPending = application.status === 'pending';
            
            return (
              <div key={application.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {application.formation_title || 'Formation sans titre'}
                      </h2>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <UserIcon className="h-4 w-4 mr-1" />
                        <span className="mr-4 font-medium">{application.candidate_name || 'Candidat inconnu'}</span>
                        <span className="text-gray-500">{application.candidate_email || 'Email non disponible'}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>Applied: {application.created_at ? format(new Date(application.created_at), 'MMM dd, yyyy') : 'Date inconnue'}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        isApproved ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>

                      {application.quiz_score !== null && application.quiz_score !== undefined && (
                        <div className="flex items-center text-sm text-gray-600">
                          <AcademicCapIcon className="h-4 w-4 mr-1" />
                          <span>Quiz: {application.quiz_score}%</span>
                        </div>
                      )}
                      {application.cv_score !== null && application.cv_score !== undefined && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>CV: {application.cv_score}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {application.application_message && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Message du candidat:</h4>
                      <p className="text-sm text-gray-600">{application.application_message}</p>
                    </div>
                  )}

                  {/* Informations supplémentaires */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {application.cv && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DocumentIcon className="h-4 w-4 mr-2" />
                        <span>CV fourni</span>
                      </div>
                    )}
                    {application.quiz_score !== undefined && (
                      <div className="flex items-center text-sm text-gray-600">
                        <AcademicCapIcon className="h-4 w-4 mr-2" />
                        <span>Score quiz: {application.quiz_score}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleReject(application.id)}
                          disabled={processingApplication === application.id}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(application.id)}
                          disabled={processingApplication === application.id}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => testCVAnalysis(application.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded text-blue-700 bg-white hover:bg-blue-50"
                        >
                          🧪 Test CV
                        </button>
                      </>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      to={`/formations/${application.formation}`}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Formation Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.status === 'pending' 
                ? 'Aucune candidature en attente' 
                : 'Aucune candidature trouvée'
              }
            </h3>
            <p className="text-gray-500 mb-4">
              {filters.status === 'pending'
                ? 'Il n\'y a actuellement aucune candidature en attente de traitement.'
                : 'Aucune candidature ne correspond à vos critères de recherche.'
              }
            </p>
            {filters.status || filters.formation ? (
              <button
                onClick={() => setFilters({ status: '', formation: '' })}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
              >
                Effacer les filtres
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Modal de planification d'entretien */}
      <InterviewSchedulingModal
        isOpen={schedulingModal.open}
        onClose={() => setSchedulingModal({ open: false, application: null })}
        application={schedulingModal.application}
        onSchedule={handleScheduleInterview}
      />

      {/* Modal d'analyse CV avec Gemini */}
      <CVAnalysisModal
        isOpen={showCVAnalysisModal}
        onClose={() => setShowCVAnalysisModal(false)}
        result={cvAnalysisResult}
      />
    </div>
  );
};

export default ApplicationsList;
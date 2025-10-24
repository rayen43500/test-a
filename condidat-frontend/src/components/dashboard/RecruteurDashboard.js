import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import interviewService from '../../services/interviewService';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  CalendarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

const RecruteurDashboard = () => {
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingInterviews();
    fetchPendingApplications();
  }, []);

  const fetchUpcomingInterviews = async () => {
    setInterviewsLoading(true);
    const result = await interviewService.listInterviews();
    if (result.success) {
      const interviews = result.data.interviews || [];
      setUpcomingInterviews(interviews.slice(0, 3));
    }
    setInterviewsLoading(false);
  };

  const fetchPendingApplications = async () => {
    setApplicationsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/courses/applications/?status=pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const stats = [
    {
      name: 'Mes Formations',
      value: '2',
      icon: AcademicCapIcon,
      color: 'from-yellow-300 to-yellow-400',
      link: '/recruiter/formations',
    },
    {
      name: 'Candidatures en attente',
      value: applications.length.toString(),
      icon: DocumentTextIcon,
      color: 'from-purple-300 to-purple-400',
      link: '/applications',
    },
    {
      name: 'Entretiens',
      value: upcomingInterviews.length.toString(),
      icon: CalendarIcon,
      color: 'from-indigo-300 to-indigo-400',
      link: '/recruiter/entretiens',
    },
  ];

  const formatInterviewDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Demain à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-10 p-6 bg-gradient-to-b from-indigo-50 to-white rounded-3xl shadow-lg">
      {/* Message de bienvenue */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-50 border border-indigo-200 rounded-2xl p-5 shadow-md">
        <div className="flex items-start">
          <BriefcaseIcon className="h-6 w-6 text-indigo-600 mt-1" />
          <div className="ml-3">
            <h3 className="text-base font-semibold text-indigo-800">
              Bienvenue dans votre espace recruteur 👋
            </h3>
            <p className="mt-1 text-sm text-indigo-700">
              Gérez vos formations, suivez les candidatures et planifiez vos entretiens efficacement.
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all border border-gray-100"
          >
            <div className={`absolute top-4 left-4 bg-gradient-to-r ${stat.color} p-3 rounded-xl shadow-md`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 text-sm font-medium text-gray-500">{stat.name}</p>
            <p className="ml-16 mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Candidatures en attente */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-indigo-800">Candidatures en attente</h3>
            <SparklesIcon className="h-5 w-5 text-purple-500" title="Analysées par IA" />
          </div>
          <Link to="/applications" className="text-sm text-indigo-600 hover:underline">
            Voir tout →
          </Link>
        </div>

        {applicationsLoading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Chargement...</p>
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{app.candidate_name}</h4>
                    <p className="text-sm text-gray-600">{app.formation_title}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    <ClockIcon className="h-3 w-3 mr-1" /> En attente
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Score Quiz</p>
                    <p className={`text-xl font-bold ${getScoreColor(app.quiz_score || 0)}`}>
                      {app.quiz_score || 0}%
                    </p>
                  </div>

                  {app.has_ai_analysis && (
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <SparklesIcon className="h-3 w-3 text-purple-500" /> Score IA
                      </p>
                      <p className={`text-xl font-bold ${getScoreColor(app.cv_score || 0)}`}>
                        {app.cv_score || 0}%
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Score global</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreBadge(Math.round(((app.quiz_score || 0) + (app.cv_score || 0)) / 2))}`}>
                    {Math.round(((app.quiz_score || 0) + (app.cv_score || 0)) / 2)}%
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/applications/${app.id}`}
                    className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
                  >
                    Voir détails
                  </Link>
                  <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md">
                    <CheckCircleIcon className="h-4 w-4" />
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md">
                    <XCircleIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune candidature en attente</h3>
            <p className="mt-1 text-sm text-gray-500">Les nouvelles candidatures apparaîtront ici.</p>
          </div>
        )}
      </div>

      {/* Prochains entretiens */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-indigo-800">Prochains Entretiens</h3>
          <Link to="/recruiter/entretiens" className="text-sm text-indigo-600 hover:underline">
            Voir tout →
          </Link>
        </div>

        {interviewsLoading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Chargement...</p>
          </div>
        ) : upcomingInterviews.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {upcomingInterviews.map((interview) => (
              <li key={interview.id} className="py-4">
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{interview.titre}</p>
                    <p className="text-xs text-gray-500 mt-1">📅 {formatInterviewDate(interview.start)}</p>
                    {interview.meet_link && (
                      <a
                        href={interview.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-2 text-xs text-indigo-600 hover:underline"
                      >
                        🎥 Rejoindre la réunion
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun entretien planifié</h3>
            <p className="mt-1 text-sm text-gray-500">
              Acceptez une candidature pour planifier un entretien.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruteurDashboard;

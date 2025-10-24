import React, { useState } from 'react';
import { XMarkIcon, CalendarIcon, ClockIcon, UserIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const InterviewSchedulingModal = ({ isOpen, onClose, application, onSchedule }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 60,
    meetingType: 'online',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const interviewData = {
      ...formData,
      application: application,
      candidate: application.candidate,
      formation: application.formation
    };
    onSchedule(interviewData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-6 w-6" />
            <div>
              <h3 className="text-xl font-semibold">Planifier un entretien</h3>
              <p className="text-blue-100 text-sm">Candidat approuvé</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Candidat Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Informations du candidat
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Nom:</span>
                <p className="text-gray-900">{application.candidate.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <p className="text-gray-900">{application.candidate.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Téléphone:</span>
                <p className="text-gray-900">{application.candidate.phone || 'Non renseigné'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Score CV:</span>
                <p className="text-gray-900 font-semibold">{application.cv_score || 0}%</p>
              </div>
            </div>
          </div>

          {/* Formation Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Formation
            </h4>
            <div className="text-sm">
              <div className="mb-2">
                <span className="font-medium text-gray-600">Titre:</span>
                <p className="text-gray-900">{application.formation.title}</p>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-600">Instructeur:</span>
                <p className="text-gray-900">{application.formation.instructor}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Description:</span>
                <p className="text-gray-900">{application.formation.description}</p>
              </div>
            </div>
          </div>

          {/* Formulaire de planification */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de l'entretien
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (minutes)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 heure</option>
                  <option value={90}>1h30</option>
                  <option value={120}>2 heures</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'entretien
                </label>
                <select
                  value={formData.meetingType}
                  onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="online">En ligne (Teams/Zoom)</option>
                  <option value="phone">Téléphonique</option>
                  <option value="in-person">En présentiel</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Points à aborder, questions spécifiques..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Planifier l'entretien
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedulingModal;

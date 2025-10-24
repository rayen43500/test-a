import React, { useState, useEffect, useCallback } from 'react';
import authService from '../../services/authService'; // import par défaut
import {
  UsersIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtrage des utilisateurs
  const filterUsers = useCallback(() => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  // Récupération des utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const usersData = await authService.getUsers();
      setUsers(usersData);
    } catch (error) {
      let errorMessage = 'Impossible de récupérer les utilisateurs';
      if (error.message && error.message.includes('403')) {
        errorMessage = 'Accès refusé. Vous devez être administrateur.';
      } else if (error.message && error.message.includes('401')) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) return;
    try {
      setIsDeleting(true);
      setError('');
      await authService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setShowUserModal(false);
    } catch (error) {
      setError('Impossible de supprimer l’utilisateur : ' + (error.message || 'Erreur inconnue'));
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800';
      case 'Recruteur':
        return 'bg-purple-100 text-purple-800';
      case 'Candidat':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-blue-100 via-white to-blue-200 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm shadow-md rounded-2xl p-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
          <div>
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-2 text-sm font-medium text-red-800 hover:text-red-700"
            >
              Réessayer →
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-2xl p-4 mb-6 hover:-translate-y-1 transition-transform">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="sm:w-48 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="">Tous les rôles</option>
            <option value="Admin">Admin</option>
            <option value="Recruteur">Recruteur</option>
            <option value="Candidat">Candidat</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-2xl overflow-hidden hover:-translate-y-0.5 transition-transform">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Utilisateurs ({filteredUsers.length})
            </h3>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscrit le</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            {user.fullname?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.fullname}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.date_joined)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                        <button onClick={() => handleViewUser(user)} className="text-blue-600 hover:text-blue-900 p-1">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 p-1">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || roleFilter ? 'Essayez de modifier vos critères de recherche.' : "Aucun utilisateur n'a été enregistré."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal utilisateur */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Détails de l'utilisateur</h3>
              <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Fermer</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-xl font-medium text-white">
                  {selectedUser.fullname?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedUser.fullname}</h4>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.username || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expérience</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.annees_experience ? `${selectedUser.annees_experience} ans` : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.is_active ? 'Actif' : 'Inactif'}</p>
                </div>
              </div>

              {selectedUser.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.bio}</p>
                </div>
              )}

              {selectedUser.skills && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Compétences</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.skills}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;


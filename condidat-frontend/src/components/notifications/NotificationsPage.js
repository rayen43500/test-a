import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';
import useNotifications from '../../hooks/useNotifications';

const NotificationsPage = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_approved':
        return '✅';
      case 'application_rejected':
        return '❌';
      case 'application_submitted':
        return '📝';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'application_approved':
        return 'border-l-4 border-green-500 bg-green-50';
      case 'application_rejected':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'application_submitted':
        return 'border-l-4 border-blue-500 bg-blue-50';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'read') return notification.is_read;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">
          {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You\'re all caught up!'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`pb-2 px-1 font-medium text-sm transition-colors ${
              filter === 'all'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`pb-2 px-1 font-medium text-sm transition-colors ${
              filter === 'unread'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`pb-2 px-1 font-medium text-sm transition-colors ${
              filter === 'read'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <CheckIcon className="h-5 w-5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-16">
          <BellIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">
            {filter === 'unread' && 'You have no unread notifications'}
            {filter === 'read' && 'You have no read notifications'}
            {filter === 'all' && 'You don\'t have any notifications yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md ${
                !notification.is_read ? 'ring-2 ring-blue-100' : ''
              }`}
            >
              <div className={`p-6 ${getNotificationColor(notification.notification_type)}`}>
                <div className="flex items-start space-x-4">
                  <span className="text-3xl flex-shrink-0">
                    {getNotificationIcon(notification.notification_type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${
                          !notification.is_read ? 'font-bold' : ''
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-700 mb-3">{notification.message}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="ml-4 p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                          title="Mark as read"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    {notification.application_id && (
                      <Link
                        to={`/formations/${notification.formation_id || notification.application_id}`}
                        className="inline-flex items-center mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

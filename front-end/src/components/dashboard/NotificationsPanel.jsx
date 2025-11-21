// src/components/dashboard/NotificationsPanel.jsx
import React from 'react';

const NotificationsPanel = ({ notifications, onMarkAsRead, onMarkAllAsRead, onClose }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'price_alert':
        return '💰';
      case 'order_update':
        return '📦';
      case 'new_product':
        return '🆕';
      case 'supplier_message':
        return '💬';
      case 'payment_success':
        return '💳';
      case 'delivery_update':
        return '🚚';
      case 'system_alert':
        return '⚠️';
      case 'market_insight':
        return '📈';
      default:
        return '🔔';
    }
  };

  // FIX: Handle notification click to mark as read
  const handleNotificationClick = (notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  // FIX: Handle mark all as read with confirmation
  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  // Calculate unread count - FIX: Use the actual notifications prop
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-sm">
        <div className="flex flex-col h-full bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-green-200 bg-green-50">
            <div>
              <h2 className="text-lg font-semibold text-green-800">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-green-600 text-sm">
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 bg-green-100 rounded-lg transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-green-600 hover:text-green-800 rounded-lg hover:bg-green-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔔</div>
                <p className="text-green-600">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-green-100">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-green-50 cursor-pointer transition-colors group ${
                      !notification.read ? 'bg-green-25 border-l-4 border-l-green-500' : ''
                    }`}
                  >
                    <div className="flex space-x-3">
                      <div className="text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          !notification.read ? 'text-green-900' : 'text-green-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-green-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-green-400 text-xs mt-2">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                    
                    {/* Mark as read button for unread notifications */}
                    {!notification.read && (
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the main click
                            if (onMarkAsRead) {
                              onMarkAsRead(notification.id);
                            }
                          }}
                          className="text-green-500 hover:text-green-700 text-xs bg-green-100 px-2 py-1 rounded transition-colors"
                        >
                          Mark as read
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-green-200">
            <button className="w-full text-center text-green-600 hover:text-green-800 py-2">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
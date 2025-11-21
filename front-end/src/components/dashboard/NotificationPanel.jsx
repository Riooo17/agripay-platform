import React, { useState, useEffect } from 'react';

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock notifications
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setNotifications([
          {
            id: 1,
            type: 'order',
            title: 'New Order Received',
            message: 'You have a new order for Organic Tomatoes',
            time: '2 minutes ago',
            read: false
          },
          {
            id: 2,
            type: 'system',
            title: 'System Update',
            message: 'New features available in your dashboard',
            time: '1 hour ago',
            read: true
          },
          {
            id: 3,
            type: 'alert',
            title: 'Price Alert',
            message: 'Tomato prices have increased by 15%',
            time: '3 hours ago',
            read: true
          }
        ]);
        setLoading(false);
      }, 500);
    }
  }, [isOpen]);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Panel */}
      <div className="absolute right-4 top-16 w-80 bg-white rounded-lg shadow-xl border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <div className="flex space-x-2">
            <button
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 text-sm mt-2">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-gray-500">No notifications</p>
              <p className="text-sm text-gray-400">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      !notification.read ? 'bg-blue-500' : 'bg-transparent'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
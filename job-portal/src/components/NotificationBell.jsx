import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api/notificationsApi';
import { useAuth } from '../context/AuthContext';
import { Bell, Clock } from 'lucide-react';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const panelRef = useRef(null);

  const loadNotifications = () => {
    setLoading(true);
    getMyNotifications()
      .then((res) => setNotifications(res.data?.data?.dtos || []))
      .catch((err) => console.error('Failed to load notifications:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Close the dropdown when clicking outside it
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const unreadCount = notifications.filter((n) => n.status === 'UNREAD').length;

  const handleToggle = () => {
    if (!open) loadNotifications();
    setOpen(!open);
  };

  const handleMarkOneRead = async (notification) => {
    if (notification.status !== 'UNREAD') return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, status: 'READ' } : n))
    );
    try {
      await markNotificationAsRead(notification.id);
    } catch (err) {
      toast.error('Could not mark notification as read');
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, status: 'UNREAD' } : n))
      );
    }
  };

  const handleMarkAllRead = async () => {
    if (!user?.email || unreadCount === 0) return;
    setMarkingAllRead(true);
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, status: 'READ' })));
    try {
      await markAllNotificationsAsRead(user.email);
    } catch (err) {
      toast.error('Could not mark all as read');
      setNotifications(previous);
    } finally {
      setMarkingAllRead(false);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleToggle}
        className="relative w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 max-h-[460px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={handleMarkAllRead}
              disabled={markingAllRead || unreadCount === 0}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {markingAllRead ? 'Marking...' : 'Mark all read'}
            </button>
          </div>

          {/* Notification list */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="py-8 text-center">
                <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400 mt-2">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400 mt-2">No notifications yet.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleMarkOneRead(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                    n.status === 'UNREAD' ? 'bg-blue-50/60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Status indicator */}
                    {n.status === 'UNREAD' ? (
                      <span className="w-2.5 h-2.5 mt-1.5 rounded-full bg-blue-500 flex-shrink-0 ring-2 ring-blue-200" />
                    ) : (
                      <span className="w-2.5 h-2.5 mt-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          n.status === 'UNREAD' ? 'font-semibold text-gray-800' : 'font-medium text-gray-600'
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(n.created_date).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {n.status === 'UNREAD' && (
                      <span className="text-[10px] font-medium text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full flex-shrink-0">
                        New
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

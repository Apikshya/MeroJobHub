import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, UserPen, Lock, LogOut } from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function Navbar({ portalLabel, variant = 'default' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine base path from current URL or user role
  const getBasePath = () => {
    const path = location.pathname;
    
    // 1. Try to extract from URL (most reliable)
    if (path.startsWith('/customer')) return '/customer';
    if (path.startsWith('/admin')) return '/admin';
    if (path.startsWith('/company')) return '/company';
    
    // 2. Fallback to user role from AuthContext
    if (user?.user_type === 'CUSTOMER') return '/customer';
    if (user?.user_type === 'ADMIN') return '/admin';
    if (user?.user_type === 'COMPANY_ADMIN') return '/company';
    
    return '/customer';
  };

  const basePath = getBasePath();

  const navigateTo = (path) => {
    setDropdownOpen(false);
    const fullPath = `${basePath}${path}`;
    navigate(fullPath);
  };

  const userInitial = user?.full_name?.charAt(0)?.toUpperCase() || user?.first_name?.charAt(0)?.toUpperCase() || '?';
  const userName = user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'John Smith';

  if (variant === 'light') {
    return (
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-none">
        <div className="w-full px-6 sm:px-8 h-16 flex items-center justify-between">
          {/* Left: Portal Title */}
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{portalLabel}</h1>

          {/* Right: User area & notifications */}
          <div className="flex items-center gap-4">
            <NotificationBell />

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 bg-white hover:bg-slate-50 rounded-full pl-1.5 pr-3.5 py-1 transition-all duration-150 border border-slate-200 shadow-sm"
              >
                <UserAvatar
                  user={user}
                  size="sm"
                  className="w-8 h-8 ring-1 ring-slate-200"
                />
                <span className="hidden sm:inline text-sm font-semibold text-slate-700 truncate max-w-[130px]">
                  {userName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-50 animate-fade-in-up">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                    <UserAvatar user={user} size="md" className="w-10 h-10 ring-1 ring-slate-100" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigateTo('/profile')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    My Profile
                  </button>
                  <button
                    onClick={() => navigateTo('/edit-profile')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    <UserPen className="w-4 h-4 text-gray-500" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigateTo('/change-password')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-gray-500" />
                    Change Password
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(-8px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.15s ease-out;
          }
        `}</style>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between backdrop-blur-sm bg-white/10">
        {/* Left: Brand */}
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 shadow-md bg-white/80 transition-transform hover:scale-105">
            <img
              src="/images/logo_png1.png"
              alt="JobPortal"
              className="w-full h-full object-cover"
            />
          </span>
          <span className="hidden sm:inline-block text-sm font-bold text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30 shadow-sm">
            {portalLabel}
          </span>
        </div>

        {/* Right: User area */}
        <div className="flex items-center gap-3 sm:gap-4">
          <NotificationBell />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full pl-1 pr-3 py-1 transition-all duration-200 border border-white/30 shadow-sm"
            >
              <UserAvatar
                user={user}
                size="sm"
                className="w-8 h-8 ring-1 ring-white/50"
              />
              <span className="hidden sm:inline text-sm font-medium text-white truncate max-w-[120px]">
                {userName}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-10 animate-fade-in-up">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  <UserAvatar user={user} size="md" className="w-10 h-10 ring-1 ring-slate-100" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('/profile')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  My Profile
                </button>
                <button
                  onClick={() => navigateTo('/edit-profile')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <UserPen className="w-4 h-4 text-gray-500" />
                  Edit Profile
                </button>
                <button
                  onClick={() => navigateTo('/change-password')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-gray-500" />
                  Change Password
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.15s ease-out;
        }
      `}</style>
    </header>
  );
}
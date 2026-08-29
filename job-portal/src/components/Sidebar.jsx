import { NavLink, useNavigate } from 'react-router-dom';
import { HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// links: [{ to, label, icon }]
export default function Sidebar({
  links,
  dark = false,
  brandName = 'MeroJobHub',
  brandSubtitle = 'Recruitment Portal',
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSupport = () => {
    toast('Contact support at: support@merojobhub.com', {
      icon: '💬',
      style: { borderRadius: '12px', background: '#161938', color: '#fff' },
    });
  };

  if (dark) {
    return (
      <aside className="w-64 bg-[#161938] h-screen sticky top-0 flex flex-col hidden md:flex shrink-0 select-none overflow-hidden justify-between z-20">
        {/* Top: Brand Header & Navigation */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand header */}
          <div className="p-6 flex items-center gap-3.5 border-b border-white/5 shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#4f46e5] flex items-center justify-center p-1.5 shadow-sm shrink-0">
              <img
                src="/images/logo_png1.png"
                alt="MeroJobHub Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-white text-base tracking-tight leading-tight">{brandName}</h1>
              <p className="text-[11px] text-slate-400 tracking-wide mt-0.5">{brandSubtitle}</p>
            </div>
          </div>

          {/* Navigation list */}
          <nav className="flex flex-col py-4 gap-1 overflow-y-auto overflow-x-hidden flex-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-6 py-3.5 text-sm font-medium transition-all duration-150 ${isActive
                    ? 'text-white font-semibold bg-[#252849]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator Bar on Left */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#ec4899] rounded-r shadow-sm" />
                    )}
                    {/* Icon */}
                    <span
                      className={`w-5 h-5 flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400'
                        }`}
                    >
                      {link.icon}
                    </span>
                    {/* Label */}
                    <span className="flex-1 truncate">{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Post a New Job + Support + Logout */}
        <div className="p-4 border-t border-white/5 shrink-0 space-y-2">


          {/* Support */}
          <button
            onClick={handleSupport}
            className="w-full flex items-center gap-3.5 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.03] transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-slate-400" />
            <span>Support</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 rounded-xl hover:bg-white/[0.03] transition-colors"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen sticky top-0 py-6 px-3 hidden md:flex flex-col justify-between shadow-sm shrink-0 select-none overflow-hidden z-20">
      <nav className="flex flex-col gap-1.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Icon */}
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {link.icon}
                </span>
                {/* Label */}
                <span className="flex-1">{link.label}</span>
                {/* Active indicator bar */}
                {isActive && (
                  <span className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom for light mode */}
      <div className="pt-4 border-t border-gray-100 space-y-1">
        <button
          onClick={handleSupport}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition"
        >
          <HelpCircle className="w-5 h-5 text-gray-400" />
          <span>Support</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
import { NavLink } from 'react-router-dom';

// links: [{ to, label, icon }]  (icon can be a React node, e.g. SVG or emoji)
export default function Sidebar({ links }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] py-6 px-3 hidden md:block shadow-sm">
      <nav className="flex flex-col gap-1.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
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
    </aside>
  );
}
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/jobs', label: 'Manage Jobs', icon: '💼' },
  { to: '/admin/applications', label: 'Applied Jobs', icon: '📋' },
  { to: '/admin/companies', label: 'Company Info', icon: '🏢' },
  // { to: '/admin/profile', label: 'My Profile', icon: '👤' },
  // { to: '/admin/edit-profile', label: 'Edit Details', icon: '✏️' },
  // { to: '/admin/change-password', label: 'Change Password', icon: '🔒' },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar portalLabel="Admin Portal" />
      <div className="flex">
        {/* Sidebar – sticky and slightly elevated */}
        <Sidebar links={links} />

        {/* Main content – centered and spacious */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 bg-gray-50">
          <div className="mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
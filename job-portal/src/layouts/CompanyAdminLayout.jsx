import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const links = [
  { to: '/company/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/company/company-info', label: 'My Company', icon: '🏢' },
  { to: '/company/users', label: 'Company Users', icon: '👥' },
  { to: '/company/jobs', label: 'Manage Jobs', icon: '💼' },
  { to: '/company/applications', label: 'Applied Jobs', icon: '📋' },
  // { to: '/company/profile', label: 'My Profile', icon: '👤' },
  // { to: '/company/edit-profile', label: 'Edit Details', icon: '✏️' },
  // { to: '/company/change-password', label: 'Change Password', icon: '🔒' },
];

export default function CompanyAdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar portalLabel="Company Portal" />
      <div className="flex">
        {/* Sidebar – sticky and slightly elevated */}
        <Sidebar links={links} />

        {/* Main content – centred and spacious */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 bg-gray-50">
          <div className="mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
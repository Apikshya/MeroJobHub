import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import { LayoutDashboard, Building2, Users, Briefcase, ClipboardList } from 'lucide-react';

const links = [
  { to: '/company/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/company/company-info', label: 'My Company', icon: <Building2 className="w-5 h-5" /> },
  { to: '/company/users', label: 'Company Users', icon: <Users className="w-5 h-5" /> },
  { to: '/company/jobs', label: 'Manage Jobs', icon: <Briefcase className="w-5 h-5" /> },
  { to: '/company/applications', label: 'Applied Jobs', icon: <ClipboardList className="w-5 h-5" /> },
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
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import { LayoutDashboard, Users, Briefcase, ClipboardList, Building2 } from 'lucide-react';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" /> },
  { to: '/admin/jobs', label: 'Manage Jobs', icon: <Briefcase className="w-5 h-5" /> },
  { to: '/admin/applications', label: 'Applied Jobs', icon: <ClipboardList className="w-5 h-5" /> },
  { to: '/admin/companies', label: 'Company Info', icon: <Building2 className="w-5 h-5" /> },
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
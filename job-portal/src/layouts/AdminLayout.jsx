import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import { LayoutDashboard, Users, Briefcase, ClipboardList, Building2, Tags } from 'lucide-react';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" /> },
  { to: '/admin/jobs', label: 'Manage Jobs', icon: <Briefcase className="w-5 h-5" /> },
  { to: '/admin/applications', label: 'Applied Jobs', icon: <ClipboardList className="w-5 h-5" /> },
  { to: '/admin/companies', label: 'Company Info', icon: <Building2 className="w-5 h-5" /> },
  { to: '/admin/categories', label: 'Categories', icon: <Tags className="w-5 h-5" /> },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f4f5fa] flex">
      {/* Sidebar – full-height dark theme, sticky and non-scrollable */}
      <Sidebar
        links={links}
        dark
        brandName="MeroJobHub"
        brandSubtitle="Admin Portal"
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar portalLabel="Admin Portal" variant="light" />

        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-[#f4f5fa] overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
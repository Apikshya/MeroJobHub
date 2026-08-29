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
    <div className="min-h-screen bg-[#f4f5fa] flex">
      {/* Sidebar – full-height dark theme */}
      <Sidebar
        links={links}
        dark
        brandName="MeroJobHub"
        brandSubtitle="Recruitment Management"
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar portalLabel="Company Portal" variant="light" />

        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-[#f4f5fa] overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
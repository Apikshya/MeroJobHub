import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import { LayoutDashboard, Briefcase, ClipboardList, FolderKanban } from 'lucide-react';

const links = [
  { to: '/customer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/customer/jobs', label: 'Browse Jobs', icon: <Briefcase className="w-5 h-5" /> },
  { to: '/customer/applications', label: 'My Applications', icon: <ClipboardList className="w-5 h-5" /> },
  { to: '/customer/documents', label: 'My Documents', icon: <FolderKanban className="w-5 h-5" /> },
];

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[#f4f5fa] flex">
      {/* Sidebar – full-height dark theme, sticky and non-scrollable */}
      <Sidebar
        links={links}
        dark
        brandName="MeroJobHub"
        brandSubtitle="Job Seeker Portal"
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar portalLabel="Job Seeker Portal" variant="light" />

        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-[#f4f5fa] overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
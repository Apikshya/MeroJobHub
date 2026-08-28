import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import { LayoutDashboard, Briefcase, ClipboardList, FolderKanban } from 'lucide-react';

const links = [
  { to: '/customer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/customer/jobs', label: 'Jobs', icon: <Briefcase className="w-5 h-5" /> },
  { to: '/customer/applications', label: 'My Applied Jobs', icon: <ClipboardList className="w-5 h-5" /> },
  { to: '/customer/documents', label: 'My Documents', icon: <FolderKanban className="w-5 h-5" /> },
];

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar portalLabel="Customer Portal" />
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
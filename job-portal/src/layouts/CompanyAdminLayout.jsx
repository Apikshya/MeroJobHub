import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getCompanyByCode } from '../api/companiesApi';

import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  ClipboardList,
  MapPin,
  Hash,
  TrendingUp,
} from 'lucide-react';

const links = [
  { to: '/company/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/company/company-info', label: 'My Company', icon: <Building2 className="w-5 h-5" /> },
  { to: '/company/users', label: 'Company Users', icon: <Users className="w-5 h-5" /> },
  { to: '/company/jobs', label: 'Manage Jobs', icon: <Briefcase className="w-5 h-5" /> },
  { to: '/company/applications', label: 'Applied Jobs', icon: <ClipboardList className="w-5 h-5" /> },
];

export default function CompanyAdminLayout() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (user?.system_code) {
      getCompanyByCode(user.system_code)
        .then((res) => setCompany(res.data?.data?.dto || null))
        .catch((err) => console.error('Failed to load company details in layout:', err));
    }
  }, [user?.system_code]);

  const companyInitial =
    company?.company_name?.charAt(0)?.toUpperCase() ||
    user?.first_name?.charAt(0)?.toUpperCase() ||
    'A';

  const companyCode = company?.company_code || user?.system_code || 'ANN01';

  return (
    <div className="min-h-screen bg-[#f4f5fa] flex">
      {/* Sidebar – full-height dark theme, sticky and non-scrollable */}
      <Sidebar
        links={links}
        dark
        brandName="MeroJobHub"
        brandSubtitle="Recruitment Portal"
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
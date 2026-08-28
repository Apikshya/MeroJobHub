import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyProfile } from '../../api/profileApi';

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile()
      .then((res) => setProfile(res.data.data.my_profile))
      .catch(() => toast.error('Could not load profile'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="flex flex-col items-center -mt-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mt-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mt-2"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 text-lg">Profile not found.</p>
      </div>
    );
  }

  // Prepare rows with icons for better visual appeal
  const fields = [
    { label: 'First Name', value: profile.first_name, icon: '👤' },
    { label: 'Middle Name', value: profile.middle_name || '-', icon: '🔤' },
    { label: 'Last Name', value: profile.last_name, icon: '👤' },
    { label: 'Email', value: profile.email, icon: '📧' },
    { label: 'Phone', value: profile.phone_number, icon: '📱' },
    { label: 'Age', value: profile.age, icon: '🎂' },
    { label: 'Address', value: profile.address, icon: '📍' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Cover image (gradient placeholder) */}
        <div className="h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>

        {/* Avatar & name section */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col items-center -mt-12 sm:flex-row sm:items-end sm:gap-5">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {profile.first_name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="mt-3 sm:mt-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{profile.full_name}</h1>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
            {/* Edit button (non‑functional) */}
            <div className="ml-auto mt-4 sm:mt-0 hidden">
              <button className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="border-t border-gray-100 px-6 py-5 bg-gray-50/50">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {fields.map(({ label, value, icon }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="text-lg leading-6">{icon}</span>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium text-gray-800 mt-0.5 break-words">
                    {value || '-'}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
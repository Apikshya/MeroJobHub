import { useState, useEffect } from 'react';
import { getProfilePictureUrl } from '../api/profileApi';

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-3xl',
};

export default function UserAvatar({
  user,
  userId,
  name,
  src,
  size = 'md',
  className = '',
  textClassName = '',
  alt = 'Avatar',
}) {
  const [hasError, setHasError] = useState(false);

  const effectiveUserId = user?.id || userId;
  const effectiveName =
    name ||
    user?.full_name ||
    (user?.first_name ? `${user.first_name} ${user?.last_name || ''}`.trim() : '') ||
    user?.email ||
    '?';

  const initial = effectiveName.charAt(0).toUpperCase() || '?';
  const base64Data = src || user?.avatar_data || user?.profile_picture_base64;
  const version = user?.profile_picture_version || user?.updated_date || user?.updatedDate;
  const imageUrl = base64Data || (effectiveUserId ? getProfilePictureUrl(effectiveUserId, version) : null);

  // Reset error state whenever image URL, version, or user ID changes
  useEffect(() => {
    setHasError(false);
  }, [imageUrl, version, base64Data, effectiveUserId]);

  const sizeClass = SIZE_MAP[size] || size || 'w-10 h-10 text-sm';

  if (imageUrl && !hasError) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 select-none flex items-center justify-center bg-slate-100 ${sizeClass} ${className}`}
      >
        <img
          src={imageUrl}
          alt={effectiveName || alt}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover rounded-full"
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback: Initial letter avatar with smooth gradient
  return (
    <div
      className={`rounded-full shrink-0 select-none flex items-center justify-center font-bold text-white bg-gradient-to-br from-[#2563eb] to-[#4f46e5] shadow-inner ${sizeClass} ${className} ${textClassName}`}
      title={effectiveName}
    >
      {initial}
    </div>
  );
}

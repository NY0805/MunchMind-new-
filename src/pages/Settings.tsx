import React from 'react';
import DeviceIntegration from '../components/settings/DeviceIntegration';
import NotificationPreferences from '../components/settings/NotificationPreferences';
import PrivacyControls from '../components/settings/PrivacyControls';
import ThemeSwitcher from '../components/settings/ThemeSwitcher';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { theme } = useTheme();

  return (
    <div className="responsive-container py-6">
      <h1 className={`responsive-title mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Settings
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="space-y-4">
          <ThemeSwitcher />
          <NotificationPreferences />
        </div>
        <div className="space-y-4">
          <DeviceIntegration />
          <PrivacyControls />
        </div>
      </div>
    </div>
  );
};

export default Settings;
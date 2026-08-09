import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/journey/start': 'Start Journey',
  '/journey/history': 'Journey History',
  '/tracking': 'Live Tracking',
  '/ai-risk': 'AI Risk Prediction',
  '/sos': 'SOS Center',
  '/contacts': 'Trusted Contacts',
  '/alerts': 'Alerts',
  '/notifications': 'Notifications',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/profile': 'Profile',
  '/admin': 'Admin Panel',
};

function resolveTitle(pathname: string) {
  if (titleMap[pathname]) return titleMap[pathname];
  const match = Object.keys(titleMap).find((key) => pathname.startsWith(key));
  return match ? titleMap[match] : 'SafeCircle';
}

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} title={resolveTitle(location.pathname)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

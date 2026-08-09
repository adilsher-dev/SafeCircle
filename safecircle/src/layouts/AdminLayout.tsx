import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';
import { cn } from '@/utils/cn';

const tabs = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users, end: false },
];

export default function AdminLayout() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border/60 pb-3">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-2xl text-sm font-medium transition-colors',
                isActive ? 'bg-ai/15 text-ai border border-ai/30' : 'text-muted hover:text-text'
              )
            }
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}

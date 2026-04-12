import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Users,
  Building,
  Calendar,
  MessageSquare,
  Shield,
  CreditCard,
  Bell,
  UserCircle,
  FileText,
  LogOut,
  Menu,
  X,
  ListTodo
} from 'lucide-react';
import { Button } from '../ui/button';

const navItems = {
  resident: [
    { label: 'Dashboard', path: '/dashboard/resident', icon: LayoutDashboard },
    { label: 'My Tasks', path: '/tasks', icon: ListTodo },
    { label: 'Guests', path: '/invite-visitor', icon: Users },
    { label: 'Complaints', path: '/complaints', icon: MessageSquare },
    { label: 'Amenities', path: '/amenities', icon: Building },
    { label: 'Meetings', path: '/meetings', icon: Calendar },
    { label: 'Feed', path: '/feed', icon: Bell },
    { label: 'Members', path: '/members', icon: Users },
    { label: 'Ledger', path: '/ledger', icon: CreditCard },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ],
  guard: [
    { label: 'Dashboard', path: '/dashboard/guard', icon: LayoutDashboard },
    { label: 'Gate Logs', path: '/logs', icon: FileText },
    { label: 'Scanner', path: '/scanner', icon: Shield },
    { label: 'Task List', path: '/tasks', icon: ListTodo },
    { label: 'Complaints', path: '/complaints', icon: MessageSquare },
    { label: 'Society Feed', path: '/feed', icon: Bell },
    { label: 'Members', path: '/members', icon: Users },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ],
  admin: [
    { label: 'Dashboard', path: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Society Feed', path: '/feed', icon: Bell },
    { label: 'Task Management', path: '/tasks', icon: ListTodo },
    { label: 'Members', path: '/members', icon: Users },
    { label: 'Staff Directory', path: '/staff', icon: Shield },
    { label: 'Complaints', path: '/complaints', icon: MessageSquare },
    {label: 'Finance Overview', path: '/finance', icon: CreditCard },
    { label: 'Amenities', path: '/amenities', icon: Building },
    { label: 'Meetings', path: '/meetings', icon: Calendar },
    { label: 'Announcements', path: '/announcements', icon: Bell },
    { label: 'Gate Logs', path: '/logs', icon: FileText },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ]
};

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  const items = navItems[user.role] || [];

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card border-r transition-transform lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center flex-shrink-0 px-6 border-b justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Building className="h-6 w-6" />
            SmartSociety
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </>
  );
}

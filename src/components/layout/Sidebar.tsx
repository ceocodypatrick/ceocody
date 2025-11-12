import React, { useState } from 'react';
import { 
  Home, 
  Music, 
  Users, 
  FolderOpen, 
  Plus, 
  Search, 
  TrendingUp, 
  Clock, 
  Heart, 
  Mic, 
  Headphones,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/helpers';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: string | number;
  active?: boolean;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sidebarSections: SidebarSection[] = [
    {
      title: 'Main',
      items: [
        { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
        { icon: Music, label: 'My Projects', href: '/projects' },
        { icon: Users, label: 'Collaborators', href: '/collaborators' },
        { icon: FolderOpen, label: 'Library', href: '/library' },
      ]
    },
    {
      title: 'Discover',
      items: [
        { icon: Search, label: 'Browse', href: '/browse' },
        { icon: TrendingUp, label: 'Trending', href: '/trending' },
        { icon: Clock, label: 'Recent', href: '/recent' },
        { icon: Heart, label: 'Favorites', href: '/favorites' },
      ]
    },
    {
      title: 'Create',
      items: [
        { icon: Plus, label: 'New Project', href: '/projects/new' },
        { icon: Mic, label: 'Recording', href: '/recording' },
        { icon: Headphones, label: 'Mixing', href: '/mixing' },
      ]
    }
  ];

  const bottomItems: SidebarItem[] = [
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', href: '/help' },
    { icon: LogOut, label: 'Sign Out', href: '#' },
  ];

  const renderSidebarItem = (item: SidebarItem) => {
    const Icon = item.icon;
    const isBottomItem = bottomItems.some(bottomItem => bottomItem.label === item.label);
    
    const handleClick = (e: React.MouseEvent) => {
      if (item.label === 'Sign Out') {
        e.preventDefault();
        logout();
        onClose();
      } else {
        onClose();
      }
    };

    return (
      <a
        key={item.label}
        href={item.href}
        onClick={handleClick}
        className={cn(
          'flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group',
          item.active
            ? 'bg-purple-600/10 text-purple-400 border-l-2 border-purple-600'
            : 'text-gray-400 hover:text-white hover:bg-gray-800',
          isBottomItem && 'mt-2 pt-2 border-t border-gray-800'
        )}
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{item.label}</span>
        </div>
        {item.badge && (
          <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
            {item.badge}
          </span>
        )}
      </a>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out',
          'w-64 lg:w-72',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Harmoni</span>
            </div>
            
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={user?.avatar || 'https://picsum.photos/seed/user/100/100'}
                  alt={user?.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate">
                  {user?.displayName}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">New Project</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 overflow-y-auto">
            {sidebarSections.map((section) => (
              <div key={section.title} className="mb-6">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-400 transition-colors"
                >
                  <span>{section.title}</span>
                  <svg
                    className={cn(
                      'h-3 w-3 transition-transform duration-200',
                      expandedSections[section.title] ? 'rotate-90' : ''
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <div className={cn(
                  'mt-2 space-y-1',
                  expandedSections[section.title] ? 'block' : 'hidden'
                )}>
                  {section.items.map(renderSidebarItem)}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom items */}
          <div className="px-4 pb-4">
            {bottomItems.map(renderSidebarItem)}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
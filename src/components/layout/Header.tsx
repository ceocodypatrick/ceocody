import React, { useState } from 'react';
import { Search, Bell, Settings, Menu, X, User, LogOut, Music, Home, Users, FolderOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import Button from '../ui/Button';
import { cn } from '../../utils/helpers';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { currentTrack, isPlaying, toggle } = useAudioPlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const navigationItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: Music, label: 'Projects', href: '/projects' },
    { icon: Users, label: 'Collaborators', href: '/collaborators' },
    { icon: FolderOpen, label: 'Library', href: '/library' },
  ];

  return (
    <>
      {/* Main Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-300" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">Harmoni</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, artists, genres..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <Bell className="h-5 w-5 text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={user?.avatar || 'https://picsum.photos/seed/default/200/200'}
                    alt={user?.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-300">
                  {user?.displayName}
                </span>
              </button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1">
                  <a
                    href="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Now Playing Bar (appears when track is playing) */}
      {currentTrack && (
        <div className="fixed top-16 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            {/* Track info */}
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={currentTrack.metadata?.artwork || 'https://picsum.photos/seed/track/100/100'}
                  alt={currentTrack.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-white truncate">
                  {currentTrack.name}
                </h4>
                <p className="text-xs text-gray-400 truncate">
                  {currentTrack.metadata?.artist || 'Unknown Artist'}
                </p>
              </div>
            </div>

            {/* Player controls */}
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded hover:bg-gray-800 transition-colors">
                {/* Previous button */}
                <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-8a1 1 0 00-1.555-.832L3 9.168v5.664l5.445 4z" />
                  <path d="M15 14v-8a1 1 0 00-1.555-.832L8 9.168v5.664l5.445 4z" />
                </svg>
              </button>

              <button
                onClick={toggle}
                className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                {isPlaying ? (
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <button className="p-1 rounded hover:bg-gray-800 transition-colors">
                {/* Next button */}
                <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 10.832V14a1 1 0 001.555.832l5.445-4a1 1 0 000-1.664l-5.445-4A1 1 0 0010 6v3.168L4.555 5.168z" />
                </svg>
              </button>
            </div>

            {/* Track progress */}
            <div className="flex items-center space-x-3 flex-1 justify-end">
              <div className="flex items-center space-x-2 w-full max-w-xs">
                <span className="text-xs text-gray-400">0:00</span>
                <div className="flex-1 h-1 bg-gray-700 rounded-full">
                  <div className="h-1 bg-purple-600 rounded-full w-1/3"></div>
                </div>
                <span className="text-xs text-gray-400">3:45</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
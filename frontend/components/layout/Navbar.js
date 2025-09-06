import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Bars3Icon, 
  BellIcon, 
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toggleSidebar } from '../../utils/slices/uiSlice';
import { logout } from '../../utils/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { sidebarOpen, notifications } = useSelector((state) => state.ui);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section: Menu toggle and logo (on mobile) */}
        <div className="flex items-center">
          <button 
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
            {sidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
          
          {/* Mobile logo */}
          <div className="md:hidden ml-2 flex items-center">
            <div className="w-6 h-6 bg-secondary rounded-md"></div>
            <span className="ml-1 font-bold text-primary">HARMONI</span>
          </div>
        </div>
        
        {/* Center section: Search */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search artists, songs, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </form>
        </div>
        
        {/* Right section: User actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                >
                  <BellIcon className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200 font-medium">Notifications</div>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className="px-4 py-2 hover:bg-gray-50">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-500">{notification.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No new notifications</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* User menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="ml-2 hidden md:block">{user?.name || 'User'}</span>
                </button>
                
                {/* User dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login" className="px-4 py-2 text-primary hover:text-primary-dark">
                Log in
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile search - shown below navbar on mobile */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search artists, songs, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </form>
      </div>
    </header>
  );
};

export default Navbar;
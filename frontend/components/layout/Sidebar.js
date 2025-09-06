import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toggleSidebar } from '../../utils/slices/uiSlice';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  MusicalNoteIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  RocketLaunchIcon, 
  UserCircleIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  
  const isArtist = user?.type === 'artist';
  
  const commonNavItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Discover', href: '/discover', icon: MagnifyingGlassIcon },
    { name: 'Library', href: '/library', icon: MusicalNoteIcon },
    { name: 'Artists', href: '/artists', icon: UserGroupIcon },
  ];
  
  const artistNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Releases', href: '/releases', icon: MusicalNoteIcon },
    { name: 'Audience', href: '/audience', icon: UserGroupIcon },
    { name: 'Revenue', href: '/revenue', icon: CurrencyDollarIcon },
    { name: 'Promotion', href: '/promotion', icon: RocketLaunchIcon },
    { name: 'Collaboration', href: '/collaboration', icon: UserGroupIcon },
  ];
  
  const navItems = isArtist ? [...commonNavItems, ...artistNavItems] : commonNavItems;
  
  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center p-4">
        <div className="w-8 h-8 bg-secondary rounded-lg"></div>
        <h3 className="ml-2 text-xl font-bold text-primary">HARMONI</h3>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link 
              href={item.href} 
              key={item.name}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary-light/20 text-primary' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* User section */}
      <div className="p-4 border-t border-gray-200">
        <Link 
          href="/profile" 
          className="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <UserCircleIcon className="w-5 h-5 mr-3" />
          <span>Profile</span>
        </Link>
        <Link 
          href="/settings" 
          className="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Cog6ToothIcon className="w-5 h-5 mr-3" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
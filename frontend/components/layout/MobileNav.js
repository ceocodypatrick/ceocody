import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  MusicalNoteIcon, 
  UserCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const MobileNav = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { currentTrack } = useSelector((state) => state.player);
  
  const isArtist = user?.type === 'artist';
  
  // Adjust bottom padding if player is active
  const navClasses = `fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-10 ${
    currentTrack ? 'pb-16' : ''
  }`;
  
  return (
    <nav className={navClasses}>
      <Link 
        href="/" 
        className={`flex flex-col items-center px-2 py-1 ${
          router.pathname === '/' ? 'text-primary' : 'text-gray-500'
        }`}
      >
        <HomeIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link 
        href="/discover" 
        className={`flex flex-col items-center px-2 py-1 ${
          router.pathname === '/discover' ? 'text-primary' : 'text-gray-500'
        }`}
      >
        <MagnifyingGlassIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Discover</span>
      </Link>
      
      <Link 
        href="/library" 
        className={`flex flex-col items-center px-2 py-1 ${
          router.pathname === '/library' ? 'text-primary' : 'text-gray-500'
        }`}
      >
        <MusicalNoteIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Library</span>
      </Link>
      
      {isArtist && (
        <Link 
          href="/dashboard" 
          className={`flex flex-col items-center px-2 py-1 ${
            router.pathname === '/dashboard' ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <ChartBarIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
      )}
      
      <Link 
        href="/profile" 
        className={`flex flex-col items-center px-2 py-1 ${
          router.pathname === '/profile' ? 'text-primary' : 'text-gray-500'
        }`}
      >
        <UserCircleIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
};

export default MobileNav;
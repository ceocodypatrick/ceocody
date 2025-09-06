import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Player from '../player/Player';
import MobileNav from './MobileNav';

const MainLayout = ({ children }) => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentTrack } = useSelector((state) => state.player);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Check if the current route requires authentication
  useEffect(() => {
    const publicRoutes = ['/', '/login', '/signup', '/about'];
    const isPublicRoute = publicRoutes.includes(router.pathname);
    
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - hidden on mobile */}
      {!isMobile && sidebarOpen && <Sidebar />}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
        
        {/* Music player - fixed at bottom */}
        {currentTrack && <Player />}
        
        {/* Mobile navigation */}
        {isMobile && <MobileNav />}
      </div>
    </div>
  );
};

export default MainLayout;
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FloatingChatWidget } from '@/components/FloatingChatWidget';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useSession } from '@/hooks/SessionContext';
import { useUser } from '@/services/queries';

export function Layout() {
  const location = useLocation();
  const isSplashPage = location.pathname === '/' || location.pathname === '/welcome';
  const { userId, setUserId } = useSession();
  const { isError: userError } = useUser(userId);

  useEffect(() => {
    if (userError) {
      console.warn("Invalid user session detected. Clearing session.");
      setUserId(null);
    }
  }, [userError, setUserId]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/30 pb-16 md:pb-0">
      <main className="w-full min-h-screen bg-background relative overflow-x-hidden pt-[env(safe-area-inset-top)]">
        <Outlet />
        
        {!isSplashPage && <FloatingChatWidget />}
      </main>

      {/* Sticky Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}

export function ErrorBoundaryComponent() {
  return (
    <div className="p-8 text-red-500">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p>An unexpected error occurred.</p>
    </div>
  );
}

export function LoadingComponent() {
  return <div className="p-8 text-gray-500">Loading...</div>;
}

export function NotFound() {
  return <div className="p-8">404 - Page Not Found</div>;
}

import { Outlet, useLocation } from 'react-router-dom';
import { FloatingChatWidget } from '@/components/FloatingChatWidget';

export function Layout() {
  const location = useLocation();
  const isSplashPage = location.pathname === '/' || location.pathname === '/welcome';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/30">
      <main className="w-full min-h-screen bg-background relative overflow-x-hidden">
        <Outlet />
        
        {!isSplashPage && <FloatingChatWidget />}
      </main>
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

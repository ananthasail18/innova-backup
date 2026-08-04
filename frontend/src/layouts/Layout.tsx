import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FloatingChatWidget } from '@/components/FloatingChatWidget';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useSession } from '@/hooks/SessionContext';
import { useUser } from '@/services/queries';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

export function Layout() {
  const location = useLocation();
  const isSplashPage = location.pathname === '/' || location.pathname === '/welcome';
  const { userId, setUserId } = useSession();
  const { isError: userError } = useUser(userId);
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(true);

  useEffect(() => {
    if (userError) {
      console.warn("Invalid user session detected. Clearing session.");
      setUserId(null);
    }
  }, [userError, setUserId]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased flex flex-col items-center justify-start">
      {/* Desktop Mode Toggle Bar (Visible on desktop viewports) */}
      <header className="hidden md:flex items-center justify-between w-full max-w-5xl px-6 py-3 bg-neutral-900/80 border-b border-neutral-800 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
          <span className="font-extrabold text-sm tracking-tight text-white">TasteAI Mobile App Preview</span>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setIsPhoneFrameMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isPhoneFrameMode
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>📱 Phone Frame View</span>
          </button>
          <button
            onClick={() => setIsPhoneFrameMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isPhoneFrameMode
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>🖥️ Expanded View</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {isPhoneFrameMode ? (
        /* Phone Frame Wrapper for Desktop & Native Fullscreen on Mobile */
        <div className="w-full flex-1 flex items-center justify-center p-0 md:py-6">
          <div className="w-full md:max-w-[420px] md:h-[840px] md:rounded-[48px] md:border-[10px] md:border-neutral-800 md:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.95)] overflow-hidden relative flex flex-col bg-neutral-950">
            
            {/* Phone Top Status Bar & Dynamic Island (Desktop Frame Mode) */}
            <div className="hidden md:flex items-center justify-between px-6 pt-3 pb-1 bg-neutral-950 text-white select-none z-30 shrink-0">
              <span className="text-xs font-bold tracking-tight">9:41</span>
              {/* Dynamic Island Notch */}
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 border border-neutral-800 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700" />
              </div>
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative pb-16 no-scrollbar">
              <Outlet />
              {!isSplashPage && <FloatingChatWidget />}
            </main>

            {/* Sticky Mobile Bottom Navigation Bar inside Phone Chassis */}
            <MobileBottomNav isPhoneFrame={true} />

            {/* Home Indicator Line (Desktop Frame Mode) */}
            <div className="hidden md:flex justify-center pb-1 pt-1 bg-neutral-950 z-30 shrink-0">
              <div className="w-32 h-1 bg-neutral-600 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Full Expanded View Mode */
        <main className="w-full min-h-screen bg-background relative overflow-x-hidden pb-16">
          <Outlet />
          {!isSplashPage && <FloatingChatWidget />}
          <MobileBottomNav isPhoneFrame={false} />
        </main>
      )}
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

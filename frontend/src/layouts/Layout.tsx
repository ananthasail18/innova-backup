import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FloatingChatWidget } from '@/components/FloatingChatWidget';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useSession } from '@/hooks/SessionContext';
import { useUser } from '@/services/queries';
import { 
  Smartphone, 
  Monitor, 
  Wifi, 
  Battery, 
  Signal, 
  MapPin, 
  ChevronDown, 
  Sparkles,
  QrCode
} from 'lucide-react';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased flex flex-col items-center justify-start selection:bg-orange-500/30">
      
      {/* Desktop View Mode Control Toolbar */}
      <header className="hidden md:flex items-center justify-between w-full max-w-5xl px-6 py-2.5 bg-neutral-900/90 border-b border-neutral-800/80 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shadow-md shadow-orange-950" />
          <span className="font-extrabold text-sm tracking-tight text-white">TasteAI Mobile App</span>
          <span className="text-xs text-neutral-500 font-medium hidden lg:inline">| Personal AI Dining Discovery</span>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 p-1 rounded-xl border border-neutral-800 shadow-inner">
          <button
            onClick={() => setIsPhoneFrameMode(true)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isPhoneFrameMode
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950 scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 Phone Frame View</span>
          </button>
          <button
            onClick={() => setIsPhoneFrameMode(false)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isPhoneFrameMode
                ? 'bg-orange-500 text-white shadow-md shadow-orange-950 scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>🖥️ Expanded View</span>
          </button>
        </div>
      </header>

      {/* Main App Container */}
      {isPhoneFrameMode ? (
        /* Phone Chassis Frame Wrapper */
        <div className="w-full flex-1 flex items-center justify-center p-0 md:py-6">
          <div className="@container w-full md:max-w-[415px] md:h-[840px] md:rounded-[52px] md:border-[12px] md:border-neutral-800/90 md:shadow-[0_35px_90px_rgba(0,0,0,0.95)] overflow-hidden relative flex flex-col bg-neutral-950 border-neutral-800">
            
            {/* Phone Top Status Bar & Dynamic Island (Desktop Mode) */}
            <div className="hidden md:flex items-center justify-between px-6 pt-3 pb-1 bg-neutral-950 text-white select-none z-30 shrink-0">
              <span className="text-xs font-bold tracking-tight">9:41</span>
              
              {/* Dynamic Island Pill Notch */}
              <div className="w-28 h-5 bg-black rounded-full flex items-center justify-between px-2 border border-neutral-800/80 shadow-inner">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-emerald-400 font-bold tracking-tighter">DNA ACTIVE</span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700" />
              </div>

              <div className="flex items-center gap-1.5 text-neutral-300">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Mobile Header Address Bar (Visible when browsing) */}
            {!isSplashPage && (
              <div className="bg-neutral-950/90 backdrop-blur-md px-4 py-2 border-b border-neutral-800/60 flex items-center justify-between z-20 shrink-0">
                <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="p-1 bg-orange-500/20 text-orange-400 rounded-full">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-black text-white leading-tight">
                      <span>Koramangala 5th Block</span>
                      <ChevronDown className="w-3 h-3 text-neutral-400" />
                    </div>
                    <div className="text-[9px] text-neutral-400 leading-tight">Bengaluru, KA</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => navigate('/scanner')}
                    className="p-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-300 hover:text-white"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => {
                      setUserId(null);
                      navigate('/');
                    }}
                    className="flex items-center gap-1 bg-neutral-800 border border-neutral-700 px-3 py-1 rounded-full text-[10px] font-bold text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors shadow-sm"
                  >
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}

            {/* Scrollable Screen Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative pb-20 no-scrollbar">
              <Outlet />
              {!isSplashPage && <FloatingChatWidget />}
            </main>

            {/* Floating Mobile Bottom Navigation Dock */}
            <MobileBottomNav isPhoneFrame={true} />

            {/* Home Indicator Line (Desktop Frame Mode) */}
            <div className="hidden md:flex justify-center pb-1.5 pt-1 bg-neutral-950 z-30 shrink-0">
              <div className="w-32 h-1 bg-neutral-600 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Full Expanded Desktop View Mode */
        <main className="w-full min-h-screen bg-background relative overflow-x-hidden pb-20">
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

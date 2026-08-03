import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, QrCode } from 'lucide-react';

export function DemoQrPage() {
  const navigate = useNavigate();

  const demoRestaurants = [
    {
      name: 'Rameshwaram Cafe',
      slug: 'rameshwaram-cafe',
      cuisine: 'South Indian',
      color: 'bg-[#8b5a2b]',
      textColor: 'text-[#fdf5e6]',
      qrImage: '/demo-qrs/rameshwaram-cafe.png',
      url: '/restaurant/rameshwaram-cafe',
      description: 'Ghee Podi Dosa, Filter Coffee, Idli, Kesari Bath.'
    },
    {
      name: 'Truffles',
      slug: 'truffles',
      cuisine: 'Continental & Burgers',
      color: 'bg-[#013220]',
      textColor: 'text-[#b87333]',
      qrImage: '/demo-qrs/truffles.png',
      url: '/restaurant/truffles',
      description: 'Gourmet Burgers, Peri Peri Fries, Loaded Nachos, Shakes.'
    },
    {
      name: 'Spice Symphony',
      slug: 'spice-symphony',
      cuisine: 'North Indian & Mughlai',
      color: 'bg-[#800020]',
      textColor: 'text-[#ffd700]',
      qrImage: '/demo-qrs/spice-symphony.png',
      url: '/restaurant/spice-symphony',
      description: 'Butter Chicken, Garlic Naan, Biryani, Tandoori Platters.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
      {/* Dynamic background decoration */}
      <div className="absolute top-10 left-10 w-92 h-92 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-92 h-92 bg-accent/10 rounded-full blur-3xl" />

      <div className="w-full max-w-6xl mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <QrCode className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-extrabold tracking-tight">Demo QR Codes</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Scan these QR codes from another device to load the restaurant menus live.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold rounded-xl border border-border text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoRestaurants.map((rest) => (
            <div
              key={rest.slug}
              className="bg-card/40 border border-border backdrop-blur-md rounded-3xl p-6 md:p-8 flex flex-col items-center justify-between text-center space-y-6 shadow-xl transition-all hover:border-primary/45 group"
            >
              <div className="space-y-3 w-full">
                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${rest.color} ${rest.textColor}`}>
                  {rest.cuisine}
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight">{rest.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {rest.description}
                </p>
              </div>

              {/* QR Image Display */}
              <div 
                onClick={() => navigate(rest.url)}
                className="relative p-4 bg-white rounded-2xl shadow-inner border border-border flex items-center justify-center w-56 h-56 transition-transform group-hover:scale-103 cursor-pointer hover:border-primary/50"
              >
                <img
                  src={rest.qrImage}
                  alt={`${rest.name} QR Code`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="w-full pt-4 border-t border-border/60">
                <button
                  onClick={() => navigate(rest.url)}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-secondary/80 hover:bg-secondary text-secondary-foreground text-sm font-bold rounded-xl transition-colors border border-border"
                >
                  Open Directly <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, Upload, Camera, AlertCircle, RefreshCw } from 'lucide-react';

export function QrScannerPage() {
  const navigate = useNavigate();
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [isCameraRequested, setIsCameraRequested] = useState(false);
  const qrReaderRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScanner = async () => {
    setScannerError(null);
    setIsPermissionDenied(false);
    try {
      // Small delay to ensure container is fully mounted
      setTimeout(async () => {
        try {
          const html5Qrcode = new Html5Qrcode('qr-reader-container');
          qrReaderRef.current = html5Qrcode;

          await html5Qrcode.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
              handleDecodedText(decodedText);
            },
            () => {
              // Verbose error logging suppressed to avoid noise
            }
          );
          setIsWebcamActive(true);
        } catch (err: any) {
          console.error('Failed to start camera', err);
          if (err?.toString().includes('NotAllowedError') || err?.toString().includes('Permission denied')) {
            setIsPermissionDenied(true);
          }
          setScannerError('Could not access camera. Please upload a QR code image instead.');
          setIsWebcamActive(false);
        }
      }, 300);
    } catch (err) {
      console.error(err);
      setScannerError('Could not start scanner. Please try uploading a QR image.');
    }
  };

  const stopScanner = async () => {
    if (qrReaderRef.current && qrReaderRef.current.isScanning) {
      try {
        await qrReaderRef.current.stop();
      } catch (err) {
        console.error('Failed to stop camera stream', err);
      }
      qrReaderRef.current = null;
    }
    setIsWebcamActive(false);
  };

  const handleDecodedText = async (text: string) => {
    // Parse slug from absolute or relative restaurant url
    let slug = '';
    if (text.includes('/restaurant/')) {
      slug = text.split('/restaurant/')[1].split('/')[0].split('?')[0].trim();
    } else {
      // Fallback: check if the string itself is the slug
      slug = text.trim();
    }

    if (slug) {
      await stopScanner();
      navigate(`/restaurant/${slug}`);
    } else {
      setScannerError('Invalid QR code format. Could not detect a valid restaurant URL.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setScannerError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5Qrcode = new Html5Qrcode('qr-reader-container-hidden');
      const decodedText = await html5Qrcode.scanFile(file, true);
      handleDecodedText(decodedText);
    } catch (err) {
      console.error(err);
      setScannerError('Could not read QR code from image. Please ensure the QR code is clear.');
    }
  };

  useEffect(() => {
    if (isCameraRequested) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isCameraRequested]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground justify-center items-center p-6 relative overflow-hidden">
      {/* Dynamic background decoration */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-92 h-92 bg-accent/10 rounded-full blur-3xl" />

      {/* Main glass card container */}
      <div className="w-full max-w-md bg-card/40 border border-border backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 flex flex-col items-center text-center space-y-6">
        <div className="flex items-center gap-2">
          <QrCode className="w-8 h-8 text-primary animate-pulse" />
          <h1 className="text-3xl font-extrabold tracking-tight">Taste<span className="text-primary">AI</span></h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">Scan Restaurant QR</h2>
          <p className="text-sm text-muted-foreground">
            Scan a restaurant's QR code to load their personalized experience instantly.
          </p>
        </div>

        {/* QR scanner wrapper */}
        <div className="relative w-72 h-72 border-2 border-border/80 rounded-2xl overflow-hidden bg-black/60 shadow-inner flex items-center justify-center group">
          {/* Overlay scanner active target box */}
          {isWebcamActive && (
            <div className="absolute z-10 w-48 h-48 border-2 border-dashed border-primary/80 rounded-xl pointer-events-none animate-pulse flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary -mt-0.5 -ml-0.5" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary -mt-0.5 -mr-0.5" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary -mb-0.5 -ml-0.5" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary -mb-0.5 -mr-0.5" />
            </div>
          )}

          <div id="qr-reader-container" className="w-full h-full object-cover" />
          
          {/* Fallback state when camera fails/no permission */}
          {!isWebcamActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-muted/20 text-center space-y-4">
              <Camera className="w-12 h-12 text-muted-foreground/60" />
              {!isCameraRequested ? (
                <button
                  onClick={() => setIsCameraRequested(true)}
                  className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all hover:scale-105 shadow-md"
                >
                  <Camera className="w-3.5 h-3.5" /> Start Camera Scanner
                </button>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground font-semibold">Webcam not active</p>
                  {isPermissionDenied && (
                    <button
                      onClick={startScanner}
                      className="px-4 py-2 bg-primary/80 hover:bg-primary text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> Grant Permission
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Hidden container for file scan decoding */}
        <div id="qr-reader-container-hidden" className="hidden" />

        {/* Error notification block */}
        {scannerError && (
          <div className="w-full flex gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm text-left items-start">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{scannerError}</span>
          </div>
        )}

        {/* Action controls */}
        <div className="w-full flex flex-col gap-3">
          {isWebcamActive && (
            <button
              onClick={() => setIsCameraRequested(false)}
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold rounded-xl transition-all hover:scale-102 border border-red-500/20"
            >
              Stop Camera
            </button>
          )}

          <div className="w-full grid grid-cols-2 gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 p-3 bg-secondary/80 hover:bg-secondary text-secondary-foreground text-sm font-bold rounded-xl transition-all hover:scale-102 border border-border"
            >
              <Upload className="w-4 h-4" /> Upload QR
            </button>

            <button
              onClick={() => navigate('/demo')}
              className="flex items-center justify-center gap-2 p-3 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold rounded-xl transition-all hover:scale-102 border border-primary/20"
            >
              <QrCode className="w-4 h-4" /> View Demo QRs
            </button>
          </div>
        </div>


        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}


/**
 * Pure CSS/SVG flowing backdrop — classical dark blue, no raster wallpaper.
 */
export default function AppBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-900 via-midnight-850 to-midnight-950" />
      {/* Slow drifting light pools */}
      <div
        className="absolute -top-[40%] -left-[20%] h-[85%] w-[85%] rounded-[100%] bg-gradient-to-br from-regal-500/25 via-regal-400/10 to-transparent blur-[80px] motion-safe:animate-flow-slow"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute top-[20%] -right-[25%] h-[70%] w-[70%] rounded-full bg-gradient-to-bl from-indigo-400/15 via-regal-300/10 to-transparent blur-[90px] motion-safe:animate-flow-med"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="absolute bottom-[10%] left-[10%] h-[50%] w-[60%] rounded-[60%] bg-gradient-to-tr from-regal-600/20 to-transparent blur-[70px] motion-safe:animate-flow-slow"
        style={{ animationDelay: "-12s" }}
      />
      {/* Flowing wave band — bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[42%] min-h-[200px] opacity-90">
        <svg
          className="h-full w-full text-regal-500/20"
          preserveAspectRatio="none"
          viewBox="0 0 1440 360"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="waveA"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="35%" stopColor="#8ecae6" stopOpacity="0.12" />
              <stop offset="70%" stopColor="currentColor" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#5a9db8" stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="waveB" x1="0%" y1="0%" x2="0%" y2="1%">
              <stop offset="0%" stopColor="#0a1528" stopOpacity="0" />
              <stop offset="100%" stopColor="#050a12" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveA)"
            d="M0,220 C240,180 480,260 720,220 C960,180 1200,260 1440,200 L1440,360 L0,360 Z"
          />
          <path
            fill="url(#waveB)"
            d="M0,280 C320,240 640,300 960,260 C1120,240 1280,280 1440,270 L1440,360 L0,360 Z"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="1"
            d="M0,200 Q360,160 720,200 T1440,180"
          />
        </svg>
      </div>
      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

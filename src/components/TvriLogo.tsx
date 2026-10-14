import React from 'react';

interface TvriLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  lightText?: boolean;
}

export const TvriLogo: React.FC<TvriLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightText = true
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7 text-xs', text: 'text-xs', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10 text-sm', text: 'text-sm', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14 text-base', text: 'text-base', sub: 'text-xs' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official-style TVRI Symbol */}
      <div
        className={`${currentSize.icon} relative rounded-xl bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 flex items-center justify-center border border-blue-400/30 shadow-md shrink-0 overflow-hidden`}
      >
        <div className="absolute inset-0 bg-radial from-red-600/30 to-transparent pointer-events-none" />
        <span className="font-extrabold tracking-tighter text-white z-10">
          TVRI
        </span>
        <div className="absolute bottom-0 right-0 w-2.5 h-1.5 bg-red-600 rounded-tl-sm" />
      </div>

      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1
              className={`font-bold tracking-tight whitespace-nowrap truncate ${
                currentSize.text
              } ${lightText ? 'text-white' : 'text-slate-900'}`}
            >
              TVRI KALBAR
            </h1>
            <span className="text-[10px] font-semibold text-red-500 bg-red-500/10 px-1.5 py-0.2 rounded border border-red-500/20">
              MEDIA BARU
            </span>
          </div>
          <p
            className={`font-medium tracking-wide uppercase truncate ${
              currentSize.sub
            } ${lightText ? 'text-blue-200/80' : 'text-slate-500'}`}
          >
            LPP Stasiun Kalimantan Barat
          </p>
        </div>
      )}
    </div>
  );
};

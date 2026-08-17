// components/AdBanner.tsx
'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  dataAdSlot?: string;
  dataAdFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
}

export default function AdBanner({
  dataAdSlot = '1234567890',
  dataAdFormat = 'auto',
  className = '',
}: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense banner error:', err);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden my-6 flex flex-col items-center justify-center min-h-[90px] bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-2 text-center ${className}`}>
      <span className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1 select-none font-mono">
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', textAlign: 'center' }}
        data-ad-client="ca-pub-0000000000000000"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}

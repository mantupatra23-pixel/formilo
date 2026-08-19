// components/AdBanner.tsx
'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
}

export default function AdBanner({
  slotId = '1234567890', // AdSense approve hone par custom Slot ID yahan daal sakte hain
  format = 'auto',
  className = '',
}: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (err) {
      console.error('AdSense banner execution notice:', err);
    }
  }, []);

  return (
    <div className={`w-full my-6 text-center overflow-hidden ${className}`}>
      <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-600 block mb-1">
        Sponsored / Advertisement
      </span>
      <div className="min-h-[100px] w-full bg-zinc-900/50 border border-zinc-800/80 rounded-2xl flex items-center justify-center p-1">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '280px', width: '100%' }}
          data-ad-client="ca-pub-5180587791480026"
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

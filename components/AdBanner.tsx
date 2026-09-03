'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
}

export default function AdBanner({
  slotId,
  format = 'auto',
  className = '',
}: AdBannerProps) {
  // Jab tak AdSense approve hokar valid slotId pass na ho, screen par khali jagah mat dikhao
  const isAdActive = Boolean(slotId && slotId !== '1234567890');

  useEffect(() => {
    if (!isAdActive) return;

    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (err) {
      console.error('AdSense banner execution notice:', err);
    }
  }, [isAdActive]);

  if (!isAdActive) {
    return null;
  }

  return (
    <div className={`w-full my-4 text-center overflow-hidden ${className}`}>
      <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-600 block mb-1">
        Sponsored / Advertisement
      </span>
      <div className="w-full flex items-center justify-center">
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

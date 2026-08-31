import React from 'react';

interface AdSlotProps {
  slotId?: string;
  className?: string;
}

export default function AdSlot({ slotId = 'default', className = '' }: AdSlotProps) {
  return (
    <div
      className={`w-full h-24 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-center p-4 ${className}`}
    >
      <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
        Sponsored / Advertisement
      </span>
    </div>
  );
}

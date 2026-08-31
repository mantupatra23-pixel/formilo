import React from 'react';

interface AdSlotProps {
  slotId?: string;
  className?: string;
}

export default function AdSlot({ slotId = 'default', className = '' }: AdSlotProps) {
  return (
    <div
      className={`w-full h-24 sm:h-28 rounded-2xl bg-[#FFFFFF] border border-[#DDE2DF] flex flex-col items-center justify-center text-center p-4 shadow-sm ${className}`}
    >
      <span className="text-[10px] font-mono tracking-widest text-[#718087] uppercase">
        Sponsored / Advertisement
      </span>
    </div>
  );
}

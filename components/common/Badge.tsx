import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'green' | 'orange' | 'cyan' | 'neutral';
  className?: string;
}

export default function Badge({ label, variant = 'neutral', className = '' }: BadgeProps) {
  const styles = {
    green: 'bg-[#00C98B]/15 text-[#008760] border-[#00C98B]/35 font-bold',
    orange: 'bg-[#FDF2E9] text-[#A85A20] border-[#EBAA78]/50 font-bold',
    cyan: 'bg-[#00C7D9]/15 text-[#007D8B] border-[#00C7D9]/35 font-bold',
    neutral: 'bg-[#F0F3F2] text-[#46565C] border-[#D8DEDC] font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono border ${styles[variant]} ${className}`}
    >
      {label}
    </span>
  );
}

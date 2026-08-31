import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'green' | 'orange' | 'cyan' | 'neutral';
  className?: string;
}

export default function Badge({ label, variant = 'neutral', className = '' }: BadgeProps) {
  const styles = {
    green: 'bg-[#00C98B]/10 text-[#00a874] border-[#00C98B]/25',
    orange: 'bg-[#EBAA78]/15 text-[#c97b40] border-[#EBAA78]/35 font-bold',
    cyan: 'bg-[#00C7D9]/10 text-[#009fb0] border-[#00C7D9]/25',
    neutral: 'bg-[#F7F7F3] text-[#65737A] border-[#DDE2DF]',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${styles[variant]} ${className}`}
    >
      {label}
    </span>
  );
}

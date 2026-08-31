import React from 'react';
import { Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TrustSection() {
  const points = [
    {
      icon: <Zap className="w-5 h-5 text-[#00C98B]" />,
      title: 'Browser-Native Engine',
      desc: 'High-speed image downscaling and bi-cubic rendering executed directly within device RAM with zero server processing delay.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#00C7D9]" />,
      title: 'Privacy First Guarantee',
      desc: 'No registration or login required. Client-side tools do not store or transmit confidential identity files to external servers.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#EBAA78]" />,
      title: 'Requirement-Focused',
      desc: 'Presets calibrated to verified official recruitment standards across SSC, UPSC, Railway, Banking, Police, and NTA portals.',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {points.map((p, i) => (
        <div
          key={i}
          className="bg-white border border-[#DDE2DF] rounded-card p-6 shadow-card space-y-2 flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F7F7F3] border border-[#E8EBE9] flex items-center justify-center">
            {p.icon}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-[#162630]">{p.title}</h3>
            <p className="text-xs text-[#65737A] leading-relaxed">{p.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

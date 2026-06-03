import React from 'react';
import type { InvitationData } from '../../data/invitationData';

export default function Magazine04({ data }: { data: InvitationData }) {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#050505] text-white font-serif">
      <div className="relative h-screen flex flex-col justify-between p-8 pt-24">
        {/* Letterbox effect */}
        <div className="absolute top-0 left-0 w-full h-[15vh] bg-black z-20 border-b border-white/10 flex items-center px-8">
          <span className="text-[10px] tracking-widest uppercase text-gray-500">A Film By Studio Chaos</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[15vh] bg-black z-20 border-t border-white/10 flex items-center justify-between px-8">
          <span className="text-[10px] tracking-widest text-gray-500 uppercase">{data.date.split('T')[0]}</span>
          <span className="text-[10px] tracking-widest text-gray-500 uppercase">{data.venue.name}</span>
        </div>

        <div className="absolute inset-0 z-0">
          <img src={data.gallery[0]} className="w-full h-full object-cover opacity-40 filter contrast-125 sepia-[.3]" alt="Cinematic" />
        </div>

        <div className="relative z-10 text-center mt-32">
          <h1 className="text-5xl font-light tracking-wider mb-4 text-[#F5E6D3]">{data.couple.groom.name}</h1>
          <span className="text-xl italic text-gray-400">and</span>
          <h1 className="text-5xl font-light tracking-wider mt-4 text-[#F5E6D3]">{data.couple.bride.name}</h1>
        </div>

        <div className="relative z-10 text-center mb-32">
          <p className="text-xs uppercase tracking-[0.3em] text-[#F5E6D3]/70">The Premiere</p>
        </div>
      </div>

      <div className="bg-black p-12 text-center border-t border-white/10">
        <p className="text-sm leading-loose text-gray-400 mb-8 whitespace-pre-line italic">
          {data.greeting.content}
        </p>
        <button className="border border-white/30 px-8 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition">Show Times</button>
      </div>
    </div>
  );
}

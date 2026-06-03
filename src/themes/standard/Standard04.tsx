import React from 'react';
import type { InvitationData } from '../../data/invitationData';

export default function Standard04({ data }: { data: InvitationData }) {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#1A1E24] text-[#E8E1C5] font-serif border-x border-[#2A2E34]">
      <div className="p-8 py-24 text-center">
        <div className="w-16 h-16 mx-auto border-2 border-[#D4AF37] rounded-full flex items-center justify-center mb-10">
          <span className="text-[#D4AF37] font-bold">W</span>
        </div>
        <h1 className="text-4xl mb-4 text-[#D4AF37]">{data.couple.groom.name} · {data.couple.bride.name}</h1>
        <p className="tracking-[4px] text-xs text-gray-400 mb-16 uppercase">The Wedding Day</p>

        <img src={data.gallery[3]} className="w-full h-80 object-cover grayscale opacity-80 border-y border-[#D4AF37] mb-16" alt="Couple" />

        <p className="text-sm leading-[2.5] text-gray-300 whitespace-pre-line mb-16">
          {data.greeting.content}
        </p>

        <div className="border border-[#D4AF37]/30 p-8 rounded-sm bg-[#22272E]">
          <h2 className="text-[#D4AF37] text-lg mb-4">Location & Time</h2>
          <p className="text-xl mb-2 text-white">{data.venue.name}</p>
          <p className="text-xs text-gray-400 mb-6">{new Date(data.date).toLocaleString('ko-KR')}</p>
          <button className="px-6 py-2 border border-[#D4AF37] text-[#D4AF37] text-xs uppercase hover:bg-[#D4AF37] hover:text-black transition">View Map</button>
        </div>
      </div>
    </div>
  );
}

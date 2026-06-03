import React from 'react';
import type { InvitationData } from '../../data/invitationData';

export default function Magazine03({ data }: { data: InvitationData }) {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#CCFF00] text-black font-black overflow-hidden relative">
      <div className="absolute top-10 -left-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
      <div className="absolute bottom-20 -right-10 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      <div className="relative z-10 p-6 pt-16">
        <div className="flex justify-between items-start mb-10">
          <h1 className="text-6xl leading-[0.8] uppercase rotate-[-5deg]">WE<br/>R<br/>M<br/>ARR<br/>YIN</h1>
          <div className="bg-black text-white text-xs px-2 py-1 rotate-[10deg]">V.03 Y2K EDITION</div>
        </div>

        <div className="relative mb-16">
          <img src={data.gallery[2]} className="w-full h-80 object-cover rotate-[3deg] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] border-4 border-black" alt="Y2K" />
          <div className="absolute -bottom-4 -left-4 bg-pink-500 text-white px-4 py-2 border-2 border-black rotate-[-10deg] text-xl uppercase">
            {data.couple.groom.name} & {data.couple.bride.name}
          </div>
        </div>

        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-10">
          <h2 className="text-2xl uppercase border-b-4 border-black pb-2 mb-4">WYA? (Where You At)</h2>
          <p className="text-xl mb-1">{data.venue.name}</p>
          <p className="text-sm font-medium">{data.venue.address}</p>
        </div>

        <button className="w-full bg-black text-white text-2xl uppercase py-4 border-4 border-transparent hover:bg-transparent hover:text-black hover:border-black transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,0.5)]">
          RSVP ASAP
        </button>
      </div>
    </div>
  );
}

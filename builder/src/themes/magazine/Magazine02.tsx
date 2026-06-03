import React from 'react';
import type { InvitationData } from '../../data/invitationData';

export default function Magazine02({ data }: { data: InvitationData }) {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-serif shadow-2xl relative overflow-hidden">
      <div className="p-8">
        <div className="border-b border-[#1A1A1A] pb-2 mb-8 flex justify-between text-xs tracking-widest uppercase">
          <span>Vol. 1</span>
          <span>Seoul, Korea</span>
        </div>
        
        <h1 className="text-6xl italic font-light mb-4 text-center">The<br/>Wedding</h1>
        
        <div className="relative mt-10 mb-12">
          <img 
            src={data.gallery[1]} 
            alt="Editorial" 
            className="w-full h-96 object-cover grayscale"
          />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-4 border border-[#1A1A1A] text-center w-[80%]">
            <p className="text-xl tracking-widest uppercase">{data.couple.groom.name} & {data.couple.bride.name}</p>
          </div>
        </div>

        <p className="text-center text-sm leading-loose mt-16 px-4">
          {data.greeting.content}
        </p>
      </div>
    </div>
  );
}

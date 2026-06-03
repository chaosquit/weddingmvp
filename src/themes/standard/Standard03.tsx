import React from 'react';
import type { InvitationData } from '../../data/invitationData';

export default function Standard03({ data }: { data: InvitationData }) {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#F0EFEB] text-[#3A3A3A] font-sans">
      <div className="pt-24 pb-12 px-8 text-center bg-[#E5E0D8] rounded-b-[40px] shadow-sm">
        <p className="text-sm tracking-[0.2em] mb-4 text-[#8A8476]">INVITATION</p>
        <h1 className="text-3xl font-medium text-[#4A4741] mb-6">{data.couple.groom.name} & {data.couple.bride.name}</h1>
        <p className="text-sm text-[#6B6554] tracking-widest">{new Date(data.date).toLocaleDateString()}</p>
      </div>

      <div className="px-6 -mt-8 relative z-10">
        <div className="p-2 bg-white rounded-2xl shadow-lg">
          <img src={data.gallery[2]} alt="Couple" className="w-full h-96 object-cover rounded-xl" />
        </div>
      </div>

      <div className="px-8 py-20 text-center">
        <h2 className="text-xl mb-6 text-[#8A8476] border-b border-[#D5D0C8] inline-block pb-2">{data.greeting.title}</h2>
        <p className="whitespace-pre-line text-sm leading-[2.2] text-[#5A554A] mb-12">
          {data.greeting.content}
        </p>

        <div className="bg-[#E5E0D8]/30 rounded-2xl p-6 text-sm">
          <p className="mb-2"><strong>장소:</strong> {data.venue.name}</p>
          <p className="text-[#8A8476]">{data.venue.address}</p>
        </div>
      </div>
    </div>
  );
}

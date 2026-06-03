import React from 'react';
import type { InvitationData } from '../../data/invitationData';

export default function Standard05({ data }: { data: InvitationData }) {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#FAFAF8] text-[#3D4035] font-sans">
      <div className="bg-[#EAECE3] p-10 text-center rounded-b-[60px]">
        <div className="text-[#758062] tracking-widest text-sm mb-6 uppercase">Save the date</div>
        <h1 className="text-3xl font-medium text-[#4C5340] mb-8">{data.couple.groom.name} & {data.couple.bride.name}</h1>
        <img src={data.gallery[4]} className="w-48 h-64 mx-auto object-cover rounded-full shadow-lg border-4 border-white" alt="Couple" />
      </div>

      <div className="p-10 text-center">
        <h2 className="text-xl text-[#758062] mb-6">초대합니다</h2>
        <p className="text-sm leading-[2.2] text-gray-600 mb-12">
          {data.greeting.content}
        </p>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAECE3]">
          <p className="font-bold text-[#4C5340] mb-2">{data.venue.name}</p>
          <p className="text-xs text-gray-500">{data.venue.address}</p>
        </div>
      </div>
    </div>
  );
}

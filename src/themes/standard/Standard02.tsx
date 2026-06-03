import React from 'react';
import type { InvitationData } from '../../data/invitationData';

export default function Standard02({ data }: { data: InvitationData }) {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-white text-gray-800 font-sans shadow-2xl relative">
      <div className="p-10 pt-20 text-center">
        <h1 className="text-3xl font-light tracking-widest mb-2">{data.couple.groom.name} & {data.couple.bride.name}</h1>
        <p className="text-sm text-gray-400 mb-10 tracking-widest">WEDDING INVITATION</p>
        
        <img 
          src={data.gallery[0]} 
          alt="Couple" 
          className="w-full h-80 object-cover rounded-lg shadow-sm mb-10"
        />

        <p className="whitespace-pre-line text-[15px] leading-loose text-gray-600 mb-10">
          {data.greeting.content}
        </p>

        <div className="w-full h-[1px] bg-gray-200 mb-10"></div>

        <h2 className="text-xl font-medium mb-4">Date</h2>
        <p className="text-lg text-gray-700 mb-10">{new Date(data.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>

        <h2 className="text-xl font-medium mb-4">Location</h2>
        <p className="text-lg text-gray-700 mb-2">{data.venue.name}</p>
        <p className="text-sm text-gray-500 mb-10">{data.venue.address}</p>
      </div>
    </div>
  );
}

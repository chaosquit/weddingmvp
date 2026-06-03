import React from 'react';
import type { InvitationData } from '../../data/invitationData';

export default function Magazine05({ data }: { data: InvitationData }) {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#F0F2F5] text-gray-900 font-sans relative overflow-hidden">
      {/* Abstract Blur Background */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute top-40 -right-20 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-20 left-10 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="relative z-10 p-6 pt-12 space-y-6">
        <header className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/50 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            {data.couple.groom.name} & {data.couple.bride.name}
          </h1>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">You&apos;re Invited</p>
        </header>

        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/50 overflow-hidden">
          <img src={data.gallery[1]} className="w-full h-72 object-cover" alt="Glassmorphism" />
          <div className="p-6 text-center">
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{data.greeting.content}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/50 flex flex-col items-center justify-center">
            <span className="text-xs uppercase text-gray-500 font-bold mb-1">Date</span>
            <span className="text-lg font-semibold">{new Date(data.date).toLocaleDateString().slice(0, -1)}</span>
          </div>
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/50 flex flex-col items-center justify-center text-center">
            <span className="text-xs uppercase text-gray-500 font-bold mb-1">Location</span>
            <span className="text-sm font-semibold">{data.venue.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

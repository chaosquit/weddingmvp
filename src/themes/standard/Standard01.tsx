import React from 'react';
import type { InvitationData } from '../../data/invitationData';

export default function Standard01({ data }: { data: InvitationData }) {
  // Format the date
  const dateObj = new Date(data.date);
  const formattedDate = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#FDFBF7] text-[#4A4A4A] font-serif shadow-xl overflow-hidden relative">
      {/* Decorative Floral Background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-[url('https://images.unsplash.com/photo-1508759074092-23c2182b8472?q=80&w=800&auto=format&fit=crop')] bg-cover bg-bottom opacity-20"></div>

      {/* Hero */}
      <header className="pt-32 pb-16 px-8 text-center relative z-10">
        <h2 className="text-sm tracking-[4px] text-[#8B7B6B] mb-8 uppercase">Wedding Invitation</h2>
        <h1 className="text-4xl mb-4 font-light text-[#2C2C2C]">
          {data.couple.groom.name} <span className="text-xl mx-2">&amp;</span> {data.couple.bride.name}
        </h1>
        <p className="mt-8 text-lg text-[#6B5B4B]">{formattedDate}</p>
        <p className="mt-2 text-sm text-[#8B7B6B]">{data.venue.name}</p>
      </header>

      {/* Main Photo */}
      <div className="px-6 mb-16 relative z-10">
        <img 
          src={data.gallery[0]} 
          alt="Couple" 
          className="w-full h-[500px] object-cover rounded-t-full shadow-md"
        />
      </div>

      {/* Greeting */}
      <section className="px-8 py-12 text-center bg-white">
        <h3 className="text-xl mb-8 text-[#8B7B6B]">{data.greeting.title}</h3>
        <p className="whitespace-pre-line leading-relaxed text-[15px] mb-12">
          {data.greeting.content}
        </p>
        
        <div className="space-y-4 text-[15px]">
          <div className="flex justify-center items-center gap-2">
            <span className="w-24 text-right text-[#8B7B6B]">{data.couple.groom.father} · {data.couple.groom.mother}</span>
            <span className="text-xs text-gray-400">의 {data.couple.groom.relation}</span>
            <strong className="text-lg w-12 text-left">{data.couple.groom.name}</strong>
          </div>
          <div className="flex justify-center items-center gap-2">
            <span className="w-24 text-right text-[#8B7B6B]">{data.couple.bride.father} · {data.couple.bride.mother}</span>
            <span className="text-xs text-gray-400">의 {data.couple.bride.relation}</span>
            <strong className="text-lg w-12 text-left">{data.couple.bride.name}</strong>
          </div>
        </div>
      </section>

      {/* Gallery (Simple Grid) */}
      <section className="px-6 py-16 bg-[#FDFBF7]">
        <h3 className="text-center text-xl mb-10 text-[#8B7B6B]">Gallery</h3>
        <div className="grid grid-cols-2 gap-3">
          {data.gallery.slice(1, 5).map((img, i) => (
            <img key={i} src={img} alt={`Gallery ${i}`} className="w-full h-40 object-cover rounded-md shadow-sm" />
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="px-8 py-16 bg-white text-center">
        <h3 className="text-xl mb-6 text-[#8B7B6B]">Location</h3>
        <p className="font-bold text-lg mb-2">{data.venue.name}</p>
        <p className="text-sm text-gray-500 mb-8">{data.venue.address} {data.venue.detail}</p>
        
        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-8 border border-gray-200">
          <span className="text-gray-400 text-sm">Map Placeholder</span>
        </div>

        <div className="text-left text-sm space-y-4">
          <div>
            <strong className="text-[#8B7B6B] block mb-1">지하철</strong>
            <p>{data.venue.transport.subway}</p>
          </div>
          <div>
            <strong className="text-[#8B7B6B] block mb-1">주차</strong>
            <p>{data.venue.transport.parking}</p>
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="px-8 py-16 bg-[#FDFBF7] text-center border-t border-[#EAE1D5]">
        <h3 className="text-xl mb-8 text-[#8B7B6B]">마음 전하실 곳</h3>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EAE1D5] text-left">
            <p className="font-bold mb-2">신랑측</p>
            <p className="text-sm mb-4">{data.couple.groom.bank} {data.couple.groom.account}</p>
            <button className="w-full py-2 bg-[#F5F0E6] text-[#8B7B6B] rounded text-sm hover:bg-[#EAE1D5] transition">복사하기</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EAE1D5] text-left">
            <p className="font-bold mb-2">신부측</p>
            <p className="text-sm mb-4">{data.couple.bride.bank} {data.couple.bride.account}</p>
            <button className="w-full py-2 bg-[#F5F0E6] text-[#8B7B6B] rounded text-sm hover:bg-[#EAE1D5] transition">복사하기</button>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center bg-[#8B7B6B] text-[#FDFBF7] text-sm">
        <p>감사합니다.</p>
        <p className="mt-4 opacity-70 text-xs">Created with Studio Chaos</p>
      </footer>
    </div>
  );
}

import React from 'react';
import type { InvitationData } from '../../data/invitationData';

export default function Magazine01({ data }: { data: InvitationData }) {
  const dateObj = new Date(data.date);

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Hero */}
      <header className="h-[90vh] relative flex flex-col justify-end p-8">
        <div className="absolute inset-0 z-0">
          <img 
            src={data.gallery[1]} 
            alt="Hero" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="uppercase tracking-[0.3em] text-xs text-[#FF3366] mb-4 font-bold">The Wedding Issue</div>
          <h1 className="text-[5rem] leading-[0.85] font-black uppercase tracking-tighter mb-6">
            {data.couple.groom.name}<br />&amp;<br />{data.couple.bride.name}
          </h1>
          <p className="text-lg font-bold tracking-widest border-t border-white/30 pt-4">
            {dateObj.getFullYear()}. {String(dateObj.getMonth() + 1).padStart(2, '0')}. {String(dateObj.getDate()).padStart(2, '0')}
          </p>
        </div>
      </header>

      {/* Marquee */}
      <div className="bg-[#FF3366] text-black py-3 overflow-hidden whitespace-nowrap font-black uppercase text-xl tracking-wider">
        <div className="animate-[scroll_10s_linear_infinite] inline-block">
          WE ARE GETTING MARRIED • {data.couple.groom.name} & {data.couple.bride.name} • {data.venue.name} • 
          WE ARE GETTING MARRIED • {data.couple.groom.name} & {data.couple.bride.name} • {data.venue.name} • 
        </div>
      </div>

      {/* Content */}
      <section className="p-8 pb-20">
        <h2 className="text-4xl font-black uppercase mb-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
          Prologue
        </h2>
        <p className="text-lg leading-relaxed font-light mb-12 border-l-2 border-[#FF3366] pl-4">
          {data.greeting.content}
        </p>

        {/* Dynamic Gallery */}
        <div className="grid grid-cols-2 gap-4 mb-16">
          <div className="col-span-2">
            <img src={data.gallery[2]} className="w-full h-64 object-cover" alt="Gallery" />
          </div>
          <div>
            <img src={data.gallery[3]} className="w-full h-48 object-cover" alt="Gallery" />
          </div>
          <div>
            <img src={data.gallery[4]} className="w-full h-48 object-cover" alt="Gallery" />
          </div>
        </div>

        {/* Location & Account Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#111] p-6 col-span-2 border border-white/10">
            <h3 className="text-xs uppercase tracking-widest text-[#FF3366] mb-2">Location</h3>
            <p className="text-2xl font-bold mb-1">{data.venue.name}</p>
            <p className="text-sm text-gray-400">{data.venue.address}</p>
          </div>
          
          <div className="bg-[#111] p-6 border border-white/10">
            <h3 className="text-xs uppercase tracking-widest text-[#FF3366] mb-4">Groom</h3>
            <p className="text-sm mb-2">{data.couple.groom.bank}</p>
            <p className="font-mono text-sm">{data.couple.groom.account}</p>
          </div>
          
          <div className="bg-[#111] p-6 border border-white/10">
            <h3 className="text-xs uppercase tracking-widest text-[#FF3366] mb-4">Bride</h3>
            <p className="text-sm mb-2">{data.couple.bride.bank}</p>
            <p className="font-mono text-sm">{data.couple.bride.account}</p>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}

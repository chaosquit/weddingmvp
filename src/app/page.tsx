'use client';

import { useState } from 'react';
import { mockInvitationData } from '../data/invitationData';
import ThemeRenderer from '../components/ThemeRenderer';

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState('standard-01');

  return (
    <div className="min-h-screen bg-gray-900 flex text-white">
      {/* Sidebar: Theme Selector */}
      <aside className="w-80 bg-gray-800 p-6 flex flex-col border-r border-gray-700 h-screen overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2">Theme Factory</h1>
        <p className="text-gray-400 text-sm mb-8">모바일 청첩장 빌더 데모</p>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">Standard Series</h2>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedTheme('standard-01')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition ${selectedTheme === 'standard-01' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                1. Classic Floral
              </button>
              <button 
                onClick={() => setSelectedTheme('standard-02')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition ${selectedTheme === 'standard-02' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                2. Modern White
              </button>
              <button 
                onClick={() => setSelectedTheme('standard-03')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition ${selectedTheme === 'standard-03' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                3. Simple Pastel
              </button>
              <button 
                onClick={() => setSelectedTheme('standard-04')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition ${selectedTheme === 'standard-04' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                4. Elegant Dark
              </button>
              <button 
                onClick={() => setSelectedTheme('standard-05')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition ${selectedTheme === 'standard-05' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                5. Botanical Nature
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">Magazine Series</h2>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedTheme('magazine-01')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition ${selectedTheme === 'magazine-01' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                1. Bold Typo
              </button>
              <button 
                onClick={() => setSelectedTheme('magazine-02')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition ${selectedTheme === 'magazine-02' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                2. Editorial Vogue
              </button>
              <button 
                onClick={() => setSelectedTheme('magazine-03')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition ${selectedTheme === 'magazine-03' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                3. Y2K Street
              </button>
              <button 
                onClick={() => setSelectedTheme('magazine-04')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition ${selectedTheme === 'magazine-04' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                4. Film Noir
              </button>
              <button 
                onClick={() => setSelectedTheme('magazine-05')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition ${selectedTheme === 'magazine-05' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                5. Glassmorphism
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content: Mobile Preview */}
      <main className="flex-1 flex items-center justify-center bg-black/50 p-8">
        <div className="relative w-[480px] h-[850px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-gray-800">
          <div className="w-full h-full overflow-y-auto no-scrollbar relative">
            <ThemeRenderer themeId={selectedTheme} data={mockInvitationData} />
          </div>
        </div>
      </main>
    </div>
  );
}

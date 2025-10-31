'use client';

import { useAccount } from '@/contexts/AccountContext';

interface CompactSidebarProps {
  onNavigate: (destination: 'home' | 'tts' | 'lexicon') => void;
  activeApp: 'tts' | 'lexicon' | null;
}

export default function CompactSidebar({ onNavigate, activeApp }: CompactSidebarProps) {
  const { account } = useAccount();

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
      {/* Home Icon */}
      <button
        onClick={() => onNavigate('home')}
        className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
          !activeApp 
            ? 'bg-gray-700 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Home"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>

      {/* TTS Icon */}
      <button
        onClick={() => onNavigate('tts')}
        className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
          activeApp === 'tts'
            ? 'bg-gray-700 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Text-to-Speech"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>

      {/* Lexicon Icon */}
      <button
        onClick={() => onNavigate('lexicon')}
        className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
          activeApp === 'lexicon'
            ? 'bg-gray-700 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Lexicon Editor"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
    </div>
  );
}


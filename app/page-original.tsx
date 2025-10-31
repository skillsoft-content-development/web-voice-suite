'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useAccount } from '@/contexts/AccountContext';
import AccountModal from '@/components/account/AccountModal';

export default function Home() {
  const { account } = useAccount();
  const [showAccountModal, setShowAccountModal] = useState(false);

  const tools = [
    {
      name: 'Text-to-Speech',
      description: 'Convert your text into natural-sounding speech with customizable voices and pronunciation lexicons.',
      href: 'https://web-tts-content-development.dev.eastus.aks.skillsoft.com/', // TTS App
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      features: ['Multiple voice options', 'Custom pronunciation', 'Audio export', 'Real-time preview']
    },
    {
      name: 'Lexicon Editor',
      description: 'Create and manage pronunciation lexicons to improve text-to-speech accuracy for specialized terms.',
      href: 'https://web-lexicon-editor-content-development.dev.eastus.aks.skillsoft.com/', // Lexicon Editor
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      features: ['Visual pronunciation guide', 'Import/Export lexicons', 'Search and filter', 'Cloud storage integration']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      {/* Account Button */}
      <div className="max-w-[900px] mx-auto mb-4 flex justify-end">
        <button
          onClick={() => setShowAccountModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-gray-700 font-medium">
            {account ? account.name : 'Account'}
          </span>
        </button>
      </div>

      <div className="max-w-[900px] mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="relative h-[120px]">
          <div 
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              backgroundImage: 'url(/images/6.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent" />
          <div className="relative h-full px-6 flex items-center">
            <div className="text-white">
              <h1 className="text-3xl font-bold tracking-tight">Skillsoft Voice Suite</h1>
              <p className="mt-1 text-sm text-gray-200">Professional tools for text-to-speech and pronunciation management</p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="px-6 py-6">
          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <div key={tool.name} className="group">
                <div className="bg-gray-50 rounded-xl p-5 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 p-2.5 bg-gray-700 rounded-lg text-white group-hover:bg-gray-800 transition-colors">
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.name}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-5">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {tool.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium text-sm"
                  >
                    Launch {tool.name}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* How They Work Together Section */}
          <div className="mt-8 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">How They Work Together</h2>
            <div className="text-sm text-gray-700 leading-relaxed">
              <p className="mb-3">
                The Skillsoft Voice Suite provides a complete workflow for creating professional audio content. Start by using the 
                <strong className="text-gray-900"> Lexicon Editor</strong> to define custom pronunciations for specialized terms, 
                technical jargon, or proper names that our TTS engine might mispronounce.
              </p>
              <p className="mb-3">
                Once your pronunciation rules are established, switch to the 
                <strong className="text-gray-900"> Text-to-Speech</strong> app to generate high-quality audio. 
                The TTS app automatically applies our global lexicon, while any custom lexicons you create can be manually selected within the app to ensure accurate pronunciation of your specialized vocabulary.
              </p>
              <p>
                This integrated approach ensures consistent, professional-quality audio output perfect for e-learning modules, 
                presentations, training materials, and any content requiring precise pronunciation of technical or specialized terms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 pb-6 text-center">
        <p className="text-sm text-gray-500">
          Skillsoft Voice Suite - Professional Text-to-Speech and Lexicon Management Tools
        </p>
      </footer>

      {/* Account Modal */}
      <AccountModal 
        isOpen={showAccountModal} 
        onClose={() => setShowAccountModal(false)} 
      />
    </div>
  );
}





'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useAccount } from '@/contexts/AccountContext';
import TtsIframe from '@/components/apps/TtsIframe';
import LexiconIframe from '@/components/apps/LexiconIframe';
import CompactSidebar from '@/components/layout/CompactSidebar';

export default function Home() {
  const { account, loading, logout, login, register, error } = useAccount();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeIframe, setActiveIframe] = useState<string | null>(null);
  const [isMorphing, setIsMorphing] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    const success = await login(email, password);
    if (!success) {
      // Error is already set in the context
    }
    setIsLoading(false);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    const success = await register(email, password, name);
    setIsLoading(false);
  };

  const tools = [
    {
      name: 'Text-to-Speech',
      description: 'Convert your text into natural-sounding speech with customizable voices and pronunciation lexicons.',
      href: 'https://web-tts-content-development.dev.eastus.aks.skillsoft.com/',
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
      href: 'https://web-lexicon-editor-content-development.dev.eastus.aks.skillsoft.com/',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      features: ['Visual pronunciation guide', 'Import/Export lexicons', 'Search and filter', 'Cloud storage integration']
    }
  ];

  const handleLaunchApp = (appName: string) => {
    // For other apps, open in new tab for now
    if (appName !== 'Text-to-Speech' && appName !== 'Lexicon Editor') {
      const tool = tools.find(t => t.name === appName);
      if (tool) {
        window.open(tool.href, '_blank', 'noopener,noreferrer');
        return;
      }
    }
    
    // Set iframe first
    if (appName === 'Text-to-Speech') {
      setActiveIframe('tts');
    } else if (appName === 'Lexicon Editor') {
      setActiveIframe('lexicon');
    }
    
    // Start morphing animation - landing page morphs to left, sidebar slides in
    setIsMorphing(true);
    
    // Show sidebar after tiny delay so it starts off-screen then slides in
    requestAnimationFrame(() => {
      setSidebarVisible(true);
    });
    
    // After animation completes, hide landing page
    setTimeout(() => {
      setShowLandingPage(false);
      setIsMorphing(false);
    }, 600);
  };

  const handleNavigate = (destination: 'home' | 'tts' | 'lexicon') => {
    if (destination === 'home') {
      // Start morphing animation - sidebar morphs back to homepage
      setShowLandingPage(true);
      setIsMorphing(true);
      setSidebarVisible(false);
      
      setTimeout(() => {
        setActiveIframe(null);
        setIsMorphing(false);
      }, 600);
    } else if (destination === 'tts') {
      setActiveIframe('tts');
    } else if (destination === 'lexicon') {
      setActiveIframe('lexicon');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9fafb] to-[#f3f4f6] relative overflow-hidden">
      {/* Landing page that morphs to left */}
      {(showLandingPage || isMorphing) && (
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-[600ms] ease-in-out ${
          isMorphing && activeIframe
            ? 'scale-[0.15] translate-x-[-45vw] opacity-20 pointer-events-none'
            : 'scale-100 translate-x-0 opacity-100'
        }`}>
          <div className="w-full max-w-[900px] h-[664px] bg-white rounded-xl shadow-2xl border border-[#f3f4f6] flex flex-col overflow-hidden">
        {/* Header - Matching TTS/Lexicon style */}
        <div className="relative h-[120px] flex-shrink-0 rounded-t-xl overflow-hidden">
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
              <h1 className="text-3xl font-bold tracking-tight">Skillsoft Voice Production Suite</h1>
              <p className="mt-1 text-sm text-gray-200">Your hub for accessing voice production tools</p>
            </div>
          </div>
        </div>

        {/* Main Content - Compact layout that fits */}
        <div className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-700 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading...</p>
                    </div>
                    </div>
          ) : account ? (
            <div className="h-full flex flex-col">
              {/* Authenticated User View - Compact */}
              {/* User Info Bar */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e5e7eb]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {account.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[#111827] text-sm">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.email}</p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Sign Out
                </button>
              </div>

              {/* Applications Section */}
              <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-sm font-semibold text-[#111827] mb-3">Applications</h3>
                <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
                  {tools.map((tool) => {
                    // API key check for backend - not displayed to user
                    const apiKey = account.apiKeys.find(key => 
                      (tool.name === 'Text-to-Speech' && key.service === 'tts') ||
                      (tool.name === 'Lexicon Editor' && key.service === 'lexicon')
                    );
                    
                    return (
                      <div
                        key={tool.name}
                        className="group flex flex-col p-5 rounded-lg border transition-all duration-300 bg-gray-50 border-[#e5e7eb] hover:shadow-md"
                      >
                        {/* App Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-shrink-0 p-2 rounded text-white transition-colors bg-gray-700 group-hover:bg-gray-800">
                            {tool.icon}
                          </div>
                          <h4 className="font-semibold text-[#111827] text-base">{tool.name}</h4>
                        </div>
                        
                        {/* App Description */}
                        <p className="text-sm text-gray-600 mb-5 flex-1 leading-relaxed">{tool.description}</p>
                        
                        {/* Action Buttons */}
                        <div className="mt-auto">
                          <button
                            onClick={() => handleLaunchApp(tool.name)}
                            className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded w-full transition-colors font-medium"
                          >
                            <span>Launch App</span>
                            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center max-w-sm mx-auto">
              {/* Unauthenticated User View - Compact */}
              <div className="text-center mb-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-[#111827] mb-1">Welcome to Skillsoft Voice Production Suite</h2>
                <p className="text-sm text-gray-600">Sign in to access voice production tools</p>
              </div>

              {/* Compact Auth Form */}
              <div className="bg-gray-50 rounded-lg p-4 border border-[#e5e7eb]">
                {authMode === 'login' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                        placeholder="demo@skillsoft.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                        placeholder="demo123"
                      />
                    </div>
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded p-2">
                        <p className="text-red-600 text-xs">{error}</p>
                      </div>
                    )}
                    <button 
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full bg-gray-700 text-white py-2 px-4 rounded text-sm hover:bg-gray-800 disabled:opacity-50"
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <p className="text-xs text-center text-gray-600">
                      Don't have an account? <button onClick={() => setAuthMode('register')} className="text-gray-700 hover:text-gray-900">Create one</button>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <button 
                      onClick={handleRegister}
                      disabled={isLoading}
                      className="w-full bg-gray-700 text-white py-2 px-4 rounded text-sm hover:bg-gray-800 disabled:opacity-50"
                    >
                      {isLoading ? 'Creating...' : 'Create Account'}
                    </button>
                    <p className="text-xs text-center text-gray-600">
                      Already have an account? <button onClick={() => setAuthMode('login')} className="text-gray-700 hover:text-gray-900">Sign in</button>
                    </p>
                  </div>
                )}
              </div>

              {/* Demo Account Button */}
              <div className="mt-3">
                <button 
                  onClick={async () => {
                    setEmail('demo@skillsoft.com');
                    setPassword('demo123');
                    setAuthMode('login');
                    // Use the values directly since state updates are async
                    const success = await login('demo@skillsoft.com', 'demo123');
                    if (success) {
                      // Login successful
                    }
                  }}
                  className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 text-center hover:bg-blue-100 transition-colors"
                >
                  <p className="text-sm text-blue-700 font-medium">
                    Sign in with Demo Account
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    demo@skillsoft.com / demo123
                  </p>
                </button>
              </div>
          </div>
          )}
          </div>
        </div>
        </div>
      )}
      
      {/* Sidebar layout that appears from morphing landing page */}
      {activeIframe && (
        <div className={`absolute inset-0 transition-all duration-[600ms] ease-in-out ${
          sidebarVisible && (!showLandingPage || isMorphing)
            ? 'translate-x-0 opacity-100'
            : 'translate-x-[100%] opacity-0 pointer-events-none'
        }`}>
          <div className="min-h-screen bg-gray-100 flex w-full">
            <CompactSidebar
              onNavigate={handleNavigate}
              activeApp={activeIframe === 'tts' ? 'tts' : activeIframe === 'lexicon' ? 'lexicon' : null}
            />
            <div className="flex-1">
              <TtsIframe
                isOpen={activeIframe === 'tts'}
                onClose={() => handleNavigate('home')}
              />
              <LexiconIframe
                isOpen={activeIframe === 'lexicon'}
                onClose={() => handleNavigate('home')}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 
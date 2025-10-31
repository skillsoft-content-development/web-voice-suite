'use client';

import { useAccount } from '@/contexts/AccountContext';
import { useState } from 'react';

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLaunchApp: (appName: string) => void;
}

export default function AppSidebar({ isCollapsed, onToggleCollapse, onLaunchApp }: AppSidebarProps) {
  const { account } = useAccount();
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const tools = [
    {
      name: 'Text-to-Speech',
      description: 'Convert your text into natural-sounding speech with customizable voices and pronunciation lexicons.',
      href: 'https://web-tts-content-development.dev.eastus.aks.skillsoft.com/',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      service: 'tts' as const
    },
    {
      name: 'Lexicon Editor',
      description: 'Create and manage pronunciation lexicons to improve text-to-speech accuracy for specialized terms.',
      href: 'https://web-lexicon-editor-content-development.dev.eastus.aks.skillsoft.com/',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      service: 'lexicon' as const
    }
  ];

  if (!account) return null;

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        {isCollapsed ? (
          <div className="flex items-center justify-center">
            <button
              onClick={onToggleCollapse}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              title="Expand sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {account.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">{account.name}</h2>
                <p className="text-xs text-gray-500">{account.email}</p>
              </div>
            </div>
            <button
              onClick={onToggleCollapse}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              title="Collapse sidebar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        {!isCollapsed && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Applications</h3>
            {tools.map((tool) => {
              // For lexicon editor, check for either tts or lexicon key
              let hasApiKey = false;
              let apiKey = null;
              
              if (tool.service === 'lexicon') {
                // Lexicon editor requires lexicon key, TTS key is supplementary
                const lexiconKey = account.apiKeys.find(key => key.service === 'lexicon' && key.isActive);
                hasApiKey = !!lexiconKey;
                apiKey = lexiconKey;
              } else {
                // For other apps, use the specific service key
                apiKey = account.apiKeys.find(key => key.service === tool.service && key.isActive);
                hasApiKey = !!apiKey;
              }
              
              return (
                <div
                  key={tool.name}
                  className={`group p-3 rounded-lg border transition-all duration-200 ${
                    hasApiKey 
                      ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' 
                      : 'bg-gray-100 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-lg text-white ${
                      hasApiKey ? 'bg-gray-700' : 'bg-gray-400'
                    }`}>
                      {tool.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{tool.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{tool.description}</p>
                      
                      {/* API Key Status */}
                      <div className="mt-2">
                        {apiKey ? (
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600">API Key Active</span>
                            </div>
                            <button
                              onClick={() => {
                                const newVisibleKeys = new Set(visibleKeys);
                                if (visibleKeys.has(apiKey.id)) {
                                  newVisibleKeys.delete(apiKey.id);
                                } else {
                                  newVisibleKeys.add(apiKey.id);
                                }
                                setVisibleKeys(newVisibleKeys);
                              }}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              {visibleKeys.has(apiKey.id) ? 'Hide' : 'Show'} Key
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">No API key configured</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Launch Button */}
                  <div className="mt-3">
                    {hasApiKey ? (
                      <button
                        onClick={() => onLaunchApp(tool.name)}
                        className="w-full flex items-center justify-center space-x-2 text-xs text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 transition-colors"
                      >
                        <span>Launch</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    ) : (
                      <div className="w-full text-xs text-gray-400 text-center py-2">
                        API Key Required
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {isCollapsed && (
          <div className="space-y-2">
            {tools.map((tool) => {
              // For lexicon editor, check for either tts or lexicon key
              let hasApiKey = false;
              let apiKey = null;
              
              if (tool.service === 'lexicon') {
                // Lexicon editor requires lexicon key, TTS key is supplementary
                const lexiconKey = account.apiKeys.find(key => key.service === 'lexicon' && key.isActive);
                hasApiKey = !!lexiconKey;
                apiKey = lexiconKey;
              } else {
                // For other apps, use the specific service key
                apiKey = account.apiKeys.find(key => key.service === tool.service && key.isActive);
                hasApiKey = !!apiKey;
              }
              
              return (
                <button
                  key={tool.name}
                  onClick={() => hasApiKey && onLaunchApp(tool.name)}
                  disabled={!hasApiKey}
                  className={`w-full p-3 rounded-lg transition-colors ${
                    hasApiKey 
                      ? 'bg-gray-50 hover:bg-gray-100 text-gray-700' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  title={tool.name}
                >
                  <div className="flex items-center justify-center">
                    <div className={`p-2 rounded-lg text-white ${
                      hasApiKey ? 'bg-gray-700' : 'bg-gray-400'
                    }`}>
                      {tool.icon}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Online</span>
            </div>
            <button
              onClick={() => {
                // Handle logout
                window.location.reload();
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        )}
        
        {isCollapsed && (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
